import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { Promotion } from '@/types'

interface PromotionMonitorProps {
  promotion: Promotion
}

export function PromotionMonitor({ promotion }: PromotionMonitorProps) {
  const [active, setActive] = useState(promotion.isActive)
  const [reconcileOpen, setReconcileOpen] = useState(false)

  const progress =
    promotion.redemptionLimit && promotion.redemptionLimit > 0
      ? Math.min(100, Math.round((promotion.redemptionCount / promotion.redemptionLimit) * 100))
      : null

  const revenueEstimate = (promotion.redemptionCount * 15).toFixed(2)

  return (
    <>
      <Card>
        <CardContent className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-900">{promotion.title}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActive((a) => !a)}
            >
              {active ? 'Pause' : 'Activate'}
            </Button>
          </div>

          {/* Redemption progress */}
          {progress !== null && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Redemptions</span>
                <span>
                  {promotion.redemptionCount} / {promotion.redemptionLimit}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{progress}% redeemed</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Est. revenue:{' '}
              <span className="font-medium text-slate-700">£{revenueEstimate}</span>
            </p>
            <Button variant="ghost" size="sm" onClick={() => setReconcileOpen(true)}>
              Reconcile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={reconcileOpen} onOpenChange={setReconcileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revenue Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Promotion: <span className="font-medium text-slate-900">{promotion.title}</span>
            </p>
            <p className="text-muted-foreground">
              Total redemptions:{' '}
              <span className="font-medium text-slate-900">{promotion.redemptionCount}</span>
            </p>
            <p className="text-muted-foreground">
              Revenue generated:{' '}
              <span className="font-medium text-teal-700">£{revenueEstimate}</span>
            </p>
          </div>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </>
  )
}
