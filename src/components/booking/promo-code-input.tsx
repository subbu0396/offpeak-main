'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useBookingStore } from '@/store/booking-store'
import { validatePromoCode } from '@/lib/mock-data'

export function PromoCodeInput() {
  const { promoCode, setPromoCode, promoValidation, setPromoValidation } = useBookingStore()
  const [inputValue, setInputValue] = useState(promoCode)

  const handleApply = () => {
    const result = validatePromoCode(inputValue)
    setPromoCode(inputValue)
    if (result.valid && result.promotion) {
      setPromoValidation({
        valid: true,
        discount: result.promotion.discountPercent || 0,
        message: `Code applied! ${result.promotion.discountPercent}% off`,
      })
    } else {
      setPromoValidation({
        valid: false,
        discount: 0,
        message: 'Invalid or expired code',
      })
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter promo code"
          className="flex-1"
        />
        <Button variant="outline" onClick={handleApply} disabled={!inputValue.trim()}>
          Apply
        </Button>
      </div>
      {promoValidation && (
        <p className={cn('text-sm', promoValidation.valid ? 'text-green-600' : 'text-red-500')}>
          {promoValidation.message}
        </p>
      )}
    </div>
  )
}
