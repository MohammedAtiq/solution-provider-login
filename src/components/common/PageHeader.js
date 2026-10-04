import { cn } from "@/lib/utils";

/** Page heading row — title, optional subtitle, actions on the end side. */
export default function PageHeader({ title, subtitle, actions, className }) {
    return (
        <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
            <div>
                <h1 className="text-2xl font-bold text-primary">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}
