'use client'

import { useState } from 'react'
import { CalendarDays, Users, MapPin } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { StatusBadge } from '@/components/common/status-badge'
import { ContractDetail } from '@/components/events/contract-detail'
import { getSpaceById } from '@/lib/mock-data'
import { formatDate } from '@/lib/date-utils'
import type { EventContract } from '@/types'

interface ContractCardProps {
  contract: EventContract
}

export function ContractCard({ contract }: ContractCardProps) {
  const [expanded, setExpanded] = useState(false)
  const space = getSpaceById(contract.spaceId)

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setExpanded(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setExpanded(true)
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View contract for ${contract.eventType}`}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-semibold text-slate-900 line-clamp-1">
              {contract.eventType}
            </CardTitle>
            <StatusBadge status={contract.contractStatus} />
          </div>
          {space && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{space.title}</span>
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-1.5">
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
            {formatDate(contract.eventDate)}
          </p>
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-slate-500" />
            {contract.guestCount} guests
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">
            £{contract.totalPrice.toFixed(2)}
          </span>
          <span className="text-xs text-slate-500">
            {contract.depositPaid ? 'Deposit paid' : 'Deposit pending'}
          </span>
        </CardFooter>
      </Card>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-2">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Contract Detail</h2>
            <ContractDetail contract={contract} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
