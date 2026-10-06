const isDev = process.env.NODE_ENV !== "production";

/** Backend the /backend/* proxy forwards to (set in .env.production). Unset → no proxy. */
const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/+$/, "");

/** Origin of the backend API, so the CSP lets the browser call it. */
function apiOrigin() {
    try {
        return new URL(process.env.NEXT_PUBLIC_API_BASE_URL).origin;
    } catch {
        return "";
    }
}

/*
 * Content-Security-Policy. Scripts/styles need 'unsafe-inline' for Next's inline
 * bootstrap and toast styles; 'unsafe-eval' only in dev (React Refresh).
 * Product images come from many hosts, so img-src stays open to http(s).
 */
const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data:",
    `connect-src 'self' ${apiOrigin()}${isDev ? " ws: wss:" : ""}`.trim(),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    poweredByHeader: false,
    async redirects() {
        return [{ source: "/", destination: "/login", permanent: false }];
    },
    async rewrites() {
        if (!apiProxyTarget) return [];
        return [{ source: "/backend/:path*", destination: `${apiProxyTarget}/:path*` }];
    },
    async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
    },
};

export default nextConfig;
