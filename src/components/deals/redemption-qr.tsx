'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { QRCodeDisplay } from '@/components/booking/qr-code-display'
import { Button } from '@/components/ui/button'

interface RedemptionQRProps {
  bookingId: string
  promotionCode?: string
}

export function RedemptionQR({ bookingId, promotionCode }: RedemptionQRProps) {
  const [redeemed, setRedeemed] = useState(false)

  const qrValue = `REDEEM-${bookingId}`
  const displayCode = promotionCode ?? qrValue

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/30 p-4 text-center">
      <p className="text-sm font-semibold text-foreground">Redemption Code</p>

      <QRCodeDisplay value={qrValue} />

      <code className="font-mono text-xs tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
        {displayCode}
      </code>

      <p className="text-xs text-muted-foreground">Show this to staff on arrival</p>

      {redeemed ? (
        <div className="flex items-center gap-1.5 text-green-700 text-xs font-medium">
          <CheckCircle2 className="size-4" />
          Offer redeemed!
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRedeemed(true)}
          className="text-xs"
        >
          Mark as Redeemed
        </Button>
      )}
    </div>
  )
}
