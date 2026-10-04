"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = {
    primary: "bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary/40",
    accent: "bg-accent text-white hover:bg-accent-dark focus-visible:ring-accent/40",
    outline: "border border-primary text-primary bg-white hover:bg-primary-soft focus-visible:ring-primary/30",
    secondary: "border border-line-strong text-body bg-white hover:bg-page focus-visible:ring-line-strong",
    ghost: "text-body hover:bg-page focus-visible:ring-line-strong",
    danger: "bg-danger text-white hover:opacity-90 focus-visible:ring-danger/40",
    link: "text-primary underline-offset-4 hover:underline px-0 py-0 h-auto",
};

const SIZES = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10",
};

/**
 * Button — variants: primary | accent | outline | secondary | ghost | danger | link
 * sizes: sm | md | lg | icon. `loading` swaps in a spinner and disables the button.
 */
const Button = forwardRef(function Button(
    { variant = "primary", size = "md", loading = false, loadingText, leftIcon, rightIcon, fullWidth, className, disabled, children, type = "button", ...props },
    ref
) {
    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
                VARIANTS[variant],
                SIZES[size],
                fullWidth && "w-full",
                className
            )}
            {...props}
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : leftIcon}
            {loading && loadingText ? loadingText : children}
            {!loading && rightIcon}
        </button>
    );
});

export default Button;
