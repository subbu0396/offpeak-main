'use client'

import { useBookingStore } from '@/store/booking-store'
import { OffPeakBadge } from '@/components/common/offpeak-badge'
import { calculateOffPeakPrice } from '@/lib/pricing'
import type { PricingRule, TimeSlot } from '@/types'

interface PriceBreakdownProps {
  pricingRule: PricingRule
  selectedSlot?: TimeSlot | null
}

export function PriceBreakdown({ pricingRule, selectedSlot }: PriceBreakdownProps) {
  const promoValidation = useBookingStore((s) => s.promoValidation)

  const { basePrice, offPeakDiscount, currency } = pricingRule
  const symbol = currency === 'GBP' ? '£' : currency

  const hasOffPeak = offPeakDiscount > 0
  const isSlotOffPeak = selectedSlot?.isOffPeak ?? false

  const afterOffPeak = isSlotOffPeak
    ? calculateOffPeakPrice(basePrice, offPeakDiscount)
    : basePrice

  const afterPromo =
    promoValidation?.valid
      ? Math.round(afterOffPeak * (1 - promoValidation.discount / 100) * 100) / 100
      : afterOffPeak

  const finalPrice =
    pricingRule.minPrice && afterPromo < pricingRule.minPrice
      ? pricingRule.minPrice
      : afterPromo

  return (
    <div className="space-y-4">
      {/* Headline price */}
      <div className="flex items-baseline gap-2 flex-wrap">
        {hasOffPeak ? (
          <>
            <span className="text-sm text-slate-500 line-through">
              {symbol}{basePrice.toFixed(2)}
            </span>
            <span className="text-2xl font-bold text-teal-600">
              {symbol}{calculateOffPeakPrice(basePrice, offPeakDiscount).toFixed(2)}
            </span>
            <span className="text-slate-500 text-sm">/session</span>
            <OffPeakBadge discountPercent={offPeakDiscount} />
          </>
        ) : (
          <>
            <span className="text-2xl font-bold text-slate-900">
              {symbol}{basePrice.toFixed(2)}
            </span>
            <span className="text-slate-500 text-sm">/session</span>
          </>
        )}
      </div>

      {/* Selected slot breakdown */}
      {selectedSlot && (
        <div className="border border-slate-200 rounded-lg p-3 space-y-2 text-sm">
          <p className="font-medium text-slate-700">Price breakdown</p>

          <div className="flex justify-between text-slate-600">
            <span>Base rate</span>
            <span>{symbol}{basePrice.toFixed(2)}</span>
          </div>

          {isSlotOffPeak && (
            <div className="flex justify-between text-teal-600">
              <span>Off-peak discount (-{offPeakDiscount}%)</span>
              <span>-{symbol}{(basePrice * offPeakDiscount / 100).toFixed(2)}</span>
            </div>
          )}

          {promoValidation?.valid && (
            <div className="flex justify-between text-teal-600">
              <span>Promo code (-{promoValidation.discount}%)</span>
              <span>-{symbol}{(afterOffPeak * promoValidation.discount / 100).toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between font-semibold text-slate-900 border-t border-slate-200 pt-2">
            <span>Total</span>
            <span>{symbol}{finalPrice.toFixed(2)}</span>
          </div>

          {isSlotOffPeak && (
            <p className="text-xs text-green-600 font-medium">
              Off-peak rate applied
            </p>
          )}
        </div>
      )}
    </div>
  )
}
