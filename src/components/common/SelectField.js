"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SelectField — native select styled to match Input.
 * options: [{ value, label }]; `placeholder` renders as the empty-value option.
 */
export default function SelectField({ label, options = [], placeholder, value, onChange, disabled, className, id, ...props }) {
    const autoId = useId();
    const selectId = id ?? autoId;

    return (
        <div className={cn("w-full", className)}>
            {label && (
                <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold text-heading">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={selectId}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                    className={cn(
                        "h-11 w-full appearance-none rounded-lg border border-line-input bg-white pe-10 ps-3 text-sm text-body",
                        "focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:bg-page disabled:text-muted"
                    )}
                    {...props}
                >
                    {placeholder !== undefined && <option value="">{placeholder}</option>}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            </div>
        </div>
    );
}
