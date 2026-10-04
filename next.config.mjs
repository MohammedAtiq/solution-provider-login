/**
 * The backend is plain HTTP, which an HTTPS site (Vercel) is not allowed to call
 * from the browser. So the browser calls same-origin /backend/* and Next.js
 * forwards it server-side to API_PROXY_TARGET.
 */
const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/+$/, "");

if (!apiProxyTarget) {
    console.warn("⚠️  API_PROXY_TARGET is not set — /backend/* will 404 and login/products will fail. See .env.example");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    async redirects() {
        return [{ source: "/", destination: "/login", permanent: false }];
    },
    async rewrites() {
        if (!apiProxyTarget) return [];
        return [{ source: "/backend/:path*", destination: `${apiProxyTarget}/:path*` }];
    },
};

export default nextConfig;
