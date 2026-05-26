'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle2, CalendarDays, QrCode, UserCheck } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Promotion, Space } from '@/types'

interface OfferRedemptionSheetProps {
  promotion: Promotion
  space: Space
  open: boolean
  onOpenChange: (open: boolean) => void
}

const REDEMPTION_STEPS = [
  {
    icon: CalendarDays,
    title: 'Book the space',
    description: 'Make a booking during the qualifying off-peak time window.',
  },
  {
    icon: QrCode,
    title: 'Present QR code on arrival',
    description: 'Your redemption QR code will appear in your booking confirmation.',
  },
  {
    icon: UserCheck,
    title: 'Staff validates the offer',
    description: 'Show the code to a member of staff and they will apply the offer.',
  },
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function OfferRedemptionSheet({
  promotion,
  space,
  open,
  onOpenChange,
}: OfferRedemptionSheetProps) {
  const router = useRouter()

  function handleBookAndClaim() {
    onOpenChange(false)
    const params = new URLSearchParams()
    if (promotion.promoCode) params.set('promo', promotion.promoCode)
    router.push(`/spaces/${space.id}?${params.toString()}`)
  }

  const isFreebie = promotion.type === 'FREEBIE'
  const discountLabel = isFreebie
    ? 'FREE'
    : promotion.discountPercent
    ? `${promotion.discountPercent}% OFF`
    : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pr-8">
          <SheetTitle>Claim Offer</SheetTitle>
          <SheetDescription>{space.title}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 pb-4">
          {/* Offer details card */}
          <div className="rounded-xl border bg-muted/30 p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-sm leading-snug">{promotion.title}</p>
              {discountLabel && (
                <Badge
                  className={
                    isFreebie
                      ? 'bg-green-500 text-white border-0 shrink-0'
                      : 'bg-teal-500 text-white border-0 shrink-0'
                  }
                >
                  {discountLabel}
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground">{promotion.terms}</p>

            <Separator />

            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Valid from</span>
                <span className="font-medium text-foreground">{formatDate(promotion.validFrom)}</span>
              </div>
              <div className="flex justify-between">
                <span>Valid to</span>
                <span className="font-medium text-foreground">{formatDate(promotion.validTo)}</span>
              </div>
              {promotion.redemptionLimit && (
                <div className="flex justify-between">
                  <span>Remaining</span>
                  <span className="font-medium text-foreground">
                    {promotion.redemptionLimit - promotion.redemptionCount} of{' '}
                    {promotion.redemptionLimit}
                  </span>
                </div>
              )}
              {promotion.promoCode && (
                <div className="flex justify-between">
                  <span>Code</span>
                  <code className="font-mono font-medium text-teal-600 tracking-wider">
                    {promotion.promoCode}
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* How to redeem */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">How to redeem</p>
            <ol className="flex flex-col gap-4">
              {REDEMPTION_STEPS.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="shrink-0 flex size-7 items-center justify-center rounded-full bg-teal-50 border border-teal-200 text-teal-600">
                    <step.icon className="size-3.5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium leading-snug">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Success indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <CheckCircle2 className="size-4 text-green-600 shrink-0" />
            Offer is active and ready to be claimed.
          </div>
        </div>

        <SheetFooter className="px-4 pb-4">
          <Button
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleBookAndClaim}
          >
            Book &amp; Claim Offer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
