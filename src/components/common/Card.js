import { cn } from "@/lib/utils";

/** Card — white surface. Pass `title` / `action` for a header row. */
export default function Card({ title, subtitle, action, className, bodyClassName, children }) {
    const hasHeader = title || action;

    return (
        <section className={cn("rounded-2xl bg-surface shadow-soft", className)}>
            {hasHeader && (
                <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
                    <div>
                        {title && <h2 className="text-base font-bold text-heading">{title}</h2>}
                        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
                    </div>
                    {action}
                </header>
            )}
            <div className={cn("p-5", bodyClassName)}>{children}</div>
        </section>
    );
}
