import { MapSkeleton } from '@/components/common/skeleton-loaders'
import { SpaceCardSkeleton } from '@/components/common/skeleton-loaders'

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left panel skeleton */}
      <div className="w-2/5 border-r flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SpaceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel skeleton */}
      <div className="w-3/5">
        <MapSkeleton />
      </div>
    </div>
  )
}
