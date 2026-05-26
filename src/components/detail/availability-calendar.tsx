'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { useBookingStore } from '@/store/booking-store'
import { getAvailabilityForSpace } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { TimeSlot } from '@/types'

interface AvailabilityCalendarProps {
  spaceId: string
}

export function AvailabilityCalendar({ spaceId }: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const { setSelectedDate: storeSetDate, setSelectedTimeSlot, selectedTimeSlot } = useBookingStore()

  const availability = getAvailabilityForSpace(spaceId)

  function getSlotsForDate(date: Date): TimeSlot[] {
    const dayOfWeek = date.getDay() // 0=Sunday, 6=Saturday
    const dateISOString = date.toISOString().split('T')[0]

    return availability
      .filter((a) => {
        if (!a.isAvailable) return false
        if (a.dayOfWeek !== dayOfWeek) return false
        // Check blackout dates
        if (a.blackoutDates.includes(dateISOString)) return false
        return true
      })
      .map((a) => ({
        start: a.startTime,
        end: a.endTime,
        isOffPeak: a.isOffPeak,
        price: 0, // price determined by PriceBreakdown
      }))
  }

  function handleDateSelect(date: Date | undefined) {
    setSelectedDate(date)
    storeSetDate(date ?? null)
    setSelectedTimeSlot(null)
  }

  function handleSlotClick(slot: TimeSlot) {
    setSelectedTimeSlot(slot)
  }

  const slots = selectedDate ? getSlotsForDate(selectedDate) : []

  const isSlotSelected = (slot: TimeSlot) =>
    selectedTimeSlot?.start === slot.start &&
    selectedTimeSlot?.end === slot.end &&
    selectedTimeSlot?.isOffPeak === slot.isOffPeak

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        disabled={{ before: new Date() }}
        className="rounded-lg border border-slate-200"
      />

      {selectedDate && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-700">
            Available slots for{' '}
            {selectedDate.toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </h3>

          {slots.length === 0 ? (
            <p className="text-sm text-slate-500 py-3">
              No slots available for this date.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {slots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => handleSlotClick(slot)}
                  className={cn(
                    'flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors text-left',
                    slot.isOffPeak && 'border-l-2 border-l-teal-500',
                    isSlotSelected(slot)
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'border-slate-200 hover:border-teal-400 hover:bg-teal-50'
                  )}
                >
                  <span>
                    {slot.start} &ndash; {slot.end}
                  </span>
                  {slot.isOffPeak && (
                    <Badge
                      className={cn(
                        'ml-2',
                        isSlotSelected(slot)
                          ? 'bg-white/20 text-white border-white/30'
                          : 'bg-teal-500/10 text-teal-600 border-teal-500/20'
                      )}
                    >
                      Off-peak
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
