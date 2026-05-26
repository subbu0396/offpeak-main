'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { Promotion, Space } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { OfferRedemptionSheet } from '@/components/deals/offer-redemption-sheet'
import { cn } from '@/lib/utils'

interface PromoCardProps {
  promotion: Promotion
  space: Space
}

export function PromoCard({ promotion, space }: PromoCardProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [redemptionOpen, setRedemptionOpen] = useState(false)

  const isFreebie = promotion.type === 'FREEBIE'
  const discountLabel = isFreebie
    ? 'FREE'
    : promotion.discountPercent
      ? `${promotion.discountPercent}% OFF`
      : null

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    if (promotion.promoCode) {
      navigator.clipboard.writeText(promotion.promoCode).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleViewDeal() {
    router.push(`/spaces/${space.id}`)
  }

  return (
    <div className="flex flex-col rounded-xl overflow-hidden ring-1 ring-foreground/10 bg-card">
      {/* Space photo thumbnail */}
      <div className="relative h-32 shrink-0">
        <Image
          src={space.photos[0] ?? ''}
          alt={space.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {discountLabel && (
          <div className="absolute top-2 right-2">
            <Badge
              className={cn(
                'text-xs font-bold h-auto px-2 py-0.5',
                isFreebie
                  ? 'bg-green-500 text-white border-0'
                  : 'bg-teal-500 text-white border-0'
              )}
            >
              {discountLabel}
            </Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="font-semibold text-sm leading-snug">{promotion.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{promotion.terms}</p>

        {/* Promo code */}
        {promotion.promoCode && (
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 font-mono text-xs bg-muted rounded px-2 py-1 tracking-wider">
              {promotion.promoCode}
            </code>
            <button
              onClick={handleCopy}
              aria-label="Copy promo code"
              className="p-1.5 rounded hover:bg-muted transition-colors"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-teal-600" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          </div>
        )}

        {isFreebie ? (
          <Button
            onClick={() => setRedemptionOpen(true)}
            size="sm"
            className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white border-0"
          >
            Claim Offer
          </Button>
        ) : (
          <Button
            onClick={handleViewDeal}
            variant="outline"
            size="sm"
            className="mt-auto w-full"
          >
            View Deal
          </Button>
        )}
      </div>

      <OfferRedemptionSheet
        promotion={promotion}
        space={space}
        open={redemptionOpen}
        onOpenChange={setRedemptionOpen}
      />
    </div>
  )
}
