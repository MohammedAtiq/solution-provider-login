import { Manrope } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const manrope = Manrope({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-manrope",
    display: "swap",
});

export const metadata = {
    title: {
        default: "Solution Provider Portal",
        template: "%s | Solution Provider Portal",
    },
    description: "GS1 Saudi Arabia solution provider portal — browse and search the product catalogue.",
    icons: {
        icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png", sizes: "512x512" }],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#002c6c",
};

export default function RootLayout({ children }) {
    return (
        // suppressHydrationWarning: browser extensions (e.g. Grammarly) add attributes to <html>/<body> before React hydrates
        <html lang="en" dir="ltr" className={manrope.variable} suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
