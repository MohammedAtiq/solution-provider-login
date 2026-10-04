"use client";

import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Input — label, leading icon, error message and hint in one component.
 * `type="password"` gets a show/hide toggle automatically.
 */
const Input = forwardRef(function Input(
    { label, error, hint, icon: Icon, type = "text", id, className, inputClassName, required, ...props },
    ref
) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
        <div className={cn("w-full", className)}>
            {label && (
                <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-heading">
                    {label}
                    {required && <span className="ms-0.5 text-accent">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <Icon className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                )}
                <input
                    ref={ref}
                    id={inputId}
                    type={isPassword && showPassword ? "text" : type}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={cn(
                        "h-11 w-full rounded-lg border bg-white px-3 text-sm text-body placeholder:text-muted/70",
                        "transition-colors focus:outline-none focus:ring-4",
                        error
                            ? "border-danger focus:border-danger focus:ring-danger/15"
                            : "border-line-input focus:border-primary focus:ring-primary/15",
                        Icon && "ps-10",
                        isPassword && "pe-11",
                        inputClassName
                    )}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute end-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:text-primary"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>

            {error ? (
                <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-danger">{error}</p>
            ) : hint ? (
                <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p>
            ) : null}
        </div>
    );
});

export default Input;
