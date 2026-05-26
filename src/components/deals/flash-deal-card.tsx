'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { Promotion, Space } from '@/types'
import { useSpaceStore } from '@/store/space-store'
import { CountdownTimer } from '@/components/booking/countdown-timer'
import { PriceTag } from '@/components/common/price-tag'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getPricingForSpace } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface FlashDealCardProps {
  promotion: Promotion
  space: Space
}

export function FlashDealCard({ promotion, space }: FlashDealCardProps) {
  const selectSpace = useSpaceStore((s) => s.selectSpace)
  const router = useRouter()

  const now = new Date()
  const isExpired = new Date(promotion.validTo) < now

  const pricing = getPricingForSpace(space.id)
  const basePrice = pricing?.basePrice ?? 0

  const discountLabel =
    promotion.type === 'FREEBIE'
      ? 'FREE'
      : promotion.discountPercent
        ? `${promotion.discountPercent}% Off!`
        : null

  function handleCardClick() {
    selectSpace(space.id)
    router.push(`/spaces/${space.id}`)
  }

  function handleBookNow(e: React.MouseEvent) {
    e.stopPropagation()
    if (!isExpired) {
      selectSpace(space.id)
      router.push(`/spaces/${space.id}`)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleCardClick()
        }
      }}
      className={cn(
        'relative flex-shrink-0 w-72 rounded-xl overflow-hidden ring-1 ring-foreground/10 bg-card cursor-pointer hover:ring-teal-500/40 transition-all',
        isExpired && 'opacity-60'
      )}
    >
      {/* Hero photo */}
      <div className="relative h-48">
        <Image
          src={space.photos[0] ?? ''}
          alt={space.title}
          fill
          className="object-cover rounded-t-xl"
          sizes="288px"
        />

        {/* Countdown overlay */}
        {!isExpired && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            <CountdownTimer expiresAt={promotion.validTo} />
          </div>
        )}

        {/* Expired overlay badge */}
        {isExpired && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Badge variant="destructive" className="text-sm px-3 py-1 h-auto">
              Expired
            </Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2">
        <p className="font-semibold text-sm leading-snug line-clamp-2">{promotion.title}</p>
        <p className="text-xs text-muted-foreground">{space.title}</p>

        {discountLabel && (
          <p className="text-teal-600 font-bold text-sm">{discountLabel}</p>
        )}

        {promotion.type !== 'FREEBIE' && basePrice > 0 && (
          <PriceTag
            basePrice={basePrice}
            discountPercent={promotion.discountPercent}
          />
        )}

        {promotion.type === 'FREEBIE' && (
          <PriceTag basePrice={0} currency="£" />
        )}

        <Button
          onClick={handleBookNow}
          disabled={isExpired}
          className="mt-1 w-full bg-teal-600 hover:bg-teal-700 text-white border-0"
          size="sm"
        >
          Book Now
        </Button>
      </div>
    </div>
  )
}
