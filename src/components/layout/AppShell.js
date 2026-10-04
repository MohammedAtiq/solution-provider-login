"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/config/routes";
import Header from "./Header";
import Sidebar from "./Sidebar";

/** Header + Sidebar + scrolling content area for every signed-in page. */
export default function AppShell({ children }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        queryClient.clear();
        toast.success("You have been logged out");
        router.replace(ROUTES.LOGIN);
    };

    return (
        <div className="min-h-screen bg-page">
            <Header user={user} onMenuClick={() => setSidebarOpen((prev) => !prev)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
            <main className="px-4 pb-10 pt-[calc(theme(spacing.header)+1.5rem)] sm:px-6 lg:ms-sidebar">{children}</main>
        </div>
    );
}
