import { cn } from "@/lib/utils"

export function PriceTag({
  basePrice,
  discountPercent,
  currency = "£",
}: {
  basePrice: number
  discountPercent?: number
  currency?: string
}) {
  const hasDiscount = discountPercent && discountPercent > 0
  const discountedPrice = hasDiscount
    ? Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100
    : basePrice

  const ariaLabel = hasDiscount
    ? `Was ${currency}${basePrice.toFixed(2)}, now ${currency}${discountedPrice.toFixed(2)}, save ${discountPercent} percent`
    : `${currency}${basePrice.toFixed(2)}`

  return (
    <div className="flex items-baseline gap-2" aria-label={ariaLabel}>
      {hasDiscount && (
        <span className="text-sm text-slate-500 line-through">
          {currency}{basePrice.toFixed(2)}
        </span>
      )}
      <span className={cn(
        "font-bold",
        hasDiscount ? "text-teal-600 text-lg" : "text-slate-900 text-lg"
      )}>
        {currency}{discountedPrice.toFixed(2)}
      </span>
      {hasDiscount && (
        <span className="text-xs text-teal-600 font-medium">
          Save {discountPercent}%
        </span>
      )}
    </div>
  )
}
