'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Promotion } from '@/types'
import { cn } from '@/lib/utils'

interface PromoTermsCardProps {
  promotion: Promotion
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function PromoTermsCard({ promotion }: PromoTermsCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl ring-1 ring-foreground/10 bg-card overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
        aria-expanded={expanded}
      >
        <span>Terms &amp; Conditions</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          expanded ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="px-4 pb-4 space-y-3 text-sm text-muted-foreground border-t pt-3">
          {/* Valid dates */}
          <div>
            <span className="font-medium text-foreground">Valid period:</span>{' '}
            {formatDate(promotion.validFrom)} &mdash; {formatDate(promotion.validTo)}
          </div>

          {/* Redemption method */}
          <div>
            <span className="font-medium text-foreground">How to redeem:</span>{' '}
            {promotion.promoCode
              ? `Enter code "${promotion.promoCode}" at checkout.`
              : 'Discount is applied automatically at checkout.'}
          </div>

          {/* Max uses */}
          {promotion.redemptionLimit != null && (
            <div>
              <span className="font-medium text-foreground">Maximum uses:</span>{' '}
              {promotion.redemptionLimit} total (
              {promotion.redemptionCount} used so far)
            </div>
          )}

          {/* Full terms text */}
          <div>
            <span className="font-medium text-foreground">Conditions:</span>{' '}
            {promotion.terms}
          </div>
        </div>
      </div>
    </div>
  )
}
