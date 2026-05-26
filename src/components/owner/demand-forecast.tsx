'use client'

import { useState } from 'react'
import { Sparkles, Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface Recommendation {
  id: string
  text: string
  action?: { label: string; confirmText: string }
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    text: 'Consider a 15% discount on Wednesdays 2–5pm — low occupancy detected.',
    action: {
      label: 'Apply',
      confirmText:
        'This will create a 15% off-peak discount for Wednesdays 2–5pm across your relevant spaces. Confirm?',
    },
  },
  {
    id: 'rec-2',
    text: 'Flash deal opportunity: Saturday morning slots show 90% fill rate — promote to capture remaining demand.',
    action: {
      label: 'Create Deal',
      confirmText:
        'This will open a new flash deal for Saturday morning slots. Confirm to proceed?',
    },
  },
  {
    id: 'rec-3',
    text: 'Your off-peak pricing is generating 35% more bookings than standard rates. Great work!',
  },
]

export function DemandForecast() {
  const [confirmRec, setConfirmRec] = useState<Recommendation | null>(null)
  const [applied, setApplied] = useState<string[]>([])

  function handleConfirm() {
    if (confirmRec) {
      setApplied((prev) => [...prev, confirmRec.id])
      setConfirmRec(null)
    }
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold text-slate-900">AI-Powered Insights</h2>
        </div>

        <div className="space-y-3">
          {RECOMMENDATIONS.map((rec) => {
            const isApplied = applied.includes(rec.id)
            return (
              <Card key={rec.id}>
                <CardContent className="flex items-start gap-3 pt-1">
                  <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{rec.text}</p>
                  </div>
                  {rec.action && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isApplied}
                      onClick={() => setConfirmRec(rec)}
                    >
                      {isApplied ? 'Applied' : rec.action.label}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Dialog open={confirmRec !== null} onOpenChange={(open) => !open && setConfirmRec(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{confirmRec?.action?.confirmText}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRec(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
