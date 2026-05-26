'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { ModerationAction } from '@/types'

interface ModerationActionDialogProps {
  action: ModerationAction
  spaceTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (notes: string) => void
}

const ACTION_CONFIG: Record<
  ModerationAction,
  { title: string; description: string; confirmLabel: string; confirmClass: string }
> = {
  APPROVE: {
    title: 'Approve Listing',
    description:
      'This will mark the listing as approved and clear the current flag report. The listing will remain active.',
    confirmLabel: 'Approve',
    confirmClass: 'bg-green-600 hover:bg-green-700 text-white border-transparent',
  },
  REQUEST_CHANGES: {
    title: 'Request Changes',
    description:
      'This will notify the owner that changes are required before this listing can continue operating. The flag will remain open until resolved.',
    confirmLabel: 'Request Changes',
    confirmClass: 'bg-amber-500 hover:bg-amber-600 text-white border-transparent',
  },
  SUSPEND: {
    title: 'Suspend Listing',
    description:
      'This will immediately suspend the listing and prevent new bookings. The owner will be notified. This action should only be taken for serious violations.',
    confirmLabel: 'Suspend Listing',
    confirmClass: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
  },
  DISMISS: {
    title: 'Dismiss Report',
    description:
      'This will dismiss the flag report as invalid or unfounded. No action will be taken against the listing.',
    confirmLabel: 'Dismiss',
    confirmClass: 'bg-slate-600 hover:bg-slate-700 text-white border-transparent',
  },
}

export function ModerationActionDialog({
  action,
  spaceTitle,
  open,
  onOpenChange,
  onConfirm,
}: ModerationActionDialogProps) {
  const [notes, setNotes] = useState('')
  const config = ACTION_CONFIG[action]
  const isValid = notes.trim().length >= 10

  function handleConfirm() {
    if (!isValid) return
    onConfirm(notes.trim())
    setNotes('')
    onOpenChange(false)
  }

  function handleOpenChange(val: boolean) {
    if (!val) setNotes('')
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-slate-900">{spaceTitle}</span>
            {' — '}
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Admin Notes <span className="text-red-500">*</span>
          </label>
          <Textarea
            placeholder="Provide detailed notes explaining this decision (min 10 characters)..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="min-h-24 resize-none"
          />
          {notes.length > 0 && notes.trim().length < 10 && (
            <p className="text-xs text-red-500">Notes must be at least 10 characters.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className={config.confirmClass}
            disabled={!isValid}
            onClick={handleConfirm}
          >
            {config.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
