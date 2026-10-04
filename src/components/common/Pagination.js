"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

/** Pagination — "Showing x–y of z" plus prev/next. */
export default function Pagination({ page, pageSize, total, hasMore, onPageChange, disabled }) {
    if (!total) return null;

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);
    const canNext = hasMore ?? page < totalPages;

    return (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
                Showing <span className="font-semibold text-heading">{from.toLocaleString()}–{to.toLocaleString()}</span> of{" "}
                <span className="font-semibold text-heading">{total.toLocaleString()}</span>
            </p>
            <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" leftIcon={<ChevronLeft className="h-4 w-4 rtl:rotate-180" />} disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>
                    Previous
                </Button>
                <span className="px-2 text-sm font-semibold text-heading">
                    {page.toLocaleString()} / {totalPages.toLocaleString()}
                </span>
                <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="h-4 w-4 rtl:rotate-180" />} disabled={disabled || !canNext} onClick={() => onPageChange(page + 1)}>
                    Next
                </Button>
            </div>
        </div>
    );
}
