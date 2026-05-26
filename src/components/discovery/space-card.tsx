'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useSpaceStore } from '@/store/space-store'
import { getPricingForSpace } from '@/lib/mock-data'
import { CATEGORIES } from '@/lib/constants'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OffPeakBadge } from '@/components/common/offpeak-badge'
import { VerifiedBadge } from '@/components/common/verified-badge'
import { StarRating } from '@/components/common/star-rating'
import { PriceTag } from '@/components/common/price-tag'
import { ShortlistButton } from '@/components/common/shortlist-button'
import type { Space } from '@/types'

interface SpaceCardProps {
  space: Space
}

export function SpaceCard({ space }: SpaceCardProps) {
  const selectSpace = useSpaceStore((state) => state.selectSpace)
  const pricing = getPricingForSpace(space.id)
  const categoryMeta = CATEGORIES.find((c) => c.value === space.category)
  const CategoryIcon = categoryMeta?.icon
  const hasOffPeak = pricing && pricing.offPeakDiscount > 0
  const heroPhoto = space.photos[0]

  function handleCardClick() {
    selectSpace(space.id)
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
    <Card
      className="cursor-pointer overflow-hidden p-0 gap-0 transition-shadow hover:shadow-md"
      onClick={handleCardClick}
      role="article"
      aria-label={space.title}
    >
      {/* Hero photo */}
      <div className="relative h-48 w-full">
        {heroPhoto ? (
          <Image
            src={heroPhoto}
            alt={space.title}
            fill
            className="object-cover rounded-t-xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-t-xl bg-slate-100">
            {CategoryIcon && (
              <CategoryIcon className="h-12 w-12 text-slate-500" aria-hidden="true" />
            )}
          </div>
        )}

        {/* Off-peak badge */}
        {hasOffPeak && pricing && (
          <div className="absolute left-2 top-2">
            <OffPeakBadge discountPercent={pricing.offPeakDiscount} />
          </div>
        )}

        {/* Shortlist button */}
        <div className="absolute right-2 top-2">
          <ShortlistButton
            spaceId={space.id}
            className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white"
          />
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 p-4">
        {/* Category badge */}
        {categoryMeta && (
          <Badge variant="outline" className="w-fit text-xs">
            {categoryMeta.label}
          </Badge>
        )}

        {/* Title */}
        <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
          {space.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{space.location.city}</span>
        </div>

        {/* Rating */}
        <StarRating rating={space.rating} reviewCount={space.reviewCount} />

        {/* Price */}
        {pricing && (
          <PriceTag
            basePrice={pricing.basePrice}
            discountPercent={hasOffPeak ? pricing.offPeakDiscount : undefined}
            currency={pricing.currency === 'GBP' ? '£' : pricing.currency}
          />
        )}

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {space.isVerified && <VerifiedBadge />}
          {space.biddingEnabled && (
            <span className="text-xs text-slate-500 italic">Offers accepted</span>
          )}
        </div>
      </div>
    </Card>
    </motion.div>
  )
}
