'use client'

import { useBookingStore } from '@/store/booking-store'
import {
  getPricingForSpace,
  getOwnerForSpace,
} from '@/lib/mock-data'
import { ImageGallery } from './image-gallery'
import { SpaceHeader } from './space-header'
import { PriceBreakdown } from './price-breakdown'
import { AvailabilityCalendar } from './availability-calendar'
import { AmenityList } from './amenity-list'
import { OwnerInfo } from './owner-info'
import { ReviewSection } from './review-section'
import { Separator } from '@/components/ui/separator'
import type { Space } from '@/types'

interface SpaceDetailContentProps {
  space: Space
}

export function SpaceDetailContent({ space }: SpaceDetailContentProps) {
  const pricingRule = getPricingForSpace(space.id)
  const owner = getOwnerForSpace(space.id)
  const selectedSlot = useBookingStore((s) => s.selectedTimeSlot)

  return (
    <div className="space-y-6">
      <ImageGallery photos={space.photos} title={space.title} />
      <SpaceHeader space={space} />
      <Separator />
      {pricingRule && (
        <PriceBreakdown pricingRule={pricingRule} selectedSlot={selectedSlot} />
      )}
      <Separator />
      <AvailabilityCalendar spaceId={space.id} />
      <Separator />
      <AmenityList amenities={space.amenities} />
      <Separator />
      <OwnerInfo owner={owner} />
      <Separator />
      <ReviewSection spaceId={space.id} />
    </div>
  )
}
