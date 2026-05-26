'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/status-badge'
import { getSpaceById } from '@/lib/mock-data'
import { formatDate } from '@/lib/date-utils'
import type { FlagReport, FlagReportStatus } from '@/types'

interface FlagReportCardProps {
  report: FlagReport
}

function getBorderColor(status: FlagReportStatus): string {
  switch (status) {
    case 'OPEN':
      return 'border-l-red-500'
    case 'INVESTIGATING':
      return 'border-l-amber-500'
    case 'RESOLVED':
      return 'border-l-green-500'
    case 'DISMISSED':
      return 'border-l-slate-400'
    default:
      return 'border-l-slate-400'
  }
}

export function FlagReportCard({ report }: FlagReportCardProps) {
  const router = useRouter()
  const space = getSpaceById(report.spaceId)

  return (
    <Card
      className={`border-l-4 ${getBorderColor(report.status)} cursor-pointer hover:shadow-sm transition-shadow`}
      onClick={() => router.push(`/admin/moderation/${report.id}`)}
    >
      <CardContent className="py-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-slate-500 truncate">
                {space?.title ?? report.spaceId}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{report.reason}</p>
            <p className="text-sm text-slate-600 line-clamp-2 mt-0.5">
              {report.description}
            </p>
            <p className="text-xs text-slate-500 mt-1.5">
              {formatDate(report.createdAt)}
            </p>
          </div>
          <div className="shrink-0">
            <StatusBadge status={report.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
