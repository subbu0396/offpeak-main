'use client'

import { useState } from 'react'
import { Calendar, Link2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import type { CSVImportRow } from '@/types'

interface SyncState {
  google: boolean
  outlook: boolean
}

interface CalendarSyncConfigProps {
  rows: CSVImportRow[]
  onSyncCountChange?: (count: number) => void
}

function generateSyncUrl(title: string): string {
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const hash = Math.abs(slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0))
    .toString(16)
    .padStart(6, '0')
  return `https://calendar.offpeak.com/sync/${hash}`
}

export function CalendarSyncConfig({ rows, onSyncCountChange }: CalendarSyncConfigProps) {
  const [syncAll, setSyncAll] = useState(false)
  const [syncStates, setSyncStates] = useState<SyncState[]>(
    rows.map(() => ({ google: false, outlook: false }))
  )

  function totalSynced(): number {
    return syncStates.filter(s => s.google || s.outlook).length
  }

  function handleSyncAll(checked: boolean) {
    setSyncAll(checked)
    const updated = rows.map(() => ({ google: checked, outlook: checked }))
    setSyncStates(updated)
    onSyncCountChange?.(checked ? rows.length : 0)
  }

  function handleToggle(index: number, provider: 'google' | 'outlook', checked: boolean) {
    const updated = syncStates.map((s, i) =>
      i === index ? { ...s, [provider]: checked } : s
    )
    setSyncStates(updated)

    const synced = updated.filter(s => s.google || s.outlook).length
    setSyncAll(synced === rows.length)
    onSyncCountChange?.(synced)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Calendar Sync</h2>
        <p className="text-sm text-slate-500">
          Connect each space to Google Calendar or Outlook to keep availability in sync.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sync Configuration</CardTitle>
              <CardDescription>{totalSynced()} of {rows.length} spaces configured</CardDescription>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={syncAll}
                onCheckedChange={val => handleSyncAll(!!val)}
              />
              <span className="text-sm font-medium text-slate-700">Sync All</span>
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rows.map((row, i) => {
              const syncUrl = generateSyncUrl(row.title)
              return (
                <div key={i}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{row.title}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Link2 className="h-3 w-3 text-slate-500 shrink-0" />
                        <code className="text-xs text-teal-600 truncate">{syncUrl}</code>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={syncStates[i]?.google ?? false}
                          onCheckedChange={val => handleToggle(i, 'google', !!val)}
                        />
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-xs text-slate-600">Google</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={syncStates[i]?.outlook ?? false}
                          onCheckedChange={val => handleToggle(i, 'outlook', !!val)}
                        />
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                          <span className="text-xs text-slate-600">Outlook</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  {i < rows.length - 1 && <Separator className="mt-4" />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
