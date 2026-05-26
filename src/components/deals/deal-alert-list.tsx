'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Bell, BellOff } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { getAlertsForUser } from '@/lib/mock-data-events'
import type { DealAlert } from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function DealAlertList() {
  const { currentUser } = useAuthStore()
  const router = useRouter()
  const initialAlerts = getAlertsForUser(currentUser.id)
  const [alerts, setAlerts] = useState<DealAlert[]>(initialAlerts)

  function handleAlertClick(alert: DealAlert) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, read: true } : a))
    )
    router.push(`/spaces/${alert.spaceId}`)
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
        <BellOff className="size-10 text-slate-300" />
        <p className="text-sm">No alerts yet. Enable notifications to get started.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {alerts.map((alert) => (
        <button
          key={alert.id}
          onClick={() => handleAlertClick(alert)}
          className={cn(
            'w-full text-left rounded-xl border border-border p-4 flex items-start gap-3 transition-colors hover:bg-muted/50',
            !alert.read && 'bg-teal-50 border-teal-200'
          )}
        >
          {/* Placeholder thumbnail */}
          <div className="size-12 rounded-lg bg-slate-200 shrink-0 flex items-center justify-center">
            <Bell className={cn('size-5', !alert.read ? 'text-teal-500' : 'text-slate-500')} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm leading-snug text-foreground">{alert.message}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
            </p>
          </div>

          {/* Read badge */}
          {!alert.read && (
            <Badge className="shrink-0 bg-teal-500 text-white border-transparent hover:bg-teal-500">
              New
            </Badge>
          )}
        </button>
      ))}
    </div>
  )
}
