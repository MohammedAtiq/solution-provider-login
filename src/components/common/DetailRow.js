import { cn } from "@/lib/utils";

/** DetailRow — label / value pair for detail views. Empty values render "—". */
export default function DetailRow({ label, value, dir, className }) {
    const isEmpty = value === null || value === undefined || value === "";

    return (
        <div className={cn("grid grid-cols-1 gap-1 border-b border-line py-3 last:border-b-0 sm:grid-cols-[180px_1fr] sm:gap-4", className)}>
            <dt className="text-sm font-medium text-muted">{label}</dt>
            <dd className="break-words text-sm font-semibold text-heading" dir={dir}>
                {isEmpty ? "—" : value}
            </dd>
        </div>
    );
}
