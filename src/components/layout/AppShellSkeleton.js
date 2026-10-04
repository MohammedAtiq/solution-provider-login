import Skeleton from "@/components/common/Skeleton";

/** Shown while the session is being restored, so pages never flash unauthenticated. */
export default function AppShellSkeleton() {
    return (
        <div className="min-h-screen bg-page">
            <div className="fixed inset-x-0 top-0 flex h-header items-center bg-surface px-6 shadow-soft">
                <Skeleton className="h-10 w-28" />
            </div>
            <div className="fixed bottom-0 start-0 top-header hidden w-sidebar space-y-2 bg-surface p-3 shadow-soft lg:block">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-4 px-6 pt-[calc(theme(spacing.header)+1.5rem)] lg:ms-sidebar">
                <Skeleton className="h-8 w-60" />
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
                </div>
            </div>
        </div>
    );
}
