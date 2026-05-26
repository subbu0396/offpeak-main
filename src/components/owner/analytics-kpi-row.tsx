import { Eye, Calendar, DollarSign, PieChart, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AnalyticsSnapshot } from '@/types'

interface AnalyticsKpiRowProps {
  data: AnalyticsSnapshot[]
}

function getTrend(data: AnalyticsSnapshot[], key: keyof Pick<AnalyticsSnapshot, 'views' | 'bookings' | 'revenue' | 'occupancyRate' | 'offPeakUtilization'>) {
  if (data.length < 2) return 'neutral'
  const mid = Math.floor(data.length / 2)
  const firstHalf = data.slice(0, mid)
  const secondHalf = data.slice(mid)
  const avg = (arr: AnalyticsSnapshot[]) =>
    arr.reduce((s, d) => s + (d[key] as number), 0) / arr.length
  const diff = avg(secondHalf) - avg(firstHalf)
  if (diff > 0) return 'up'
  if (diff < 0) return 'down'
  return 'neutral'
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
  if (trend === 'up')
    return <TrendingUp className="h-3.5 w-3.5 text-green-600" />
  if (trend === 'down')
    return <TrendingDown className="h-3.5 w-3.5 text-red-500" />
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
}

export function AnalyticsKpiRow({ data }: AnalyticsKpiRowProps) {
  const sum = (key: keyof Pick<AnalyticsSnapshot, 'views' | 'bookings' | 'revenue'>) =>
    data.reduce((s, d) => s + d[key], 0)
  const avg = (key: keyof Pick<AnalyticsSnapshot, 'occupancyRate' | 'offPeakUtilization'>) =>
    data.length > 0
      ? Math.round(data.reduce((s, d) => s + d[key], 0) / data.length)
      : 0

  const kpis = [
    {
      label: 'Views',
      value: sum('views').toLocaleString(),
      icon: Eye,
      trend: getTrend(data, 'views'),
    },
    {
      label: 'Bookings',
      value: sum('bookings').toLocaleString(),
      icon: Calendar,
      trend: getTrend(data, 'bookings'),
    },
    {
      label: 'Revenue',
      value: `£${sum('revenue').toFixed(0)}`,
      icon: DollarSign,
      trend: getTrend(data, 'revenue'),
    },
    {
      label: 'Avg Occupancy',
      value: `${avg('occupancyRate')}%`,
      icon: PieChart,
      trend: getTrend(data, 'occupancyRate'),
    },
    {
      label: 'Off-Peak Util.',
      value: `${avg('offPeakUtilization')}%`,
      icon: Clock,
      trend: getTrend(data, 'offPeakUtilization'),
    },
  ] as const

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.label} size="sm">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                <Icon className="h-3.5 w-3.5" />
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-slate-900">{kpi.value}</span>
                <TrendIcon trend={kpi.trend} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
