"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCategories, useProducts, getApiErrorMessage } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { isNumericQuery } from "@/utils/product";
import { Button, Input, PageHeader, Pagination, SelectField, StateMessage } from "@/components/common";
import ProductCard, { ProductCardSkeleton } from "@/components/products/ProductCard";

const PAGE_SIZE = 12;

function ProductsContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Filters live in the URL so Back from a product detail restores them
    const q = searchParams.get("q") ?? "";
    const category = searchParams.get("category") ?? "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    const [searchInput, setSearchInput] = useState(q);
    const debouncedSearch = useDebounce(searchInput, 500);

    const updateParams = (updates) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === "" || value == null || (key === "page" && value === 1)) params.delete(key);
            else params.set(key, String(value));
        });
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    // Push the debounced search box into the URL (and reset to page 1)
    useEffect(() => {
        if (debouncedSearch.trim() !== q) updateParams({ q: debouncedSearch.trim(), page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const categoriesQuery = useCategories();
    const productsQuery = useProducts({ search: q, category, page, pageSize: PAGE_SIZE });

    const categoryOptions = useMemo(
        () => (categoriesQuery.data ?? []).map((c) => ({ value: c.name, label: c.name })),
        [categoriesQuery.data]
    );

    const { data, isLoading, isError, error, isFetching, refetch } = productsQuery;
    const items = data?.items ?? [];
    const isGtinSearch = isNumericQuery(q);
    const hasFilters = Boolean(q || category);

    const clearFilters = () => {
        setSearchInput("");
        updateParams({ q: "", category: "", page: 1 });
    };

    const changePage = (next) => {
        updateParams({ page: next });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const renderResults = () => {
        if (isLoading) {
            return (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
                </div>
            );
        }

        if (isError) {
            return <StateMessage variant="error" title="Could not load products" description={getApiErrorMessage(error)} onRetry={refetch} />;
        }

        if (data?.error === "invalid_gtin") {
            return (
                <StateMessage
                    title="Invalid GTIN"
                    description="Numeric searches are treated as a GTIN. Enter a valid Saudi GTIN starting with 628 (e.g. 6281000851937)."
                />
            );
        }

        if (!items.length) {
            return (
                <StateMessage
                    title="No products found"
                    description={hasFilters ? "Try a different search term or category." : "There are no products to show yet."}
                    action={hasFilters && <Button size="sm" onClick={clearFilters}>Clear filters</Button>}
                />
            );
        }

        return (
            <>
                <div className={`grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${isFetching ? "opacity-60" : ""}`}>
                    {items.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
                <Pagination page={page} pageSize={PAGE_SIZE} total={data.total} hasMore={data.hasMore} onPageChange={changePage} disabled={isFetching} />
            </>
        );
    };

    return (
        <>
            <PageHeader
                title="Products"
                subtitle={hasFilters ? "Filtered results from the product catalogue" : "Latest products registered in the GS1 catalogue"}
            />

            <div className="mb-6 grid gap-3 rounded-2xl bg-surface p-4 shadow-soft md:grid-cols-[1fr_260px_auto] md:items-end">
                <Input
                    label="Search"
                    icon={Search}
                    placeholder="Product name, brand or GTIN"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    hint={isGtinSearch && searchInput ? "Searching by GTIN (exact match)" : undefined}
                />
                <SelectField
                    label="Category"
                    placeholder={categoriesQuery.isLoading ? "Loading..." : "All categories"}
                    options={categoryOptions}
                    value={category}
                    onChange={(value) => updateParams({ category: value, page: 1 })}
                    disabled={categoriesQuery.isLoading || isGtinSearch}
                />
                <Button variant="secondary" className="h-11" leftIcon={<X className="h-4 w-4" />} onClick={clearFilters} disabled={!hasFilters && !searchInput}>
                    Clear
                </Button>
            </div>

            {renderResults()}
        </>
    );
}

export default function ProductsPage() {
    // useSearchParams needs a Suspense boundary for static rendering
    return (
        <Suspense fallback={null}>
            <ProductsContent />
        </Suspense>
    );
}
