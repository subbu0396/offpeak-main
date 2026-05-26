'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AnalyticsSnapshot } from '@/types'

interface AnalyticsChartProps {
  data: AnalyticsSnapshot[]
  metric: 'bookings' | 'revenue' | 'occupancyRate'
}

const METRIC_LABELS: Record<AnalyticsChartProps['metric'], string> = {
  bookings: 'Bookings',
  revenue: 'Revenue (£)',
  occupancyRate: 'Occupancy (%)',
}

export function AnalyticsChart({ data, metric }: AnalyticsChartProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const values = data.map((d) => d[metric] as number)
  const maxValue = Math.max(...values, 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{METRIC_LABELS[metric]}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data available.</p>
        ) : (
          <div className="relative">
            {/* Y-axis max label */}
            <div className="absolute -top-1 -left-1 text-xs text-muted-foreground">
              {metric === 'revenue' ? `£${maxValue}` : maxValue}
            </div>

            {/* Chart bars */}
            <div className="flex items-end gap-0.5 h-32 mt-4">
              {data.map((d, i) => {
                const height = Math.max(2, Math.round((values[i] / maxValue) * 100))
                const isHovered = hovered === i

                return (
                  <div
                    key={d.date}
                    className="flex-1 flex flex-col items-center justify-end relative group"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-1 z-10 bg-popover text-popover-foreground rounded-md px-2 py-1 text-xs shadow-md ring-1 ring-foreground/10 whitespace-nowrap pointer-events-none">
                        <p className="font-medium">{d.date}</p>
                        <p>
                          {metric === 'revenue'
                            ? `£${values[i].toFixed(2)}`
                            : metric === 'occupancyRate'
                            ? `${values[i]}%`
                            : values[i]}
                        </p>
                      </div>
                    )}
                    <div
                      className="w-full bg-teal-500 hover:bg-teal-600 transition-colors rounded-t-sm cursor-default"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                )
              })}
            </div>

            {/* X-axis date labels */}
            <div className="flex items-end gap-0.5 mt-1">
              {data.map((d, i) => (
                <div key={d.date} className="flex-1 flex justify-center">
                  {i % 5 === 0 && (
                    <span className="text-[10px] text-muted-foreground rotate-45 origin-left whitespace-nowrap">
                      {d.date.slice(5)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
