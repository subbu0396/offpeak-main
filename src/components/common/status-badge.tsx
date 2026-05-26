import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { BookingStatus, BidStatus, FlagReportStatus, ContractStatus, SpaceStatus } from "@/types"

type StatusType = BookingStatus | BidStatus | FlagReportStatus | ContractStatus | SpaceStatus

const STATUS_STYLES: Record<string, string> = {
  // Booking
  CONFIRMED: "bg-teal-500/10 text-teal-700 border-teal-500/20",
  PENDING: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  COMPLETED: "bg-green-500/10 text-green-700 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-700 border-red-500/20",
  DISPUTED: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  // Bid
  ACCEPTED: "bg-green-500/10 text-green-700 border-green-500/20",
  COUNTERED: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  REJECTED: "bg-red-500/10 text-red-700 border-red-500/20",
  EXPIRED: "bg-slate-500/10 text-slate-700 border-slate-500/20",
  // Flags
  OPEN: "bg-red-500/10 text-red-700 border-red-500/20",
  INVESTIGATING: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  RESOLVED: "bg-green-500/10 text-green-700 border-green-500/20",
  DISMISSED: "bg-slate-500/10 text-slate-700 border-slate-500/20",
  // Contract
  DRAFT: "bg-slate-500/10 text-slate-700 border-slate-500/20",
  SENT: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  SIGNED: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  DEPOSIT_PAID: "bg-teal-500/10 text-teal-700 border-teal-500/20",
  FINALIZED: "bg-green-500/10 text-green-700 border-green-500/20",
  // Space
  ACTIVE: "bg-green-500/10 text-green-700 border-green-500/20",
  SUSPENDED: "bg-red-500/10 text-red-700 border-red-500/20",
  ARCHIVED: "bg-slate-500/10 text-slate-700 border-slate-500/20",
}

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Upcoming",
  PENDING: "Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  DISPUTED: "Disputed",
  ACCEPTED: "Accepted",
  COUNTERED: "Countered",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
  OPEN: "Open",
  INVESTIGATING: "Investigating",
  RESOLVED: "Resolved",
  DISMISSED: "Dismissed",
  DRAFT: "Draft",
  SENT: "Sent",
  SIGNED: "Signed",
  DEPOSIT_PAID: "Deposit Paid",
  FINALIZED: "Finalized",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  ARCHIVED: "Archived",
}

interface StatusBadgeProps {
  status: StatusType
  label?: string // Override default label
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "text-xs font-medium border",
        STATUS_STYLES[status] ?? "bg-slate-500/10 text-slate-700 border-slate-500/20",
        className
      )}
    >
      {label ?? STATUS_LABELS[status] ?? status}
    </Badge>
  )
}
