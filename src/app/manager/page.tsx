'use client'

import Link from 'next/link'
import { Building2, Upload, RefreshCw, LayoutDashboard, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getAllSpaces } from '@/lib/mock-data'
import { useAuthStore } from '@/store/auth-store'

export default function ManagerDashboardPage() {
  const { currentUser } = useAuthStore()
  const allSpaces = getAllSpaces()
  const managedSpaces = allSpaces.filter(s => s.managerId === currentUser.id)
  const totalSpaces = managedSpaces.length > 0 ? managedSpaces.length : allSpaces.length

  const kpis = [
    {
      label: 'Total Managed Spaces',
      value: totalSpaces,
      icon: Building2,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      label: 'Pending Imports',
      value: 0,
      icon: Upload,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Sync Status',
      value: 'Active',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ]

  const quickActions = [
    {
      title: 'Bulk Import',
      description: 'Upload a CSV file to add multiple spaces at once.',
      icon: Upload,
      href: '/manager/import',
      cta: 'Start Import',
      badge: 'New',
    },
    {
      title: 'Manage Spaces',
      description: 'View and edit all spaces assigned to your account.',
      icon: Building2,
      href: '/manager/spaces',
      cta: 'View Spaces',
      badge: null,
    },
    {
      title: 'Sync Calendars',
      description: 'Connect Google Calendar or Outlook to your spaces.',
      icon: RefreshCw,
      href: '/manager/import',
      cta: 'Configure Sync',
      badge: null,
    },
  ]

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-teal-500" />
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Manager Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, {currentUser.name}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <section aria-label="Key metrics">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {kpis.map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-2xl font-semibold text-slate-900">{value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-label="Quick actions">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map(({ title, description, icon: Icon, href, cta, badge }) => (
            <Card key={title} className="hover:ring-teal-300 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Icon className="h-5 w-5 text-slate-600" />
                  </div>
                  {badge && (
                    <Badge className="bg-teal-500 text-white border-transparent">{badge}</Badge>
                  )}
                </div>
                <CardTitle className="mt-2">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-teal-500 text-white hover:bg-teal-600"
                  render={<Link href={href} />}
                >
                  {cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
