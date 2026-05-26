'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Bid } from '@/types'

interface BidActionDialogProps {
  action: 'ACCEPT' | 'COUNTER' | 'REJECT'
  bid: Bid
  spaceName: string
  onClose: () => void
  onSuccess: () => void
}

export function BidActionDialog({
  action,
  bid,
  spaceName,
  onClose,
  onSuccess,
}: BidActionDialogProps) {
  const [counterPrice, setCounterPrice] = useState(
    bid.counterPrice ? String(bid.counterPrice) : String(bid.proposedPrice)
  )
  const [message, setMessage] = useState('')
  const [reason, setReason] = useState('')

  function handleConfirm() {
    onSuccess()
    onClose()
  }

  const title =
    action === 'ACCEPT'
      ? 'Accept Bid'
      : action === 'COUNTER'
      ? 'Counter Bid'
      : 'Reject Bid'

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Space: <span className="font-medium text-slate-900">{spaceName}</span>
          </p>
          <p className="text-muted-foreground">
            Proposed price:{' '}
            <span className="font-bold text-slate-900">
              £{bid.proposedPrice.toFixed(2)}
            </span>
          </p>

          {action === 'ACCEPT' && (
            <p className="text-muted-foreground">
              Accepting this bid will confirm the booking at the proposed price of{' '}
              <strong>£{bid.proposedPrice.toFixed(2)}</strong>.
            </p>
          )}

          {action === 'COUNTER' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Counter Price (£)</label>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  aria-label="Counter price"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Message (optional)</label>
                <Textarea
                  placeholder="Explain your counter offer..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </>
          )}

          {action === 'REJECT' && (
            <>
              <p className="text-muted-foreground">
                This will reject the bid and notify the seeker.
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Reason (optional)
                </label>
                <Textarea
                  placeholder="Provide a reason for rejection..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={action === 'REJECT' ? 'destructive' : 'default'}
            onClick={handleConfirm}
          >
            {action === 'ACCEPT' && 'Accept Bid'}
            {action === 'COUNTER' && 'Send Counter'}
            {action === 'REJECT' && 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
