'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModerationDetail } from '@/components/admin/moderation-detail'
import { ModerationInvestigationPanel } from '@/components/admin/moderation-investigation-panel'
import { ModerationActionBar } from '@/components/admin/moderation-action-bar'
import { getFlagReportById } from '@/lib/mock-data-admin'
import { getSpaceById } from '@/lib/mock-data'
import type { FlagReport, FlagReportStatus, ModerationAction } from '@/types'

export default function ModerationInvestigationPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] ?? ''

  const initialReport = getFlagReportById(id)
  const space = initialReport ? getSpaceById(initialReport.spaceId) : undefined

  const [report, setReport] = useState<FlagReport | undefined>(initialReport)

  if (!report || !space) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-500">Report not found.</p>
      </div>
    )
  }

  function handleAction(action: ModerationAction, notes: string) {
    const statusMap: Record<ModerationAction, FlagReportStatus> = {
      APPROVE: 'RESOLVED',
      REQUEST_CHANGES: 'RESOLVED',
      SUSPEND: 'RESOLVED',
      DISMISS: 'DISMISSED',
    }

    setReport(prev =>
      prev
        ? {
            ...prev,
            status: statusMap[action],
            adminAction: action,
            adminNotes: notes,
            resolvedAt: new Date().toISOString(),
          }
        : prev
    )

    // Navigate back after a short delay so the user sees the updated state
    setTimeout(() => {
      router.push('/admin/moderation')
    }, 800)
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 mb-3 -ml-1"
            onClick={() => router.push('/admin/moderation')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Queue
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Investigation: {report.reason}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Report ID: {report.id}</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModerationDetail space={space} />
          <ModerationInvestigationPanel report={report} space={space} />
        </div>
      </div>

      {/* Sticky action bar */}
      <ModerationActionBar
        report={report}
        spaceTitle={space.title}
        onAction={handleAction}
      />
    </div>
  )
}
