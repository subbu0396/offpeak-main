'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const BOOKING_TABS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'bids', label: 'Bids' },
] as const

export type BookingTab = (typeof BOOKING_TABS)[number]['value']

interface BookingsTabFilterProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BookingsTabFilter({ activeTab, onTabChange }: BookingsTabFilterProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => { if (v != null) onTabChange(String(v)) }}
    >
      <TabsList className="h-auto">
        {BOOKING_TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
