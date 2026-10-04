/** Centralised route paths — link through these instead of hardcoding. */
export const ROUTES = {
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    PRODUCTS: "/products",
    PRODUCT_DETAIL: (gtin) => `/products/${encodeURIComponent(gtin)}`,
    VBG_APPLICATION: "/vbg-application",
};

/** External GS1 Saudi Arabia "Verified by GS1" (VBG) application — set in .env. */
export const VBG_APP_URL = process.env.NEXT_PUBLIC_VBG_APP_URL || "";
