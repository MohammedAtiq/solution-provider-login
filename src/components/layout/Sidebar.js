"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, PackageSearch, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

/** Add a sidebar entry here; `match` decides the active state. */
export const NAV_ITEMS = [
    { key: "dashboard", label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { key: "products", label: "View Products", href: ROUTES.PRODUCTS, icon: PackageSearch },
    { key: "vbg", label: "VBG Application", href: ROUTES.VBG_APPLICATION, icon: ShieldCheck },
];

const isActive = (pathname, href) => pathname === href || pathname.startsWith(`${href}/`);

export default function Sidebar({ open, onClose, onLogout }) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={cn("fixed inset-0 z-30 bg-slate-900/40 transition-opacity lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside
                className={cn(
                    "fixed bottom-0 start-0 top-header z-40 flex w-sidebar flex-col bg-surface px-2 py-3 shadow-soft transition-transform duration-300",
                    "lg:translate-x-0",
                    open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
                )}
                aria-label="Main navigation"
            >
                <nav className="flex-1 overflow-y-auto">
                    <ul className="flex flex-col gap-1">
                        {NAV_ITEMS.map(({ key, label, href, icon: Icon }) => {
                            const active = isActive(pathname, href);
                            return (
                                <li key={key}>
                                    <Link
                                        href={href}
                                        onClick={onClose}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                            active ? "bg-primary text-white" : "text-body hover:bg-page"
                                        )}
                                    >
                                        <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                                        <span className="truncate">{label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <button
                    type="button"
                    onClick={onLogout}
                    className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
                >
                    <LogOut className="h-[18px] w-[18px] rtl:rotate-180" aria-hidden="true" />
                    Logout
                </button>
            </aside>
        </>
    );
}
