import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ShieldAlert, ShieldOff } from "lucide-react"
import type { VerificationStatus } from "@/types"

interface VerifiedBadgeProps {
  status?: VerificationStatus
}

export function VerifiedBadge({ status = "VERIFIED" }: VerifiedBadgeProps) {
  if (status === "PENDING") {
    return (
      <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/10 gap-1">
        <ShieldAlert className="h-3 w-3" />
        Pending Review
      </Badge>
    )
  }

  if (status === "UNVERIFIED") {
    return (
      <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 gap-1">
        <ShieldOff className="h-3 w-3" />
        Unverified
      </Badge>
    )
  }

  return (
    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/10 gap-1">
      <ShieldCheck className="h-3 w-3" />
      Verified
    </Badge>
  )
}
