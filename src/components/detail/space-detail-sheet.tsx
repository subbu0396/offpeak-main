'use client'

import { useSpaceStore } from '@/store/space-store'
import { useBookingStore } from '@/store/booking-store'
import { useBidStore } from '@/store/bid-store'
import { getSpaceById, getPricingForSpace } from '@/lib/mock-data'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { PriceTag } from '@/components/common/price-tag'
import { SpaceDetailContent } from './space-detail-content'
import { BookingSheet } from '@/components/booking/booking-sheet'
import { CheckoutDialog } from '@/components/booking/checkout-dialog'
import { BookingConfirmationDialog } from '@/components/booking/booking-confirmation-dialog'
// BidSheet will be wired in Task 32
import { BidSheet } from '@/components/booking/bid-sheet'

export function SpaceDetailSheet() {
  const { selectedSpaceId, isDetailSheetOpen, closeDetail } = useSpaceStore()
  const space = selectedSpaceId ? getSpaceById(selectedSpaceId) : null
  const pricingRule = space ? getPricingForSpace(space.id) : null
  const { openBookingSheet, openCheckout } = useBookingStore()
  const { openBidSheet } = useBidStore()

  if (!space) return null

  return (
    <>
      <Sheet open={isDetailSheetOpen} onOpenChange={(open) => !open && closeDetail()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl lg:max-w-2xl overflow-y-auto p-0"
        >
          <div className="p-6">
            <SpaceDetailContent space={space} />
          </div>
          {/* Sticky footer with booking CTAs */}
          <div className="sticky bottom-0 border-t bg-white p-4 flex items-center justify-between gap-4">
            <div>
              {pricingRule && (
                <PriceTag
                  basePrice={pricingRule.basePrice}
                  discountPercent={pricingRule.offPeakDiscount}
                />
              )}
            </div>
            <div className="flex gap-2">
              {space.biddingEnabled && (
                <Button variant="outline" onClick={() => openBidSheet()}>
                  Make an Offer
                </Button>
              )}
              <Button
                onClick={() => {
                  if (space.instantBook) {
                    openBookingSheet()
                  } else {
                    openCheckout()
                  }
                }}
              >
                Book Now
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Booking sub-flows rendered outside the detail sheet */}
      <BookingSheet space={space} />
      <CheckoutDialog space={space} />
      <BookingConfirmationDialog space={space} />
      <BidSheet space={space} />
    </>
  )
}
