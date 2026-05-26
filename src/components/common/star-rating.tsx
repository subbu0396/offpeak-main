import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function StarRating({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars${reviewCount !== undefined ? `, ${reviewCount} reviews` : ""}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-slate-300"
          )}
        />
      ))}
      <span className="text-sm font-medium text-slate-700 ml-1">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-sm text-slate-500">({reviewCount})</span>
      )}
    </div>
  )
}
