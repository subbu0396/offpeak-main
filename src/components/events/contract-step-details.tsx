'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { getEventVenues } from '@/lib/mock-data-events'
import { getPricingForSpace } from '@/lib/mock-data'
import type { ContractFormData } from './contract-wizard'

const CATERING_OPTIONS = [
  'Finger Food',
  'Full Catering',
  'Drinks Package',
  'None',
]

const HOURS = 4 // mock 4-hour event

interface ContractStepDetailsProps {
  formData: ContractFormData
  onUpdate: (partial: Partial<ContractFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function ContractStepDetails({ formData, onUpdate, onNext, onBack }: ContractStepDetailsProps) {
  const venues = getEventVenues()
  const selectedVenue = venues.find((v) => v.id === formData.spaceId)
  const pricing = formData.spaceId ? getPricingForSpace(formData.spaceId) : undefined
  const baseTotal = pricing ? pricing.basePrice * HOURS * 1.2 : 0

  function toggleCatering(option: string) {
    const next = formData.cateringOptions.includes(option)
      ? formData.cateringOptions.filter((o) => o !== option)
      : [...formData.cateringOptions, option]
    onUpdate({ cateringOptions: next })
  }

  const formattedDate = formData.eventDate
    ? new Date(formData.eventDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '–'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2 — Contract Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Booking summary */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2 text-sm">
          <h3 className="font-semibold text-slate-800">Booking Summary</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-slate-500">Venue</span>
            <span className="font-medium text-slate-900">{selectedVenue?.title ?? '–'}</span>
            <span className="text-slate-500">Address</span>
            <span className="font-medium text-slate-900">
              {selectedVenue?.location.address ?? '–'}, {selectedVenue?.location.city}
            </span>
            <span className="text-slate-500">Capacity</span>
            <span className="font-medium text-slate-900">{selectedVenue?.capacity} guests max</span>
            <span className="text-slate-500">Event Date</span>
            <span className="font-medium text-slate-900">{formattedDate}</span>
            <span className="text-slate-500">Event Type</span>
            <span className="font-medium text-slate-900">{formData.eventType}</span>
            <span className="text-slate-500">Guests</span>
            <span className="font-medium text-slate-900">{formData.guestCount}</span>
          </div>
        </div>

        <Separator />

        {/* Catering options */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Catering Options</p>
          <div className="flex flex-wrap gap-2">
            {CATERING_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.cateringOptions.includes(option)}
                  onCheckedChange={() => toggleCatering(option)}
                />
                <span className="text-sm text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cancellation policy */}
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          <p className="font-semibold mb-1">Cancellation Policy</p>
          <p>Full refund up to 7 days before event. 50% refund up to 3 days.</p>
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Base price ({HOURS} hrs × £{pricing?.basePrice ?? 0}/hr)</span>
            <span className="font-medium">£{((pricing?.basePrice ?? 0) * HOURS).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Event premium (×1.2)</span>
            <span className="font-medium">£{((pricing?.basePrice ?? 0) * HOURS * 0.2).toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span className="text-teal-600">£{baseTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Deposit (30%)</span>
            <span>£{Math.round(baseTotal * 0.3).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button onClick={onNext} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
