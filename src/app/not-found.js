import Link from "next/link";
import { ROUTES } from "@/config/routes";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-page px-4 text-center">
            <p className="text-6xl font-extrabold text-primary">404</p>
            <h1 className="text-xl font-bold text-heading">Page not found</h1>
            <p className="text-sm text-muted">The page you are looking for does not exist.</p>
            <Link href={ROUTES.DASHBOARD} className="mt-3 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                Back to dashboard
            </Link>
        </div>
    );
}
