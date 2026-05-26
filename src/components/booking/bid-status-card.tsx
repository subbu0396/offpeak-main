'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useBidStore } from '@/store/bid-store'
import { StatusBadge } from '@/components/common/status-badge'
import type { Bid, Space } from '@/types'

interface BidStatusCardProps {
  bid: Bid
  space: Space
}

export function BidStatusCard({ bid, space }: BidStatusCardProps) {
  const router = useRouter()
  const updateBidStatus = useBidStore((s) => s.updateBidStatus)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const thumbnail = space.photos[0]
  const symbol = bid.currency === 'GBP' ? '£' : bid.currency

  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Space photo + name */}
      <div className="flex shrink-0 flex-col items-center gap-1.5">
        {thumbnail && (
          <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200">
            <Image src={thumbnail} alt={space.title} fill className="object-cover" />
          </div>
        )}
        <p className="w-16 text-center text-xs font-medium text-slate-700 leading-tight line-clamp-2">
          {space.title}
        </p>
      </div>

      {/* Bid details */}
      <div className="flex-1 space-y-2">
        <p className="text-sm font-semibold text-slate-800">
          Your offer: {symbol}{bid.proposedPrice.toFixed(2)}
        </p>

        {/* Status badge */}
        <StatusBadge
          status={bid.status}
          label={bid.status === 'COUNTERED' && bid.counterPrice
            ? `Counter: ${symbol}${bid.counterPrice.toFixed(2)}`
            : undefined}
        />

        {/* Toast message */}
        {toastMessage && (
          <p className="text-xs text-teal-700 font-medium">{toastMessage}</p>
        )}

        {/* Counter offer actions */}
        {bid.status === 'COUNTERED' && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              onClick={() => {
                updateBidStatus(bid.id, 'ACCEPTED')
                setToastMessage('Counter accepted! Proceeding to booking...')
              }}
            >
              Accept Counter
            </Button>
            <Button size="sm" variant="outline">
              Decline
            </Button>
          </div>
        )}

        {/* Accepted: complete booking */}
        {bid.status === 'ACCEPTED' && (
          <div className="pt-1">
            <Button
              size="sm"
              onClick={() => router.push(`/spaces/${bid.spaceId}`)}
            >
              Complete Booking
            </Button>
          </div>
        )}

        {/* Generic: browse alternatives */}
        <Link
          href="/explore"
          className="block text-xs text-slate-500 hover:text-teal-600 hover:underline"
        >
          Browse Alternatives
        </Link>
      </div>
    </div>
  )
}
