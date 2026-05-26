'use client'

import { useState } from 'react'
import { Gavel } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/status-badge'
import { EmptyState } from '@/components/common/empty-state'
import { BidActionDialog } from './bid-action-dialog'
import { getIncomingBidsForOwner, getSpacesForOwner } from '@/lib/mock-data-owner'
import type { Bid, BidStatus } from '@/types'

const OWNER_ID = 'owner-001'

function formatTimeUntil(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 24) return `${hours}h remaining`
  const days = Math.floor(hours / 24)
  return `${days}d remaining`
}

interface DialogState {
  bid: Bid
  action: 'ACCEPT' | 'COUNTER' | 'REJECT'
  spaceName: string
}

export function IncomingBidsList() {
  const spaces = getSpacesForOwner(OWNER_ID)
  const spaceMap = Object.fromEntries(spaces.map((s) => [s.id, s.title]))

  const [bids, setBids] = useState(getIncomingBidsForOwner(OWNER_ID))
  const [dialog, setDialog] = useState<DialogState | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function openDialog(bid: Bid, action: 'ACCEPT' | 'COUNTER' | 'REJECT') {
    setDialog({ bid, action, spaceName: spaceMap[bid.spaceId] ?? bid.spaceId })
  }

  function handleSuccess() {
    if (!dialog) return
    const { bid, action } = dialog
    const newStatus: BidStatus =
      action === 'ACCEPT' ? 'ACCEPTED' : action === 'COUNTER' ? 'COUNTERED' : 'REJECTED'
    setBids((prev) =>
      prev.map((b) => (b.id === bid.id ? { ...b, status: newStatus } : b))
    )
    const msg =
      action === 'ACCEPT'
        ? 'Bid accepted!'
        : action === 'COUNTER'
        ? 'Counter sent!'
        : 'Bid rejected.'
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <>
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Incoming Bids</h2>

        {toastMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-2">
            {toastMessage}
          </div>
        )}

        {bids.length === 0 ? (
          <EmptyState
            icon={Gavel}
            title="No incoming bids"
            description="When seekers make offers on your spaces, they'll appear here."
          />
        ) : (
          <div className="space-y-3">
            {bids.map((bid) => (
              <Card key={bid.id}>
                <CardContent className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {spaceMap[bid.spaceId] ?? bid.spaceId}
                      </p>
                      <p className="text-xs text-muted-foreground">Seeker</p>
                      {bid.message && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          &ldquo;{bid.message}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-base font-bold text-slate-900">
                        £{bid.proposedPrice.toFixed(2)}
                      </span>
                      <StatusBadge status={bid.status} />
                    </div>
                  </div>

                  {bid.status === 'PENDING' && (
                    <p className="text-xs text-muted-foreground">
                      {formatTimeUntil(bid.expiresAt)}
                    </p>
                  )}

                  {bid.status === 'PENDING' && (
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white border-0"
                        onClick={() => openDialog(bid, 'ACCEPT')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-400 text-amber-700 hover:bg-amber-50"
                        onClick={() => openDialog(bid, 'COUNTER')}
                      >
                        Counter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => openDialog(bid, 'REJECT')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}

                  {bid.status === 'COUNTERED' && bid.counterPrice && (
                    <p className="text-xs text-muted-foreground">
                      Counter price sent:{' '}
                      <span className="font-medium text-slate-700">
                        £{bid.counterPrice.toFixed(2)}
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {dialog && (
        <BidActionDialog
          action={dialog.action}
          bid={dialog.bid}
          spaceName={dialog.spaceName}
          onClose={() => setDialog(null)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
