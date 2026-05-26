import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function OffPeakBadge({ discountPercent, size = "sm" }: { discountPercent: number; size?: "sm" | "lg" }) {
  return (
    <Badge className={cn(
      "bg-teal-500/10 text-teal-600 border-teal-500/20 hover:bg-teal-500/10",
      size === "lg" && "text-sm px-3 py-1"
    )}>
      Off-Peak -{discountPercent}%
    </Badge>
  )
}
