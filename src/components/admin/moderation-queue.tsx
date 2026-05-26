'use client'

import { FlagReportCard } from './flag-report-card'
import type { FlagReport } from '@/types'

interface ModerationQueueProps {
  reports: FlagReport[]
}

export function ModerationQueue({ reports }: ModerationQueueProps) {
  return (
    <div className="space-y-3">
      {reports.map(report => (
        <FlagReportCard key={report.id} report={report} />
      ))}
    </div>
  )
}
