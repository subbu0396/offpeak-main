'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getSpaceById } from '@/lib/mock-data'
import type { ModerationLog, ModerationAction } from '@/types'

interface AuditLogTableProps {
  logs: ModerationLog[]
}

type ActionFilter = ModerationAction | 'ALL'

const ACTION_CONFIG: Record<
  ModerationAction,
  { label: string; className: string }
> = {
  APPROVE: {
    label: 'Approve',
    className: 'bg-green-500/10 text-green-700 border-green-500/20',
  },
  REQUEST_CHANGES: {
    label: 'Request Changes',
    className: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  },
  SUSPEND: {
    label: 'Suspend',
    className: 'bg-red-500/10 text-red-700 border-red-500/20',
  },
  DISMISS: {
    label: 'Dismiss',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
}

const FILTER_OPTIONS: { value: ActionFilter; label: string }[] = [
  { value: 'ALL', label: 'All Actions' },
  { value: 'APPROVE', label: 'Approve' },
  { value: 'REQUEST_CHANGES', label: 'Request Changes' },
  { value: 'SUSPEND', label: 'Suspend' },
  { value: 'DISMISS', label: 'Dismiss' },
]

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [actionFilter, setActionFilter] = useState<ActionFilter>('ALL')

  const filtered =
    actionFilter === 'ALL'
      ? logs
      : logs.filter(l => l.action === actionFilter)

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {sorted.length} {sorted.length === 1 ? 'entry' : 'entries'}
        </p>
        <Select
          value={actionFilter}
          onValueChange={(v) => setActionFilter(v as ActionFilter)}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {sorted.length === 0 ? (
            <p className="text-sm text-slate-500 p-4">No audit log entries.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                      Admin
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                      Space
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                      Action
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(log => {
                    const space = getSpaceById(log.spaceId)
                    const config = ACTION_CONFIG[log.action]
                    return (
                      <tr
                        key={log.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-mono text-xs whitespace-nowrap">
                          {log.adminId}
                        </td>
                        <td className="px-4 py-3 text-slate-900 font-medium max-w-[200px] truncate">
                          {space?.title ?? log.spaceId}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={config.className}>
                            {config.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-[300px]">
                          <span className="line-clamp-2">{log.notes}</span>
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
  )
}
