import { cn } from "@/lib/utils";

/** Skeleton — pulsing placeholder block; size it with className. */
export default function Skeleton({ className }) {
    return <div className={cn("animate-pulse rounded-md bg-slate-200", className)} aria-hidden="true" />;
}
