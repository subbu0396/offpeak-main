'use client'

import { useState } from 'react'
import { Calendar, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getSpaceById } from '@/lib/mock-data'
import type { EventContract } from '@/types'

interface DepositReceiptProps {
  contract: EventContract
}

function generateTxnId(contractId: string): string {
  // Deterministic from contract id — simple hash-like transform
  let hash = 0
  for (let i = 0; i < contractId.length; i++) {
    hash = (hash * 31 + contractId.charCodeAt(i)) & 0xffffffff
  }
  return `TXN-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`
}

export function DepositReceipt({ contract }: DepositReceiptProps) {
  const [toastVisible, setToastVisible] = useState(false)
  const space = getSpaceById(contract.spaceId)
  const txnId = generateTxnId(contract.id)

  function handleDownload() {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  function handleAddToCalendar() {
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
  }

  return (
    <div className="space-y-4 relative">
      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          Receipt downloaded
        </div>
      )}

      {/* Receipt header */}
      <div className="text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 mb-2">
          <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-bold text-slate-900">Payment Receipt</p>
        <p className="text-xs text-slate-500 mt-0.5">Deposit Confirmation</p>
      </div>

      <Separator />

      {/* Receipt rows */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Booking Ref</span>
          <span className="font-mono font-medium text-slate-900">{contract.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Venue</span>
          <span className="font-medium text-slate-900 text-right max-w-[60%]">
            {space?.title ?? contract.spaceId}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Event Date</span>
          <span className="font-medium text-slate-900">
            {new Date(contract.eventDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Deposit Amount</span>
          <span className="font-semibold text-teal-600">£{contract.depositAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Payment Method</span>
          <span className="font-medium text-slate-900">Visa ending in 4242</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Transaction ID</span>
          <span className="font-mono text-xs font-medium text-slate-700">{txnId}</span>
        </div>
        {contract.signedAt && (
          <div className="flex justify-between">
            <span className="text-slate-500">Date Paid</span>
            <span className="font-medium text-slate-900">
              {new Date(contract.signedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleDownload}
          className="w-full gap-1.5 bg-teal-500 hover:bg-teal-600 text-white"
        >
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
        <Button
          variant="outline"
          onClick={handleAddToCalendar}
          className="w-full gap-1.5"
        >
          <Calendar className="h-4 w-4" />
          Add to Calendar
        </Button>
      </div>
    </div>
  )
}
