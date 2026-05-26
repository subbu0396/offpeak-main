import { Skeleton } from '@/components/ui/skeleton'
import { BookingCardSkeleton } from '@/components/common/skeleton-loaders'

export default function BookingsLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header skeleton */}
      <Skeleton className="h-9 w-40" />

      {/* Tabs skeleton */}
      <Skeleton className="h-9 w-72" />

      {/* Booking cards skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <BookingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
