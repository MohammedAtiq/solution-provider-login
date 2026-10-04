"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/config/routes";
import AppShell from "@/components/layout/AppShell";
import AppShellSkeleton from "@/components/layout/AppShellSkeleton";

/**
 * Route guard for every signed-in page: redirects to /login without a session
 * and wraps pages in the Header + Sidebar shell, so pages render content only.
 */
export default function ProtectedLayout({ children }) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.replace(ROUTES.LOGIN);
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !isAuthenticated) return <AppShellSkeleton />;

    return <AppShell>{children}</AppShell>;
}
