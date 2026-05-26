import { Skeleton } from '@/components/ui/skeleton'
import { SpaceCardSkeleton } from '@/components/common/skeleton-loaders'

function FlashDealCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-72 rounded-xl overflow-hidden ring-1 ring-foreground/10">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    </div>
  )
}

export default function DealsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Tabs skeleton */}
      <Skeleton className="h-9 w-80" />

      {/* Flash deals skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <FlashDealCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Promo grid skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SpaceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
