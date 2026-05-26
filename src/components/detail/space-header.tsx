'use client'

import { MapPin, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/common/star-rating'
import { VerifiedBadge } from '@/components/common/verified-badge'
import { CATEGORIES } from '@/lib/constants'
import type { Space } from '@/types'

interface SpaceHeaderProps {
  space: Space
}

export function SpaceHeader({ space }: SpaceHeaderProps) {
  const categoryMeta = CATEGORIES.find((c) => c.value === space.category)

  function handleShare() {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {
        // silently fail
      })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
          {space.title}
        </h1>
        <button
          onClick={handleShare}
          aria-label="Share this space"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors shrink-0 mt-1"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categoryMeta && (
          <Badge variant="outline" className="capitalize">
            {categoryMeta.label}
          </Badge>
        )}
        {space.isVerified && <VerifiedBadge />}
        <StarRating rating={space.rating} reviewCount={space.reviewCount} />
      </div>

      <div className="flex items-center gap-1.5 text-slate-500">
        <MapPin className="h-4 w-4 shrink-0" />
        <span className="text-sm">
          {space.location.address}, {space.location.city}
        </span>
      </div>
    </div>
  )
}
