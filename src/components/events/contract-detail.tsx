'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Users, MapPin, Check, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DepositReceipt } from '@/components/events/deposit-receipt'
import { getSpaceById } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { EventContract, ContractStatus } from '@/types'

interface ContractDetailProps {
  contract: EventContract
}

const STATUS_ORDER: ContractStatus[] = ['DRAFT', 'SENT', 'SIGNED', 'DEPOSIT_PAID', 'FINALIZED']

const STATUS_LABELS: Record<ContractStatus, string> = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  SIGNED: 'Signed',
  DEPOSIT_PAID: 'Deposit Paid',
  FINALIZED: 'Finalised',
  CANCELLED: 'Cancelled',
}

export function ContractDetail({ contract }: ContractDetailProps) {
  const [showReceipt, setShowReceipt] = useState(false)
  const space = getSpaceById(contract.spaceId)

  const currentStatusIndex = STATUS_ORDER.indexOf(contract.contractStatus)
  const isCancelled = contract.contractStatus === 'CANCELLED'

  return (
    <div className="space-y-6">
      {/* Status timeline */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Contract Status</h3>
        {isCancelled ? (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <span className="text-sm font-medium text-red-700">This contract has been cancelled.</span>
          </div>
        ) : (
          <div className="flex items-center overflow-x-auto">
            {STATUS_ORDER.map((status, idx) => {
              const isCompleted = currentStatusIndex > idx
              const isCurrent = currentStatusIndex === idx
              return (
                <div key={status} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
                        isCompleted
                          ? 'bg-teal-500 border-teal-500 text-white'
                          : isCurrent
                            ? 'border-teal-500 text-teal-600 bg-white animate-pulse'
                            : 'border-slate-200 text-slate-300 bg-white'
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'mt-1 text-xs font-medium whitespace-nowrap',
                        isCompleted
                          ? 'text-teal-600'
                          : isCurrent
                            ? 'text-teal-500'
                            : 'text-slate-500'
                      )}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                  {idx < STATUS_ORDER.length - 1 && (
                    <div
                      className={cn(
                        'mb-5 h-0.5 w-8 sm:w-14 mx-0.5',
                        isCompleted ? 'bg-teal-500' : 'bg-slate-200'
                      )}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Separator />

      {/* Space details */}
      {space && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-teal-500" />
            Venue Details
          </h3>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2 text-sm">
            <p className="font-semibold text-slate-900">{space.title}</p>
            <p className="text-slate-600">{space.location.address}, {space.location.city} {space.location.postcode}</p>
            <p className="text-slate-600 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Capacity: {space.capacity} guests
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {space.amenities.slice(0, 6).map((a) => (
                <Badge key={a} variant="outline" className="text-xs">
                  {a}
                </Badge>
              ))}
              {space.amenities.length > 6 && (
                <Badge variant="outline" className="text-xs text-slate-500">
                  +{space.amenities.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event details */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-teal-500" />
          Event Details
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <span className="text-slate-500">Event Type</span>
          <span className="font-medium text-slate-900">{contract.eventType}</span>
          <span className="text-slate-500">Date</span>
          <span className="font-medium text-slate-900">
            {new Date(contract.eventDate).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span className="text-slate-500">Guests</span>
          <span className="font-medium text-slate-900">{contract.guestCount}</span>
          {contract.specialRequirements && (
            <>
              <span className="text-slate-500">Requirements</span>
              <span className="font-medium text-slate-900">{contract.specialRequirements}</span>
            </>
          )}
          {contract.cateringOptions && contract.cateringOptions.length > 0 && (
            <>
              <span className="text-slate-500">Catering</span>
              <span className="font-medium text-slate-900">{contract.cateringOptions.join(', ')}</span>
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Financial summary */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Financial Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Total Price</span>
            <span className="font-semibold text-slate-900">£{contract.totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Deposit (30%)</span>
            <span className="font-medium text-slate-900">£{contract.depositAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Deposit Status</span>
            <span className={cn('font-medium', contract.depositPaid ? 'text-teal-600' : 'text-amber-600')}>
              {contract.depositPaid ? 'Paid' : 'Pending'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Balance Remaining</span>
            <span className="font-semibold text-slate-900">
              £{(contract.totalPrice - (contract.depositPaid ? contract.depositAmount : 0)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {contract.contractStatus === 'DRAFT' && (
          <Button>
            Send to Venue
          </Button>
        )}

        {contract.contractStatus === 'SENT' && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4 animate-pulse text-blue-500" />
            Waiting for venue confirmation...
          </div>
        )}

        {contract.contractStatus === 'SIGNED' && (
          <Button
            render={<Link href="/events/contracts/new" />}
          >
            Pay Deposit
          </Button>
        )}

        {(contract.contractStatus === 'DEPOSIT_PAID' ||
          contract.contractStatus === 'FINALIZED') && (
          <>
            <Button
              variant="outline"
              onClick={() => setShowReceipt(true)}
            >
              View Receipt
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const d = new Date(contract.eventDate)
                d.setHours(9)
                const end = new Date(contract.eventDate)
                end.setHours(13)
                const fmt = (dt: Date) =>
                  dt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
                const ics = [
                  'BEGIN:VCALENDAR',
                  'VERSION:2.0',
                  'BEGIN:VEVENT',
                  `DTSTART:${fmt(d)}`,
                  `DTEND:${fmt(end)}`,
                  `SUMMARY:${contract.eventType} — OffPeak Event`,
                  `DESCRIPTION:Contract ID: ${contract.id}`,
                  'END:VEVENT',
                  'END:VCALENDAR',
                ].join('\r\n')
                const blob = new Blob([ics], { type: 'text/calendar' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `offpeak-event-${contract.id}.ics`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="gap-1.5"
            >
              <CalendarDays className="h-4 w-4" />
              Add to Calendar
            </Button>
          </>
        )}

        {contract.contractStatus === 'CANCELLED' && (
          <Button
            render={<Link href="/events/contracts/new" />}
          >
            Create New Contract
          </Button>
        )}
      </div>

      {/* Receipt overlay */}
      {showReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowReceipt(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Payment Receipt</h2>
              <button
                onClick={() => setShowReceipt(false)}
                className="rounded-md p-1 text-slate-500 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close receipt"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <DepositReceipt contract={contract} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
