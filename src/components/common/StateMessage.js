import { AlertTriangle, PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./Button";

/**
 * StateMessage — shared empty / error panel.
 * variant "empty" (default) or "error"; pass onRetry to show a retry button.
 */
export default function StateMessage({ variant = "empty", title, description, onRetry, action, className }) {
    const isError = variant === "error";
    const Icon = isError ? AlertTriangle : PackageSearch;

    return (
        <div className={cn("flex flex-col items-center justify-center rounded-2xl bg-surface px-6 py-14 text-center shadow-soft", className)}>
            <span className={cn("mb-4 flex h-14 w-14 items-center justify-center rounded-full", isError ? "bg-danger-soft text-danger" : "bg-primary-soft text-primary")}>
                <Icon className="h-7 w-7" aria-hidden="true" />
            </span>
            <h3 className="text-base font-bold text-heading">{title ?? (isError ? "Something went wrong" : "Nothing to show")}</h3>
            {description && <p className="mt-1 max-w-md text-sm text-muted">{description}</p>}
            {(onRetry || action) && (
                <div className="mt-5 flex gap-2">
                    {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>}
                    {action}
                </div>
            )}
        </div>
    );
}
