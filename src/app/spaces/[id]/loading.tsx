import { SpaceDetailSkeleton } from "@/components/common/skeleton-loaders"

export default function SpaceDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SpaceDetailSkeleton />
    </div>
  )
}
