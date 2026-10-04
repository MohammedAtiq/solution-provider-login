import { cn } from "@/lib/utils";

const TONES = {
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success-soft text-success",
    indigo: "bg-indigo-50 text-indigo-600",
};

/** StatCard — icon + label + value tile for dashboards. */
export default function StatCard({ icon: Icon, label, value, hint, tone = "primary", className }) {
    return (
        <div className={cn("flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-soft", className)}>
            {Icon && (
                <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", TONES[tone])}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
            )}
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
                <p className="mt-1 truncate text-xl font-bold text-heading">{value}</p>
                {hint && <p className="mt-0.5 truncate text-xs text-muted">{hint}</p>}
            </div>
        </div>
    );
}
