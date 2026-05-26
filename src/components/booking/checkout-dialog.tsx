'use client'

import Image from 'next/image'
import { CheckCircle, CreditCard } from 'lucide-react'
import { StepIndicator } from '@/components/common/step-indicator'
import { useBookingStore } from '@/store/booking-store'
import { getPricingForSpace } from '@/lib/mock-data'
import { AvailabilityCalendar } from '@/components/detail/availability-calendar'
import { PriceBreakdown } from '@/components/detail/price-breakdown'
import { PromoCodeInput } from '@/components/booking/promo-code-input'
import { QRCodeDisplay } from '@/components/booking/qr-code-display'
import { CalendarSyncButton } from '@/components/booking/calendar-sync-button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Space, Booking } from '@/types'

interface CheckoutDialogProps {
  space: Space
}

const CHECKOUT_STEPS = [
  { label: 'Select Slot' },
  { label: 'Promo Code' },
  { label: 'Review' },
  { label: 'Confirmed' },
]

export function CheckoutDialog({ space }: CheckoutDialogProps) {
  const {
    isCheckoutOpen,
    closeCheckout,
    checkoutStep,
    nextCheckoutStep,
    prevCheckoutStep,
    selectedDate,
    selectedTimeSlot,
    lastBookingId,
    openConfirmation,
    resetBooking,
    calculateTotalPrice,
  } = useBookingStore()

  const pricingRule = getPricingForSpace(space.id)
  const thumbnail = space.photos[0]

  const canProceedStep1 = selectedDate !== null && selectedTimeSlot !== null

  const handleConfirm = () => {
    const bookingId = 'booking-' + Date.now()
    openConfirmation(bookingId)
    nextCheckoutStep()
  }

  const handleDone = () => {
    closeCheckout()
    resetBooking()
  }

  // Build a mock Booking for CalendarSyncButton on step 4
  const mockBooking: Booking | null =
    lastBookingId && selectedDate && selectedTimeSlot
      ? {
          id: lastBookingId,
          spaceId: space.id,
          seekerId: 'seeker-001',
          startTime: new Date(
            `${selectedDate.toISOString().split('T')[0]}T${selectedTimeSlot.start}:00`
          ).toISOString(),
          endTime: new Date(
            `${selectedDate.toISOString().split('T')[0]}T${selectedTimeSlot.end}:00`
          ).toISOString(),
          status: 'CONFIRMED',
          totalPrice: pricingRule ? calculateTotalPrice(pricingRule) : 0,
          currency: pricingRule?.currency ?? 'GBP',
          createdAt: new Date().toISOString(),
        }
      : null

  const totalPrice = pricingRule ? calculateTotalPrice(pricingRule) : 0
  const symbol = pricingRule?.currency === 'GBP' ? '£' : (pricingRule?.currency ?? '£')

  const formattedDate =
    selectedDate
      ? selectedDate.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '—'

  const formattedTime =
    selectedTimeSlot ? `${selectedTimeSlot.start} – ${selectedTimeSlot.end}` : '—'

  return (
    <Dialog
      open={isCheckoutOpen}
      onOpenChange={(open) => {
        if (!open) closeCheckout()
      }}
    >
      <DialogContent
        className="max-w-lg overflow-y-auto max-h-[90vh]"
        showCloseButton={checkoutStep < 4}
      >
        <DialogHeader>
          <DialogTitle>
            {checkoutStep === 1 && 'Select a Slot'}
            {checkoutStep === 2 && 'Add a Promo Code'}
            {checkoutStep === 3 && 'Review &amp; Confirm'}
            {checkoutStep === 4 && 'Booking Confirmed!'}
          </DialogTitle>
          <StepIndicator steps={CHECKOUT_STEPS} currentStep={checkoutStep} variant="dots" />
        </DialogHeader>

        {/* Step 1 — Select Slot */}
        {checkoutStep === 1 && (
          <div className="space-y-4">
            <AvailabilityCalendar spaceId={space.id} />
            <div className="-mx-4 -mb-4 flex justify-end gap-2 rounded-b-xl border-t bg-muted/50 p-4">
              <Button

                disabled={!canProceedStep1}
                onClick={nextCheckoutStep}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 — Add Promo */}
        {checkoutStep === 2 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Have a promo code?</p>
              <PromoCodeInput />
            </div>
            {pricingRule && (
              <PriceBreakdown pricingRule={pricingRule} selectedSlot={selectedTimeSlot} />
            )}
            <div className="-mx-4 -mb-4 flex justify-between items-center gap-2 rounded-b-xl border-t bg-muted/50 p-4">
              <button
                type="button"
                onClick={nextCheckoutStep}
                className="text-sm text-slate-500 hover:text-slate-700 underline-offset-4 hover:underline"
              >
                Skip
              </button>
              <Button

                onClick={nextCheckoutStep}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {checkoutStep === 3 && (
          <div className="space-y-4">
            {/* Space summary */}
            <div className="flex items-center gap-3">
              {thumbnail && (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                  <Image src={thumbnail} alt={space.title} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-900 leading-snug">{space.title}</p>
                <p className="text-xs text-slate-500">{space.location.address}</p>
              </div>
            </div>

            {/* Date/time */}
            <div className="rounded-lg border border-slate-200 px-3 py-2 text-sm space-y-0.5">
              <p className="font-medium text-slate-700">{formattedDate}</p>
              <p className="text-slate-500">{formattedTime}</p>
            </div>

            {/* Price breakdown */}
            {pricingRule && (
              <PriceBreakdown pricingRule={pricingRule} selectedSlot={selectedTimeSlot} />
            )}

            {/* Cancellation policy */}
            <p className="text-xs text-slate-500">
              Free cancellation up to 24 hours before your booking.
            </p>

            {/* Payment method */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
              <CreditCard className="h-4 w-4 text-slate-500 shrink-0" />
              <span>Payment method: Visa ending 4242</span>
            </div>

            <div className="-mx-4 -mb-4 flex justify-between gap-2 rounded-b-xl border-t bg-muted/50 p-4">
              <Button variant="outline" onClick={prevCheckoutStep}>
                Back
              </Button>
              <Button

                onClick={handleConfirm}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )}

        {/* Step 4 — Confirmation */}
        {checkoutStep === 4 && (
          <div className="flex flex-col items-center gap-4 py-2">
            <CheckCircle className="h-14 w-14 text-green-500" />
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Booking Confirmed!</h3>
              <p className="text-sm text-slate-500 mt-1">
                {formattedDate} &bull; {formattedTime}
              </p>
            </div>

            {lastBookingId && (
              <QRCodeDisplay value={lastBookingId} />
            )}

            {mockBooking && (
              <CalendarSyncButton booking={mockBooking} spaceName={space.title} />
            )}

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${space.location.lat},${space.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-teal-600 hover:underline"
            >
              Get Directions
            </a>

            <p className="text-sm font-semibold text-slate-800">
              Total: {totalPrice === 0 ? 'Free' : `${symbol}${totalPrice.toFixed(2)}`}
            </p>

            <div className="-mx-4 -mb-4 w-[calc(100%+2rem)] flex justify-end rounded-b-xl border-t bg-muted/50 p-4">
              <Button

                onClick={handleDone}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
