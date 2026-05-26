import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboardLoading() {
  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <Skeleton className="h-8 w-48" />

      {/* KPI card skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl ring-1 ring-foreground/10 bg-card p-4 space-y-3"
          >
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-12" />
          </div>
        ))}
      </div>

      {/* Recent reports skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl ring-1 ring-foreground/10 bg-card px-4 py-3 flex items-center gap-3"
          >
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-72" />
            </div>
            <Skeleton className="h-5 w-20 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
