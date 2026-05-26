'use client'

import { useState } from 'react'
import { CheckCircle, MessageSquare, Ban, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModerationActionDialog } from './moderation-action-dialog'
import type { FlagReport, ModerationAction } from '@/types'

interface ModerationActionBarProps {
  report: FlagReport
  spaceTitle: string
  onAction: (action: ModerationAction, notes: string) => void
}

export function ModerationActionBar({ report, spaceTitle, onAction }: ModerationActionBarProps) {
  const [activeAction, setActiveAction] = useState<ModerationAction | null>(null)

  const isResolved = report.status === 'RESOLVED' || report.status === 'DISMISSED'

  function handleConfirm(notes: string) {
    if (!activeAction) return
    onAction(activeAction, notes)
    setActiveAction(null)
  }

  return (
    <>
      <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4 z-20">
        {isResolved ? (
          <p className="text-sm text-slate-500 text-center">
            This report has been {report.status.toLowerCase()}. No further actions available.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2 justify-end max-w-5xl mx-auto">
            <span className="text-sm text-slate-500 mr-auto">Actions:</span>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white border-transparent gap-1.5"
              onClick={() => setActiveAction('APPROVE')}
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-white border-transparent gap-1.5"
              onClick={() => setActiveAction('REQUEST_CHANGES')}
            >
              <MessageSquare className="h-4 w-4" />
              Request Changes
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white border-transparent gap-1.5"
              onClick={() => setActiveAction('SUSPEND')}
            >
              <Ban className="h-4 w-4" />
              Suspend
            </Button>
            <Button
              className="bg-slate-600 hover:bg-slate-700 text-white border-transparent gap-1.5"
              onClick={() => setActiveAction('DISMISS')}
            >
              <XCircle className="h-4 w-4" />
              Dismiss
            </Button>
          </div>
        )}
      </div>

      {activeAction && (
        <ModerationActionDialog
          action={activeAction}
          spaceTitle={spaceTitle}
          open={!!activeAction}
          onOpenChange={(open) => {
            if (!open) setActiveAction(null)
          }}
          onConfirm={handleConfirm}
        />
      )}
    </>
  )
}
