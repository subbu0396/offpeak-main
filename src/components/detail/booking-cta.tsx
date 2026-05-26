'use client'

import { getPricingForSpace } from "@/lib/mock-data"
import { useBookingStore } from "@/store/booking-store"
import { useBidStore } from "@/store/bid-store"
import { PriceTag } from "@/components/common/price-tag"
import { Button } from "@/components/ui/button"
import { BookingSheet } from "@/components/booking/booking-sheet"
import { CheckoutDialog } from "@/components/booking/checkout-dialog"
import { BookingConfirmationDialog } from "@/components/booking/booking-confirmation-dialog"
// BidSheet wired in Task 32
import { BidSheet } from "@/components/booking/bid-sheet"
import type { Space } from "@/types"

interface BookingCTAProps {
  space: Space
}

export function BookingCTA({ space }: BookingCTAProps) {
  const pricing = getPricingForSpace(space.id)
  const openBookingSheet = useBookingStore((s) => s.openBookingSheet)
  const openCheckout = useBookingStore((s) => s.openCheckout)
  const openBidSheet = useBidStore((s) => s.openBidSheet)

  return (
    <>
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:sticky lg:bottom-0 lg:border-t-0 lg:shadow-none">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {pricing ? (
            <PriceTag
              basePrice={pricing.basePrice}
              discountPercent={pricing.offPeakDiscount > 0 ? pricing.offPeakDiscount : undefined}
            />
          ) : (
            <span className="text-sm text-slate-500">Pricing on request</span>
          )}
          <div className="flex gap-2">
            {space.biddingEnabled && (
              <Button variant="outline" onClick={() => openBidSheet()}>
                Make an Offer
              </Button>
            )}
            <Button
              onClick={() => (space.instantBook ? openBookingSheet() : openCheckout())}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Booking sub-flows */}
      <BookingSheet space={space} />
      <CheckoutDialog space={space} />
      <BookingConfirmationDialog space={space} />
      <BidSheet space={space} />
    </>
  )
}
