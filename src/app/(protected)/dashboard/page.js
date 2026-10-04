"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Barcode, Building2, CalendarDays, Clock, PackageSearch, Search, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/config/routes";
import { formatDate } from "@/utils/product";
import { Button, Card, DetailRow, Input, PageHeader, StatCard } from "@/components/common";

const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

const joinParts = (...parts) => parts.filter(Boolean).join(", ");

export default function DashboardPage() {
    const router = useRouter();
    const { user, loggedInAt } = useAuth();
    const [query, setQuery] = useState("");

    const handleQuickSearch = (event) => {
        event.preventDefault();
        const q = query.trim();
        router.push(q ? `${ROUTES.PRODUCTS}?q=${encodeURIComponent(q)}` : ROUTES.PRODUCTS);
    };

    return (
        <>
            <PageHeader title="Dashboard" subtitle="Overview of your solution provider account" />

            {/* Welcome banner */}
            <section className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-6 text-white shadow-card sm:p-8">
                <p className="text-sm font-medium text-white/70">Welcome back</p>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{user.name}</h2>
                <p className="mt-2 max-w-xl text-sm text-white/80">
                    Browse and search the GS1 Saudi Arabia product catalogue, and open any product to see its full details.
                </p>
                <Button variant="accent" className="mt-5" rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />} onClick={() => router.push(ROUTES.PRODUCTS)}>
                    View products
                </Button>
            </section>

            {/* Quick stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={UserRound} label="Role" value={user.role} tone="primary" />
                <StatCard icon={Barcode} label="GS1 Company Prefix" value={user.gcp || "—"} hint={user.gln ? `GLN ${user.gln}` : undefined} tone="accent" />
                <StatCard icon={CalendarDays} label="Member since" value={formatDate(user.memberSince)} tone="success" />
                <StatCard icon={Clock} label="Signed in" value={formatDateTime(loggedInAt)} tone="indigo" />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
                <Card title="Account details" subtitle="Your profile on this portal" className="xl:col-span-2">
                    <dl>
                        <DetailRow label="Full name" value={user.name} />
                        <DetailRow label="Email" value={user.email} />
                        <DetailRow label="Phone" value={user.phone} />
                        <DetailRow label="Company" value={user.company} />
                        <DetailRow label="Location" value={joinParts(user.city, user.country)} />
                        <DetailRow label="Account ID" value={user.id} />
                    </dl>
                </Card>

                <div className="space-y-6">
                    <Card title="Quick product search" subtitle="Search by product name, brand or GTIN">
                        <form onSubmit={handleQuickSearch} className="space-y-3">
                            <Input
                                icon={Search}
                                placeholder="e.g. burger or 6281000851937"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                aria-label="Search products"
                            />
                            <Button type="submit" fullWidth leftIcon={<PackageSearch className="h-4 w-4" />}>
                                Search products
                            </Button>
                        </form>
                    </Card>

                    <Card title="Company" bodyClassName="flex items-center gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <Building2 className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <p className="truncate font-bold text-heading">{user.company || "—"}</p>
                            <p className="text-sm text-muted">{joinParts(user.city, user.country) || "—"}</p>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}
