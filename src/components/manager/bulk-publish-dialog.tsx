'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { CSVImportRow } from '@/types'

interface BulkPublishDialogProps {
  count: number
  syncCount: number
  rows: CSVImportRow[]
  onConfirm: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportMore: () => void
}

type PublishState = 'idle' | 'publishing' | 'success'

export function BulkPublishDialog({
  count,
  syncCount,
  rows,
  onConfirm,
  open,
  onOpenChange,
  onImportMore,
}: BulkPublishDialogProps) {
  const [publishState, setPublishState] = useState<PublishState>('idle')

  function handlePublish() {
    setPublishState('publishing')
    setTimeout(() => {
      setPublishState('success')
      onConfirm()
    }, 2000)
  }

  function handleImportMore() {
    setPublishState('idle')
    onOpenChange(false)
    onImportMore()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {publishState === 'success' ? (
          // Success state
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                All {count} spaces published successfully!
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {syncCount > 0 && `${syncCount} calendar sync${syncCount > 1 ? 's' : ''} configured.`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
              <Button
                className="flex-1 bg-teal-500 text-white hover:bg-teal-600"
                render={<Link href="/manager" />}
                onClick={() => onOpenChange(false)}
              >
                View Spaces
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleImportMore}>
                Import More
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                Publish {count} space{count > 1 ? 's' : ''}
                {syncCount > 0 && ` with ${syncCount} calendar sync${syncCount > 1 ? 's' : ''}`}?
              </DialogTitle>
              <DialogDescription>
                The following spaces will be published and made available on the platform.
              </DialogDescription>
            </DialogHeader>

            {/* Space list */}
            <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 rounded-lg border border-slate-200">
              {rows.map((row, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                  <span className="text-sm text-slate-700">{row.title}</span>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                onClick={handlePublish}
                disabled={publishState === 'publishing'}
                className="bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-70"
              >
                {publishState === 'publishing' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing…
                  </>
                ) : (
                  'Publish All'
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
