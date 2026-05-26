'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const DEAL_TABS = [
  { value: 'all', label: 'All' },
  { value: 'flash', label: 'Flash Deals' },
  { value: 'free', label: 'Free Offers' },
  { value: 'discount', label: 'Discounts' },
] as const

export type DealTab = (typeof DEAL_TABS)[number]['value']

interface DealsFilterTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DealsFilterTabs({ activeTab, onTabChange }: DealsFilterTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => { if (v != null) onTabChange(String(v)) }}
    >
      <TabsList className="h-auto">
        {DEAL_TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
