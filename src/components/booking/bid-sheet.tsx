'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import { SuccessState } from '@/components/common/success-state'
import { useBidStore } from '@/store/bid-store'
import { useAuthStore } from '@/store/auth-store'
import { getPricingForSpace } from '@/lib/mock-data'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { Space } from '@/types'

interface BidSheetProps {
  space: Space
}

export function BidSheet({ space }: BidSheetProps) {
  const { isBidSheetOpen, closeBidSheet, resetBid, addBid } = useBidStore()
  const currentUser = useAuthStore((s) => s.currentUser)
  const [offerAmount, setOfferAmount] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [priceError, setPriceError] = useState<string | null>(null)

  const pricingRule = getPricingForSpace(space.id)
  const minPrice = pricingRule?.minPrice ?? 0

  const handleSubmit = () => {
    const parsed = parseFloat(offerAmount)

    if (isNaN(parsed) || parsed < minPrice) {
      setPriceError(`Minimum offer is £${minPrice}`)
      return
    }

    setPriceError(null)

    const bid = {
      id: `bid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      spaceId: space.id,
      seekerId: currentUser?.id ?? 'seeker-001',
      proposedPrice: parsed,
      currency: 'GBP',
      message: message || undefined,
      status: 'PENDING' as const,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    }
    addBid(bid)
    setSubmitted(true)
  }

  const handleClose = () => {
    closeBidSheet()
    resetBid()
    setOfferAmount('')
    setMessage('')
    setPriceError(null)
    setSubmitted(false)
  }

  return (
    <Sheet open={isBidSheetOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <SheetContent side="right" className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Make an Offer</SheetTitle>
          <p className="text-sm text-muted-foreground">{space.title}</p>
        </SheetHeader>

        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <SuccessState
              title="Offer Submitted!"
              message="You'll be notified when the owner responds."
            >
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white w-full"
                onClick={handleClose}
              >
                Done
              </Button>
            </SuccessState>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 px-4 pb-2 overflow-y-auto">
              {/* Offer input */}
              <div className="space-y-1.5">
                <label htmlFor="bid-offer" className="text-sm font-medium text-slate-700">
                  Your Offer (£)
                </label>
                <Input
                  id="bid-offer"
                  type="number"
                  min={minPrice}
                  step="0.01"
                  placeholder={`e.g. ${minPrice}`}
                  value={offerAmount}
                  onChange={(e) => {
                    setOfferAmount(e.target.value)
                    setPriceError(null)
                  }}
                  aria-invalid={!!priceError}
                  aria-describedby={priceError ? "bid-error" : undefined}
                  className={cn(priceError && 'border-red-500 focus-visible:border-red-500')}
                />
                {priceError && (
                  <p id="bid-error" className="text-xs text-red-500">{priceError}</p>
                )}
              </div>

              {/* Message textarea */}
              <div className="space-y-1.5">
                <label htmlFor="bid-message" className="text-sm font-medium text-slate-700">
                  Message <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <Textarea
                  id="bid-message"
                  placeholder="Tell the owner about your plans..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Expiry info */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="h-4 w-4 shrink-0" />
                <span>Bid expires in 48 hours</span>
              </div>
            </div>

            <SheetFooter>
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                onClick={handleSubmit}
                disabled={!offerAmount.trim()}
              >
                Submit Offer
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
