'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, Users, FileSignature, MapPin, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuthStore } from '@/store/auth-store'
import { useSpaceStore } from '@/store/space-store'
import { getContractsForUser } from '@/lib/mock-data-events'
import { getEventVenues } from '@/lib/mock-data-events'
import type { ContractStatus } from '@/types'

const EVENT_TYPES = [
  'Corporate',
  'Birthday',
  'Wedding',
  'Conference',
  'Networking',
  'Product Launch',
  'Other',
]

const STATUS_BADGE: Record<ContractStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  SENT: { label: 'Sent', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  SIGNED: { label: 'Signed', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  DEPOSIT_PAID: { label: 'Deposit Paid', className: 'bg-teal-50 text-teal-700 border-teal-200' },
  FINALIZED: { label: 'Finalized', className: 'bg-green-50 text-green-700 border-green-200' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-200' },
}

export function EventPlanningDashboard() {
  const router = useRouter()
  const { currentUser } = useAuthStore()
  const { shortlistedIds } = useSpaceStore()

  const [eventType, setEventType] = useState('')
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined)
  const [guestCount, setGuestCount] = useState('')

  const contracts = getContractsForUser(currentUser.id)
  const eventVenueIds = new Set(getEventVenues().map((v) => v.id))

  const shortlistedVenueCount = shortlistedIds.filter((id) => eventVenueIds.has(id)).length

  const activeContracts = contracts.filter(
    (c) => c.contractStatus !== 'CANCELLED' && c.contractStatus !== 'FINALIZED'
  )

  const now = new Date()
  const upcomingEvents = contracts.filter(
    (c) => new Date(c.eventDate) > now && c.contractStatus !== 'CANCELLED'
  )

  const recentContracts = [...contracts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  function handleFindVenues() {
    const params = new URLSearchParams()
    if (eventType) params.set('eventType', eventType)
    if (eventDate) params.set('date', format(eventDate, 'yyyy-MM-dd'))
    if (guestCount) params.set('guests', guestCount)
    router.push(`/events/discover?${params.toString()}`)
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Event Dashboard</h1>

      {/* Planning card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900">
            Plan Your Next Event
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Event type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Event Type</label>
              <Select value={eventType} onValueChange={(v) => setEventType(v ?? '')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
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

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Date</label>
              <Popover>
                <PopoverTrigger className="h-10 w-full flex items-center rounded-md border border-input bg-background px-3 text-sm text-left transition-colors hover:bg-accent hover:text-accent-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4 text-slate-500 shrink-0" />
                  {eventDate ? format(eventDate, "d MMM yyyy") : <span className="text-slate-500">Pick a date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={(date) => setEventDate(date ?? undefined)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guest count */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Guest Count</label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 50"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
              />
            </div>

            {/* Find button aligned to bottom */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-transparent select-none">Action</label>
              <Button
                onClick={handleFindVenues}
                className="bg-teal-500 hover:bg-teal-600 text-white w-full"
              >
                <MapPin className="h-4 w-4" />
                Find Venues
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-500" />
              Shortlisted Venues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{shortlistedVenueCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-teal-500" />
              Active Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{activeContracts.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-teal-500" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{upcomingEvents.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent contracts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-900">Recent Contracts</h2>
          <Link
            href="/events/contracts"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            View all
          </Link>
        </div>

        {recentContracts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">
              <p>No contracts yet.</p>
              <Link
                href="/events/contracts/new"
                className="mt-2 inline-block text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Create your first contract
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentContracts.map((contract) => {
                  const badge = STATUS_BADGE[contract.contractStatus]
                  return (
                    <div
                      key={contract.id}
                      className="flex items-center gap-4 px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {contract.eventType}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {new Date(contract.eventDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                          <Users className="h-3 w-3 ml-1" />
                          {contract.guestCount} guests
                        </p>
                      </div>
                      <Badge className={badge.className}>{badge.label}</Badge>
                      <p className="text-sm font-medium text-slate-900 shrink-0">
                        £{contract.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
