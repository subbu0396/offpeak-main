'use client'

import { Bell } from 'lucide-react'
import { NotificationPreferences } from '@/components/deals/notification-preferences'
import { DealAlertList } from '@/components/deals/deal-alert-list'

export default function DealsPreferencesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Bell className="size-7 text-teal-600" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Preferences</h1>
          <p className="text-sm text-muted-foreground">
            Manage how and when you receive deal alerts
          </p>
        </div>
      </div>

      {/* Preferences form */}
      <NotificationPreferences />

      {/* Recent alerts */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Alerts</h2>
        <DealAlertList />
      </section>
    </div>
  )
}
