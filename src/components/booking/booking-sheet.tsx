'use client'

import Image from 'next/image'
import { useBookingStore } from '@/store/booking-store'
import { getPricingForSpace } from '@/lib/mock-data'
import { PriceBreakdown } from '@/components/detail/price-breakdown'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import type { Space } from '@/types'

interface BookingSheetProps {
  space: Space
}

export function BookingSheet({ space }: BookingSheetProps) {
  const {
    isBookingSheetOpen,
    closeBookingSheet,
    openCheckout,
    openConfirmation,
    selectedDate,
    selectedTimeSlot,
  } = useBookingStore()

  const pricingRule = getPricingForSpace(space.id)

  const handleConfirm = () => {
    const bookingId = 'booking-' + Date.now()
    openConfirmation(bookingId)
    closeBookingSheet()
  }

  const handlePromoLink = () => {
    closeBookingSheet()
    openCheckout()
  }

  const thumbnail = space.photos[0]

  return (
    <Sheet open={isBookingSheetOpen} onOpenChange={(open) => { if (!open) closeBookingSheet() }}>
      <SheetContent side="right" className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Quick Book</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-6 px-4 pb-2 overflow-y-auto">
          {/* Space info */}
          <div className="flex items-center gap-3">
            {thumbnail && (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                <Image
                  src={thumbnail}
                  alt={space.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-900 leading-snug">{space.title}</p>
              <p className="text-xs text-slate-500">{space.location.address}</p>
            </div>
          </div>

          {/* Date / time */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">Date &amp; Time</p>
            {selectedDate && selectedTimeSlot ? (
              <div className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 space-y-0.5">
                <p>{selectedDate.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                <p className="text-slate-500">{selectedTimeSlot.start} – {selectedTimeSlot.end}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Select a date and time first</p>
            )}
          </div>

          {/* Price breakdown */}
          {pricingRule && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Pricing</p>
              <PriceBreakdown pricingRule={pricingRule} selectedSlot={selectedTimeSlot} />
            </div>
          )}

          {/* Promo code link */}
          <div>
            <button
              type="button"
              onClick={handlePromoLink}
              className="text-sm text-teal-600 hover:underline focus-visible:underline outline-none"
            >
              Have a promo code?
            </button>
          </div>
        </div>

        <SheetFooter>
          <Button
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleConfirm}
          >
            Confirm Booking
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
