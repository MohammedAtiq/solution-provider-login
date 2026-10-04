"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import gs1Logo from "@/assets/images/gs1-logo.png";
import { ROUTES } from "@/config/routes";

const getInitials = (name = "") =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

export default function Header({ user, onMenuClick }) {
    return (
        <header className="fixed inset-x-0 top-0 z-50 flex h-header items-center justify-between bg-surface px-4 shadow-soft sm:px-6">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-primary hover:bg-page lg:hidden"
                    aria-label="Toggle navigation"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <Link href={ROUTES.DASHBOARD} className="flex items-center gap-3">
                    <Image src={gs1Logo} alt="GS1 Saudi Arabia" className="h-10 w-auto" priority />
                    <span className="hidden border-s border-line ps-3 text-sm font-bold text-primary sm:inline">
                        Solution Provider Portal
                    </span>
                </Link>
            </div>

            {user && (
                <div className="flex items-center gap-3">
                    <div className="hidden text-end sm:block">
                        <p className="text-sm font-semibold text-heading">{user.name}</p>
                        <p className="text-xs text-muted">{user.role}</p>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                        {getInitials(user.name)}
                    </span>
                </div>
            )}
        </header>
    );
}
