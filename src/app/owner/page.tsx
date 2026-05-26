'use client'

import Link from 'next/link'
import { PlusCircle, Megaphone, BarChart2, CalendarDays } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StatusBadge } from '@/components/common/status-badge'
import {
  getSpacesForOwner,
  getBookingsForSpace,
  getRevenueForSpace,
  getAnalyticsForSpace,
} from '@/lib/mock-data-owner'
import { getSpaceById } from '@/lib/mock-data'
import { VerificationStatus } from '@/components/owner/verification-status'
import { IncomingBidsList } from '@/components/owner/incoming-bids-list'
import { EmptyState } from '@/components/common/empty-state'
import type { Booking } from '@/types'

const OWNER_ID = 'owner-001'

export default function OwnerDashboardPage() {
  const spaces = getSpacesForOwner(OWNER_ID)

  // Aggregate KPIs
  const allBookings: Booking[] = spaces.flatMap((s) => getBookingsForSpace(s.id))

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const revenueMTD = spaces.reduce((sum, s) => {
    const spaceBookings = getBookingsForSpace(s.id).filter(
      (b) =>
        b.status === 'COMPLETED' &&
        new Date(b.createdAt) >= startOfMonth
    )
    return sum + spaceBookings.reduce((acc, b) => acc + b.totalPrice, 0)
  }, 0)

  // Average occupancy across all spaces (last 30 days)
  const analyticsAll = spaces.flatMap((s) => getAnalyticsForSpace(s.id, 30))
  const avgOccupancy =
    analyticsAll.length > 0
      ? Math.round(
          analyticsAll.reduce((sum, a) => sum + a.occupancyRate, 0) /
            analyticsAll.length
        )
      : 0

  // Recent bookings (last 5)
  const recentBookings = [...allBookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
              Total Spaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{spaces.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{allBookings.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
              Revenue (MTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">
              £{revenueMTD.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-500 text-xs uppercase tracking-wider font-semibold">
              Avg Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{avgOccupancy}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Verification Status */}
      <VerificationStatus userId={OWNER_ID} />

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/owner/listings/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 h-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Listing
          </Link>
          <Link
            href="/owner/promotions/new"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 h-8 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          >
            <Megaphone className="h-4 w-4" />
            Create Promotion
          </Link>
          <Link
            href="/owner/analytics"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 h-8 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          >
            <BarChart2 className="h-4 w-4" />
            View Analytics
          </Link>
        </div>
      </div>

      {/* Recent bookings */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-3">Recent Bookings</h2>
        <Card>
          <CardContent className="p-0">
            {recentBookings.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No bookings yet"
                description="When seekers book your spaces, they'll appear here."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                        Space
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                        Date
                      </th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                        Status
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => {
                      const space = getSpaceById(booking.spaceId)
                      return (
                        <tr
                          key={booking.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-slate-900 truncate max-w-[180px]">
                            {space?.title ?? booking.spaceId}
                          </td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                            {new Date(booking.startTime).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={booking.status} label={booking.status} />
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900">
                            £{booking.totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Incoming Bids */}
      <IncomingBidsList />
    </div>
  )
}
