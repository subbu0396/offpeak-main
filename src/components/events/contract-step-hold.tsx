'use client'

import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getEventVenues } from '@/lib/mock-data-events'
import type { ContractFormData } from './contract-wizard'

const EVENT_TYPES = [
  'Corporate',
  'Birthday',
  'Wedding',
  'Conference',
  'Networking',
  'Product Launch',
  'Other',
]

interface ContractStepHoldProps {
  formData: ContractFormData
  onUpdate: (partial: Partial<ContractFormData>) => void
  onNext: () => void
}

export function ContractStepHold({ formData, onUpdate, onNext }: ContractStepHoldProps) {
  const venues = getEventVenues()

  const canContinue =
    !!formData.spaceId &&
    !!formData.eventDate &&
    !!formData.eventType &&
    !!formData.guestCount

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1 — Request Hold</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Venue</label>
          <Select value={formData.spaceId} onValueChange={(v) => onUpdate({ spaceId: v ?? '' })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a venue" />
            </SelectTrigger>
            <SelectContent>
              {venues.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Event Date</label>
          <Popover>
            <PopoverTrigger className="h-10 w-full flex items-center rounded-md border border-input bg-background px-3 text-sm text-left transition-colors hover:bg-accent hover:text-accent-foreground">
              <CalendarIcon className="mr-2 h-4 w-4 text-slate-500 shrink-0" />
              {formData.eventDate
                ? format(new Date(formData.eventDate), "d MMM yyyy")
                : <span className="text-slate-500">Pick a date</span>}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.eventDate ? new Date(formData.eventDate) : undefined}
                onSelect={(date) => onUpdate({ eventDate: date?.toISOString() ?? "" })}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Event Type</label>
          <Select value={formData.eventType} onValueChange={(v) => onUpdate({ eventType: v ?? '' })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Guest Count</label>
          <Input
            type="number"
            min={1}
            placeholder="e.g. 50"
            value={formData.guestCount === 0 ? '' : formData.guestCount}
            onChange={(e) => onUpdate({ guestCount: Number(e.target.value) })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Special Requirements</label>
          <Textarea
            placeholder="Any special requirements or notes for the venue..."
            rows={3}
            value={formData.specialRequirements}
            onChange={(e) => onUpdate({ specialRequirements: e.target.value })}
          />
        </div>

        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white"
        >
          Request Hold
        </Button>
      </CardContent>
    </Card>
  )
}
