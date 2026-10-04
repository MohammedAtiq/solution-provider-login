/**
 * Test partner account shown on the login page's "Demo account" box — set in .env.
 * Development only: production builds always drop these values, so a real
 * password can never end up in the public JS bundle.
 */
const isDev = process.env.NODE_ENV !== "production";

export const DEMO_CREDENTIALS = {
    email: isDev ? process.env.NEXT_PUBLIC_DEMO_EMAIL || "" : "",
    password: isDev ? process.env.NEXT_PUBLIC_DEMO_PASSWORD || "" : "",
};

export const HAS_DEMO_CREDENTIALS = Boolean(DEMO_CREDENTIALS.email && DEMO_CREDENTIALS.password);
