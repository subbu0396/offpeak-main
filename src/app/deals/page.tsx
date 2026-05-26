'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { Tag, Zap } from 'lucide-react'
import { getActiveDeals, getSpaceById } from '@/lib/mock-data'
import { FlashDealCard } from '@/components/deals/flash-deal-card'
import { PromoCard } from '@/components/deals/promo-card'
import { DealsFilterTabs } from '@/components/deals/deals-filter-tabs'
import { EmptyState } from '@/components/common/empty-state'
import type { Promotion, Space } from '@/types'

// Note: metadata export not compatible with 'use client', but spec requests it;
// it is defined here as a comment for reference — set in a separate layout or via head if needed.
// export const metadata: Metadata = { title: 'Deals & Flash Offers | OffPeak Spaces' }

type DealWithSpace = { promotion: Promotion; space: Space }

function buildDealItems(): DealWithSpace[] {
  const deals = getActiveDeals()
  return deals.flatMap((promotion) => {
    const space = getSpaceById(promotion.spaceId)
    if (!space) return []
    return [{ promotion, space }]
  })
}

export default function DealsPage() {
  const [activeTab, setActiveTab] = useState('all')

  const allItems = buildDealItems()

  const flashItems = allItems.filter((d) => d.promotion.type === 'FLASH_DEAL')
  const freeItems = allItems.filter((d) => d.promotion.type === 'FREEBIE')
  const discountItems = allItems.filter(
    (d) => d.promotion.type === 'DISCOUNT' || d.promotion.type === 'PROMO_CODE'
  )

  const showFlash = activeTab === 'all' || activeTab === 'flash'
  const showPromos = activeTab === 'all' || activeTab === 'free' || activeTab === 'discount'

  const visibleFlash = activeTab === 'flash' ? flashItems : activeTab === 'all' ? flashItems : []
  const visiblePromos =
    activeTab === 'all'
      ? [...freeItems, ...discountItems]
      : activeTab === 'free'
        ? freeItems
        : activeTab === 'discount'
          ? discountItems
          : []

  const isEmpty = visibleFlash.length === 0 && visiblePromos.length === 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Deals &amp; Offers</h1>
        <p className="text-muted-foreground">
          Grab the best off-peak deals before they&apos;re gone
        </p>
      </div>

      {/* Filter tabs */}
      <DealsFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {isEmpty && (
        <EmptyState
          icon={Tag}
          title="No deals available"
          description="Check back soon — new deals are added regularly."
        />
      )}

      {/* Flash deals section */}
      {showFlash && visibleFlash.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-teal-600" />
            <h2 className="text-xl font-semibold">Flash Deals</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {visibleFlash.map(({ promotion, space }) => (
              <div key={promotion.id} className="snap-start">
                <FlashDealCard promotion={promotion} space={space} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Promotions grid */}
      {showPromos && visiblePromos.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {activeTab === 'free' ? 'Free Offers' : activeTab === 'discount' ? 'Discounts' : 'Promotions'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visiblePromos.map(({ promotion, space }) => (
              <PromoCard key={promotion.id} promotion={promotion} space={space} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
