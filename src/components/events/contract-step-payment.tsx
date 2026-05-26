'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Calendar, CreditCard, Loader2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/auth-store'
import { getEventVenues } from '@/lib/mock-data-events'
import { getPricingForSpace } from '@/lib/mock-data'
import type { ContractFormData } from './contract-wizard'

const HOURS = 4 // mock 4-hour event

interface ContractStepPaymentProps {
  formData: ContractFormData
  onBack: () => void
}

export function ContractStepPayment({ formData, onBack }: ContractStepPaymentProps) {
  const { currentUser } = useAuthStore()
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)

  const venues = getEventVenues()
  const selectedVenue = venues.find((v) => v.id === formData.spaceId)
  const pricing = formData.spaceId ? getPricingForSpace(formData.spaceId) : undefined
  const baseTotal = pricing ? pricing.basePrice * HOURS * 1.2 : 0
  const depositAmount = Math.round(baseTotal * 0.3)

  function handlePay() {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setPaid(true)
    }, 2000)
  }

  function handleAddToCalendar() {
    const start = new Date(formData.eventDate)
    start.setHours(9)
    const end = new Date(formData.eventDate)
    end.setHours(13)
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${formData.eventType} at ${selectedVenue?.title}`,
      `DESCRIPTION:OffPeak event booking`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'offpeak-event.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4 — Deposit Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {paid ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
              <Check className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-900">Contract Finalised!</p>
              <p className="text-sm text-slate-500 mt-1">
                Your venue is booked. We have sent confirmation to {currentUser.email}.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                render={<Link href="/events/contracts" />}
                className="bg-teal-500 hover:bg-teal-600 text-white gap-1.5"
              >
                View Contract
              </Button>
              <Button variant="outline" onClick={handleAddToCalendar} className="gap-1.5">
                <Calendar className="h-4 w-4" />
                Add to Calendar
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Deposit amount */}
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-1">Deposit Due</p>
              <p className="text-4xl font-bold text-teal-600">£{depositAmount.toFixed(2)}</p>
              <p className="text-xs text-slate-500 mt-1">30% of £{baseTotal.toFixed(2)} total</p>
            </div>

            {/* Mock payment form */}
            <div className="rounded-lg border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CreditCard className="h-4 w-4 text-slate-500" />
                <span className="font-medium">Card ending in 4242</span>
                <span className="ml-auto text-slate-500">Visa</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Card Number</label>
                  <Input defaultValue="•••• •••• •••• 4242" disabled className="text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Expiry</label>
                  <Input defaultValue="12/28" disabled className="text-sm" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handlePay}
                disabled={paying}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white gap-2"
              >
                {paying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pay Deposit £{depositAmount.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
