/**
 * Test partner account shown on the login page's "Demo account" box — set in .env.
 * Leave both values empty (e.g. in production) and the box is hidden.
 * Note: NEXT_PUBLIC_* values are bundled into the browser JS, so never put a real account here.
 */
export const DEMO_CREDENTIALS = {
    email: process.env.NEXT_PUBLIC_DEMO_EMAIL || "",
    password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || "",
};

export const HAS_DEMO_CREDENTIALS = Boolean(DEMO_CREDENTIALS.email && DEMO_CREDENTIALS.password);
