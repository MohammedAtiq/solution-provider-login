/**
 * API Endpoints Configuration
 * Single source of every backend endpoint string — change paths here only.
 * Base URL comes from NEXT_PUBLIC_API_BASE_URL (see .env.example).
 */

export const API_ENDPOINTS = {
    // Auth — body { user_id, password } → { status, message, access_token, token_type }
    PARTNER_LOGIN: "/partner_login",

    // Categories (product types)
    GET_CATEGORIES: "/product_type/",

    // Product listing
    GET_NEW_PRODUCTS: "/new_products",
    // Filter by `product_type` (category name) and/or free-text `search`
    GET_SIMILAR_PRODUCTS: "/similar_products",

    // Product detail by GTIN / barcode
    GET_PRODUCT_BY_GTIN: "/product_by_gtin",
};
