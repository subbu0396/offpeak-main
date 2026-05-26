'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarX, Gavel } from 'lucide-react'
import { getBookingsForUser, getSpaceById } from '@/lib/mock-data'
import { MOCK_USER } from '@/lib/constants'
import { useBidStore } from '@/store/bid-store'
import { BookingCard } from '@/components/booking/booking-card'
import { BidStatusCard } from '@/components/booking/bid-status-card'
import { BookingsTabFilter } from '@/components/bookings/bookings-tab-filter'
import { EmptyState } from '@/components/common/empty-state'
import type { Bid, Space } from '@/types'
import Link from 'next/link'

// Mock bids for the current user (no API yet)
const MOCK_USER_BIDS: Array<{ bid: Bid; space: Space | undefined }> = [
  {
    bid: {
      id: 'bid-001',
      spaceId: 'space-008',
      seekerId: 'seeker-001',
      proposedPrice: 80,
      currency: 'GBP',
      message: 'Would love to host a team off-site here.',
      status: 'COUNTERED',
      counterPrice: 90,
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    space: getSpaceById('space-008'),
  },
  {
    bid: {
      id: 'bid-002',
      spaceId: 'space-015',
      seekerId: 'seeker-001',
      proposedPrice: 35,
      currency: 'GBP',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    space: getSpaceById('space-015'),
  },
]

export default function BookingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('upcoming')
  const submittedBids = useBidStore((s) => s.submittedBids)

  const bookings = getBookingsForUser(MOCK_USER.id)

  const upcomingBookings = bookings.filter((b) => b.status === 'CONFIRMED')
  const pastBookings = bookings.filter((b) => b.status === 'COMPLETED')
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED')

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Page header */}
      <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>

      {/* Tab filter */}
      <BookingsTabFilter activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'upcoming' && (
        <section className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="No upcoming bookings"
              description="You don't have any confirmed upcoming bookings yet."
              actionLabel="Find a space"
              onAction={() => { router.push('/explore') }}
            />
          ) : (
            upcomingBookings.map((booking) => {
              const space = getSpaceById(booking.spaceId)
              if (!space) return null
              return <BookingCard key={booking.id} booking={booking} space={space} />
            })
          )}
        </section>
      )}

      {activeTab === 'past' && (
        <section className="space-y-4">
          {pastBookings.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="No past bookings"
              description="Your completed bookings will appear here."
            />
          ) : (
            pastBookings.map((booking) => {
              const space = getSpaceById(booking.spaceId)
              if (!space) return null
              return <BookingCard key={booking.id} booking={booking} space={space} />
            })
          )}
        </section>
      )}

      {activeTab === 'cancelled' && (
        <section className="space-y-4">
          {cancelledBookings.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="No cancelled bookings"
              description="Cancelled bookings will be shown here."
            />
          ) : (
            cancelledBookings.map((booking) => {
              const space = getSpaceById(booking.spaceId)
              if (!space) return null
              return <BookingCard key={booking.id} booking={booking} space={space} />
            })
          )}
        </section>
      )}

      {activeTab === 'bids' && (
        <section className="space-y-4">
          {(() => {
            const storeBidEntries = submittedBids.map((bid) => ({
              bid,
              space: getSpaceById(bid.spaceId),
            }))
            const allBids = [...MOCK_USER_BIDS, ...storeBidEntries]
            if (allBids.length === 0) {
              return (
                <EmptyState
                  icon={Gavel}
                  title="No active bids"
                  description="Your bids on spaces will appear here."
                  actionLabel="Explore spaces"
                  onAction={() => { router.push('/explore') }}
                />
              )
            }
            return allBids.map(({ bid, space }) => {
              if (!space) return null
              return <BidStatusCard key={bid.id} bid={bid} space={space} />
            })
          })()}
        </section>
      )}
    </div>
  )
}
