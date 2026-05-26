'use client'

import Link from 'next/link'
import { AlertTriangle, Clock, Ban, Users } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getFlaggedListings, getAllFlagReports } from '@/lib/mock-data-admin'
import { getAllSpaces } from '@/lib/mock-data'
import type { FlagReportStatus } from '@/types'

function getStatusBadgeClass(status: FlagReportStatus): string {
  switch (status) {
    case 'OPEN':
      return 'bg-red-500/10 text-red-700 border-red-500/20'
    case 'INVESTIGATING':
      return 'bg-amber-500/10 text-amber-700 border-amber-500/20'
    case 'RESOLVED':
      return 'bg-green-500/10 text-green-700 border-green-500/20'
    case 'DISMISSED':
      return 'bg-slate-100 text-slate-600 border-slate-200'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

export default function AdminDashboardPage() {
  const flaggedListings = getFlaggedListings()
  const allReports = getAllFlagReports()
  const allSpaces = getAllSpaces()

  const openFlags = flaggedListings.filter(r => r.status === 'OPEN').length
  const pendingReviews = flaggedListings.filter(r => r.status === 'INVESTIGATING').length
  const suspendedListings = allSpaces.filter(s => s.status === 'SUSPENDED').length
  // Mock total users count
  const totalUsers = 42

  const recentReports = [...allReports]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Open Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${openFlags > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {openFlags}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{pendingReviews}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Ban className="h-3.5 w-3.5" />
              Suspended Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{suspendedListings}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-slate-500 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{totalUsers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent flag reports */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-900">Recent Flag Reports</h2>
          <Link
            href="/admin/moderation"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            View all
          </Link>
        </div>
        <div className="space-y-2">
          {recentReports.length === 0 ? (
            <p className="text-sm text-slate-500">No flag reports.</p>
          ) : (
            recentReports.map(report => (
              <Link
                key={report.id}
                href={`/admin/moderation/${report.id}`}
                className="block"
              >
                <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {report.reason}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {report.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-500">
                        {new Date(report.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <Badge className={getStatusBadgeClass(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
