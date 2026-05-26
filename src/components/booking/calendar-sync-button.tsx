'use client'

import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Booking } from '@/types'

interface CalendarSyncButtonProps {
  booking: Booking
  spaceName: string
}

export function CalendarSyncButton({ booking, spaceName }: CalendarSyncButtonProps) {
  const handleDownload = () => {
    const start = new Date(booking.startTime)
    const end = new Date(booking.endTime)

    const formatDate = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      `SUMMARY:${spaceName} - OffPeak Booking`,
      `DESCRIPTION:Booking ID: ${booking.id}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `offpeak-booking-${booking.id}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" className="gap-2" onClick={handleDownload}>
      <Calendar className="h-4 w-4" />
      Add to Calendar
    </Button>
  )
}
