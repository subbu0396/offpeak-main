'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, Star, Flag } from 'lucide-react'
import type { Booking, Space } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { QRCodeDisplay } from '@/components/booking/qr-code-display'
import { ReviewFormDialog } from '@/components/booking/review-form-dialog'
import { FlagIssueSheet } from '@/components/booking/flag-issue-sheet'
import { cn } from '@/lib/utils'

interface BookingCardProps {
  booking: Booking
  space: Space
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  switch (status) {
    case 'CONFIRMED':
      return (
        <Badge className="bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/10 h-auto px-2 py-0.5">
          Upcoming
        </Badge>
      )
    case 'COMPLETED':
      return (
        <Badge variant="secondary" className="h-auto px-2 py-0.5">
          Completed
        </Badge>
      )
    case 'CANCELLED':
      return (
        <Badge variant="destructive" className="h-auto px-2 py-0.5">
          Cancelled
        </Badge>
      )
    case 'PENDING':
      return (
        <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/10 h-auto px-2 py-0.5">
          Pending
        </Badge>
      )
    default:
      return null
  }
}

export function BookingCard({ booking, space }: BookingCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [flagOpen, setFlagOpen] = useState(false)
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set())

  function handleReviewOpenChange(open: boolean) {
    if (!open && reviewOpen) {
      // Dialog is closing — mark as reviewed
      setReviewedIds((prev) => new Set(prev).add(booking.id))
    }
    setReviewOpen(open)
  }

  const currency = booking.currency === 'GBP' ? '£' : booking.currency

  return (
    <div className="rounded-xl ring-1 ring-foreground/10 bg-card overflow-hidden">
      {/* Main row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors text-left"
        aria-expanded={expanded}
      >
        {/* Space photo */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
          <Image
            src={space.photos[0] ?? ''}
            alt={space.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-semibold text-sm leading-snug truncate">{space.title}</p>
          <p className="text-xs text-muted-foreground">{formatDateTime(booking.startTime)}</p>
          <p className="text-xs text-muted-foreground">
            to {formatDateTime(booking.endTime)}
          </p>
          <p className="font-bold text-sm text-teal-600">
            {currency}{booking.totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Status + chevron */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={booking.status} />
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200 border-t',
          expanded ? 'max-h-[500px]' : 'max-h-0 border-t-0'
        )}
      >
        <div className="p-4 space-y-4">
          {/* Booking details */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-mono text-xs">{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span className="text-right text-xs max-w-[60%]">
                {space.location.address}, {space.location.city}
              </span>
            </div>
            {booking.promoCode && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Promo code</span>
                <code className="font-mono text-xs">{booking.promoCode}</code>
              </div>
            )}
          </div>

          {/* QR code for confirmed bookings */}
          {booking.status === 'CONFIRMED' && booking.qrCode && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground font-medium">Show this at the venue</p>
              <QRCodeDisplay value={booking.qrCode} />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            {booking.status === 'COMPLETED' && (
              reviewedIds.has(booking.id) ? (
                <Badge variant="secondary" className="h-auto px-2 py-0.5">
                  Reviewed
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={(e) => { e.stopPropagation(); setReviewOpen(true) }}
                >
                  <Star className="size-3.5" />
                  Leave Review
                </Button>
              )
            )}
            {booking.status === 'CONFIRMED' && (
              <Button
                size="sm"
                variant="destructive"
                className="gap-1.5"
                onClick={(e) => { e.stopPropagation(); setFlagOpen(true) }}
              >
                <Flag className="size-3.5" />
                Report Issue
              </Button>
            )}
          </div>
        </div>
      </div>

      <ReviewFormDialog
        spaceId={space.id}
        bookingId={booking.id}
        open={reviewOpen}
        onOpenChange={handleReviewOpenChange}
      />
      <FlagIssueSheet
        spaceId={space.id}
        bookingId={booking.id}
        open={flagOpen}
        onOpenChange={setFlagOpen}
      />
    </div>
  )
}
