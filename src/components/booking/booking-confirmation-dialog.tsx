'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useBookingStore } from '@/store/booking-store'
import { getPricingForSpace } from '@/lib/mock-data'
import { QRCodeDisplay } from '@/components/booking/qr-code-display'
import { RedemptionQR } from '@/components/deals/redemption-qr'
import { CalendarSyncButton } from '@/components/booking/calendar-sync-button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Space, Booking } from '@/types'

interface BookingConfirmationDialogProps {
  space: Space
}

export function BookingConfirmationDialog({ space }: BookingConfirmationDialogProps) {
  const {
    isConfirmationOpen,
    closeConfirmation,
    lastBookingId,
    selectedDate,
    selectedTimeSlot,
    calculateTotalPrice,
    resetBooking,
    promoCode,
    promoValidation,
  } = useBookingStore()

  const pricingRule = getPricingForSpace(space.id)
  const thumbnail = space.photos[0]
  const totalPrice = pricingRule ? calculateTotalPrice(pricingRule) : 0
  const symbol = pricingRule?.currency === 'GBP' ? '£' : (pricingRule?.currency ?? '£')

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—'

  const formattedTime =
    selectedTimeSlot ? `${selectedTimeSlot.start} – ${selectedTimeSlot.end}` : '—'

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
          totalPrice,
          currency: pricingRule?.currency ?? 'GBP',
          createdAt: new Date().toISOString(),
        }
      : null

  const handleDone = () => {
    closeConfirmation()
    resetBooking()
  }

  return (
    <Dialog
      open={isConfirmationOpen}
      onOpenChange={(open) => {
        if (!open) handleDone()
      }}
    >
      <DialogContent className="max-w-sm overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="sr-only">Booking Confirmed</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <CheckCircle className="h-12 w-12 text-green-500" />

          <h2 className="text-xl font-bold text-slate-900">Booking Confirmed!</h2>

          {/* Space thumbnail + name */}
          <div className="flex items-center gap-3 w-full text-left">
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
          <div className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-left space-y-0.5">
            <p className="font-medium text-slate-700">{formattedDate}</p>
            <p className="text-slate-500">{formattedTime}</p>
          </div>

          {/* Total price */}
          <p className="text-base font-semibold text-slate-800">
            Total:{' '}
            {totalPrice === 0 ? 'Free' : `${symbol}${totalPrice.toFixed(2)}`}
          </p>

          {/* QR Code */}
          {lastBookingId && <QRCodeDisplay value={lastBookingId} />}

          {/* Redemption QR — shown when a promo code was applied */}
          {lastBookingId && promoCode && promoValidation?.valid && (
            <div className="w-full flex flex-col gap-2">
              <p className="text-xs font-semibold text-slate-700 text-center">
                Redemption Instructions
              </p>
              <RedemptionQR bookingId={lastBookingId} promotionCode={promoCode} />
            </div>
          )}

          {/* Calendar sync */}
          {mockBooking && (
            <CalendarSyncButton booking={mockBooking} spaceName={space.title} />
          )}

          {/* Directions */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${space.location.lat},${space.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-600 hover:underline"
          >
            Get Directions
          </a>

          {/* View bookings */}
          <Link
            href="/bookings"
            className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
          >
            View Bookings
          </Link>
        </div>

        {/* Footer */}
        <div className="-mx-4 -mb-4 flex justify-end rounded-b-xl border-t bg-muted/50 p-4">
          <Button
            onClick={handleDone}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
