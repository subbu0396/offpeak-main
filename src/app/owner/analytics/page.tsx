'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AnalyticsKpiRow } from '@/components/owner/analytics-kpi-row'
import { AnalyticsChart } from '@/components/owner/analytics-chart'
import { DemandForecast } from '@/components/owner/demand-forecast'
import { getSpacesForOwner, getAnalyticsForSpace } from '@/lib/mock-data-owner'

const OWNER_ID = 'owner-001'
const DATE_RANGES = [7, 14, 30, 90] as const
type DateRange = typeof DATE_RANGES[number]

export default function AnalyticsPage() {
  const spaces = getSpacesForOwner(OWNER_ID)
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>(spaces[0]?.id ?? '')
  const [dateRange, setDateRange] = useState<DateRange>(30)

  const data = selectedSpaceId
    ? getAnalyticsForSpace(selectedSpaceId, dateRange)
    : []

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track performance and discover insights for your spaces.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={selectedSpaceId} onValueChange={(v) => v !== null && setSelectedSpaceId(v)}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select space" />
          </SelectTrigger>
          <SelectContent>
            {spaces.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1">
          {DATE_RANGES.map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range}d
            </Button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <AnalyticsKpiRow data={data} />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsChart data={data} metric="bookings" />
        <AnalyticsChart data={data} metric="revenue" />
      </div>

      {/* Demand forecast / AI insights */}
      <DemandForecast />
    </div>
  )
}
