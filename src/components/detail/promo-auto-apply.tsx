"use client"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useBookingStore } from "@/store/booking-store"
import { validatePromoCode } from "@/lib/mock-data"

export function PromoAutoApply() {
  const searchParams = useSearchParams()
  const promo = searchParams.get("promo")
  const { setPromoCode, setPromoValidation } = useBookingStore()

  useEffect(() => {
    if (promo) {
      setPromoCode(promo)
      const validation = validatePromoCode(promo)
      if (validation.valid && validation.promotion) {
        setPromoValidation({
          valid: true,
          discount: validation.promotion.discountPercent || 100,
          message: `${validation.promotion.title} applied!`,
        })
      }
    }
  }, [promo])

  if (!promo) return null

  // Show a small banner
  return (
    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mx-4 mb-4 flex items-center gap-2">
      <span className="text-teal-700 font-medium">Promo code applied!</span>
      <span className="text-teal-600 text-sm">Your discount will be reflected at checkout.</span>
    </div>
  )
}
