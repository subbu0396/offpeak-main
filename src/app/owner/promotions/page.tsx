'use client'

import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PromotionMonitor } from '@/components/owner/promotion-monitor'
import { getSpacesForOwner } from '@/lib/mock-data-owner'
import { getPromotionsForSpace } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import type { Promotion, PromotionType } from '@/types'

const OWNER_ID = 'owner-001'

function getTypeBadgeClass(type: PromotionType): string {
  switch (type) {
    case 'DISCOUNT':
      return 'bg-blue-500/10 text-blue-700 border-blue-500/20'
    case 'FREEBIE':
      return 'bg-purple-500/10 text-purple-700 border-purple-500/20'
    case 'FLASH_DEAL':
      return 'bg-orange-500/10 text-orange-700 border-orange-500/20'
    case 'PROMO_CODE':
      return 'bg-teal-500/10 text-teal-700 border-teal-500/20'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

function isExpired(promo: Promotion): boolean {
  return new Date(promo.validTo) < new Date()
}

export default function PromotionsPage() {
  const spaces = getSpacesForOwner(OWNER_ID)
  const promotions: (Promotion & { spaceName: string })[] = spaces.flatMap((s) =>
    getPromotionsForSpace(s.id).map((p) => ({
      ...p,
      spaceName: s.title,
    }))
  )

  const active = promotions.filter((p) => p.isActive && !isExpired(p))
  const expired = promotions.filter((p) => !p.isActive || isExpired(p))

  function PromotionCard({ promo }: { promo: Promotion & { spaceName: string } }) {
    const expired = isExpired(promo)
    const progress =
      promo.redemptionLimit && promo.redemptionLimit > 0
        ? Math.min(100, Math.round((promo.redemptionCount / promo.redemptionLimit) * 100))
        : null

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm leading-snug">{promo.title}</CardTitle>
            <Badge className={`text-xs flex-shrink-0 ${getTypeBadgeClass(promo.type)}`}>
              {promo.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">{promo.spaceName}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>From: {new Date(promo.validFrom).toLocaleDateString('en-GB')}</span>
            <span>To: {new Date(promo.validTo).toLocaleDateString('en-GB')}</span>
          </div>

          {progress !== null && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Redemptions</span>
                <span>
                  {promo.redemptionCount} / {promo.redemptionLimit}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {!expired && promo.isActive && (
            <div className="pt-1">
              <PromotionMonitor promotion={promo} />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Promotions</h1>
        <Link href="/owner/promotions/new" className={cn(buttonVariants())}>
          <PlusCircle className="h-4 w-4" />
          Create Promotion
        </Link>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({promotions.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expired.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {promotions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No promotions yet. Create one to boost bookings.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {promotions.map((p) => (
                <PromotionCard key={p.id} promo={p} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
          {active.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No active promotions.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {active.map((p) => (
                <PromotionCard key={p.id} promo={p} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expired">
          {expired.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No expired promotions.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {expired.map((p) => (
                <PromotionCard key={p.id} promo={p} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
