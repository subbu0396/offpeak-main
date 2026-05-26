'use client'

import { AuditLogTable } from '@/components/admin/audit-log-table'
import { getAllModerationLogs } from '@/lib/mock-data-admin'

export default function AuditLogPage() {
  const logs = getAllModerationLogs()

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Audit Log</h1>
      <AuditLogTable logs={logs} />
    </div>
  )
}
