"use client";

/**
 * All API calls live in this file:
 *   1. apiClient   — axios instance (base URL, headers, timeout, error normalising)
 *   2. apiService  — thin get/post wrappers returning `response.data`
 *   3. productApi  — product catalogue calls (categories, list, search, detail)
 *   4. hooks       — TanStack Query hooks the pages consume
 *
 * Endpoint strings come from ./apiEndpoints.js — never hardcode a path here.
 */

import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "./apiEndpoints";
import { isNumericQuery, mapCompany, mapProduct, validateSaudiGtin } from "@/utils/product";

/* ============================================
   1. Axios client
   ============================================ */

// Defaults to the same-origin /backend proxy (next.config.mjs → API_PROXY_TARGET)
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "/backend";

const apiClient = axios.create({
    baseURL,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    timeout: 30000,
});

/** Backend reports failures as { status:false, error } or FastAPI { detail }. */
export function getApiErrorMessage(error) {
    const data = error?.response?.data;
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.detail === "string") return data.detail;
    if (error?.code === "ERR_NETWORK") return "Could not reach the server. Check your connection.";
    return error?.message || "Something went wrong";
}

const isNotFound = (error) => error?.response?.status === 404;

/* ============================================
   2. Generic service methods
   ============================================ */

export const apiService = {
    get: async (endpoint, params = null, config = {}) => {
        const response = await apiClient.get(endpoint, { params, ...config });
        return response.data;
    },
    post: async (endpoint, data = null, config = {}) => {
        const response = await apiClient.post(endpoint, data, config);
        return response.data;
    },
};

/* ============================================
   3a. Auth API functions
   ============================================ */

export const authApi = {
    /** Partner login — resolves with { accessToken, tokenType }, rejects with the backend message. */
    partnerLogin: async ({ email, password }) => {
        let data;
        try {
            data = await apiService.post(API_ENDPOINTS.PARTNER_LOGIN, { user_id: email, password });
        } catch (error) {
            throw new Error(getApiErrorMessage(error));
        }
        if (!data?.status || !data?.access_token) throw new Error(data?.message || "Invalid email or password");
        return { accessToken: data.access_token, tokenType: data.token_type || "bearer" };
    },
};

/* ============================================
   3b. Product catalogue API functions
   ============================================ */

/** List endpoints return { product: { data, total, has_more } }. */
function toPage(payload) {
    const block = payload?.product ?? payload ?? {};
    const rows = Array.isArray(block.data) ? block.data : [];
    return {
        items: rows.map(mapProduct).filter(Boolean),
        total: Number(block.total) || rows.length,
        hasMore: Boolean(block.has_more),
    };
}

const EMPTY_PAGE = { items: [], total: 0, hasMore: false };

export const productApi = {
    /** Active categories (product types). */
    getCategories: async () => {
        const data = await apiService.get(API_ENDPOINTS.GET_CATEGORIES, { columns: "*", offset: 0, limit: 100 });
        const rows = data?.product_types?.data ?? [];
        return rows
            .filter((row) => Number(row.status) === 1)
            .map((row) => ({ id: String(row.id), name: row.name, nameAr: row.name_ar }));
    },

    /** Latest products, paginated. */
    getNewProducts: async ({ offset = 0, limit = 12 } = {}) => {
        const data = await apiService.get(API_ENDPOINTS.GET_NEW_PRODUCTS, { offset, limit });
        return toPage(data);
    },

    /** Products filtered by category name and/or free-text search. 404 = no matches. */
    getFilteredProducts: async ({ search, category, offset = 0, limit = 12 } = {}) => {
        const params = { offset, limit };
        if (search) params.search = search;
        if (category) params.product_type = category;
        try {
            const data = await apiService.get(API_ENDPOINTS.GET_SIMILAR_PRODUCTS, params);
            return toPage(data);
        } catch (error) {
            if (isNotFound(error)) return EMPTY_PAGE;
            throw error;
        }
    },

    /** Raw product_by_gtin — returns null when the GTIN is unknown. */
    getProductByGtin: async (gtin) => {
        try {
            const data = await apiService.get(API_ENDPOINTS.GET_PRODUCT_BY_GTIN, { gtin });
            return data?.product ? data : null;
        } catch (error) {
            if (isNotFound(error)) return null;
            throw error;
        }
    },

    /** Product + company detail; retries without a leading 0 (GTIN-14 → GTIN-13). */
    getProductDetail: async (gtin) => {
        const value = String(gtin || "").trim();
        let data = await productApi.getProductByGtin(value);
        if (!data && value.startsWith("0")) {
            data = await productApi.getProductByGtin(value.slice(1));
        }
        if (!data) return null;
        return {
            product: mapProduct(data.product),
            company: mapCompany(data.company, data.product),
        };
    },

    /**
     * Search: a numeric query is treated as a GTIN (exact lookup),
     * anything else is a text search, optionally scoped to a category.
     */
    searchProducts: async ({ query, category, offset = 0, limit = 12 }) => {
        const trimmed = String(query || "").trim();

        if (isNumericQuery(trimmed)) {
            const validation = validateSaudiGtin(trimmed);
            if (!validation.ok) return { ...EMPTY_PAGE, error: "invalid_gtin" };
            const data = await productApi.getProductByGtin(validation.gtin);
            const product = mapProduct(data?.product);
            return product ? { items: [product], total: 1, hasMore: false } : EMPTY_PAGE;
        }

        return productApi.getFilteredProducts({ search: trimmed, category, offset, limit });
    },
};

/* ============================================
   4. React Query hooks
   ============================================ */

export const QUERY_KEYS = {
    categories: ["categories"],
    products: (filters) => ["products", filters],
    productDetail: (gtin) => ["product-detail", gtin],
};

/** Active product categories — rarely change, so cache for 30 min. */
export function useCategories(options = {}) {
    return useQuery({
        queryKey: QUERY_KEYS.categories,
        queryFn: productApi.getCategories,
        staleTime: 30 * 60 * 1000,
        ...options,
    });
}

/**
 * Paginated product list. Picks the right endpoint from the filters:
 * search → searchProducts, category only → similar_products, none → new_products.
 */
export function useProducts({ search = "", category = "", page = 1, pageSize = 12 } = {}, options = {}) {
    const offset = (page - 1) * pageSize;
    const query = search.trim();

    return useQuery({
        queryKey: QUERY_KEYS.products({ search: query, category, page, pageSize }),
        queryFn: () => {
            if (query) return productApi.searchProducts({ query, category, offset, limit: pageSize });
            if (category) return productApi.getFilteredProducts({ category, offset, limit: pageSize });
            return productApi.getNewProducts({ offset, limit: pageSize });
        },
        placeholderData: keepPreviousData,
        ...options,
    });
}

/** Single product + company by GTIN. `data` is null when not found. */
export function useProductDetail(gtin, options = {}) {
    return useQuery({
        queryKey: QUERY_KEYS.productDetail(gtin),
        queryFn: () => productApi.getProductDetail(gtin),
        enabled: Boolean(gtin),
        ...options,
    });
}

export default apiClient;
