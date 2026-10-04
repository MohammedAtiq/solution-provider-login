/** @type {import('tailwindcss').Config} */

/*
 * Design tokens mirror Gs1WebformsFrontend (common.css :root block) so this
 * portal looks like the member portal: GS1 navy primary, orange accent,
 * #f0f5fa page tint and the Manrope face.
 */
module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#002c6c",
                    dark: "#001f4d",
                    soft: "#e8eef7",
                },
                accent: {
                    DEFAULT: "#cd3c0d",
                    dark: "#b5350b",
                },
                page: "#f0f5fa",
                surface: "#ffffff",
                heading: "#1a2e5a",
                body: "#212529",
                muted: "#6c757d",
                line: {
                    DEFAULT: "#e2e8f0",
                    strong: "#d0d6dd",
                    input: "#b0b6be",
                },
                success: { DEFAULT: "#065f46", soft: "#d1fae5", line: "#6ee7b7" },
                danger: { DEFAULT: "#dc3545", soft: "#fee2e2" },
            },
            fontFamily: {
                sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
            },
            boxShadow: {
                soft: "0 4px 10px rgba(15, 23, 42, 0.06)",
                card: "0 10px 20px -5px rgba(12, 20, 50, 0.12)",
            },
            spacing: {
                sidebar: "240px",
                header: "70px",
            },
        },
    },
    plugins: [],
};
