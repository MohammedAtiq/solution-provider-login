import { cn } from "@/lib/utils";

const VARIANTS = {
    success: "bg-success-soft text-success border-success-line",
    inactive: "bg-gray-100 text-muted border-gray-300",
    primary: "bg-primary-soft text-primary border-primary/20",
    accent: "bg-accent/10 text-accent border-accent/30",
};

/** Badge — small pill for statuses and tags. */
export default function Badge({ variant = "primary", className, children }) {
    return (
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", VARIANTS[variant], className)}>
            {children}
        </span>
    );
}
