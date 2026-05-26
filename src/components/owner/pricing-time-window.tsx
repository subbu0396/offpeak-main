import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const DAYS = [
  { label: 'M', value: 1 },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'T', value: 4 },
  { label: 'F', value: 5 },
  { label: 'S', value: 6 },
  { label: 'S', value: 0 },
]

const TIME_OPTIONS: string[] = []
for (let h = 0; h < 24; h++) {
  for (const m of ['00', '30']) {
    TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${m}`)
  }
}

export interface TimeWindowValue {
  days: number[]
  startTime: string
  endTime: string
  discount: number
}

interface PricingTimeWindowProps {
  index: number
  value: TimeWindowValue
  onChange: (val: TimeWindowValue) => void
  onRemove: () => void
}

export function PricingTimeWindow({
  index,
  value,
  onChange,
  onRemove,
}: PricingTimeWindowProps) {
  function toggleDay(day: number) {
    const days = value.days.includes(day)
      ? value.days.filter((d) => d !== day)
      : [...value.days, day]
    onChange({ ...value, days })
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border border-border rounded-lg bg-muted/30">
      {/* Day toggles */}
      <div className="flex gap-1">
        {DAYS.map((d, i) => (
          <button
            key={`${d.value}-${i}`}
            type="button"
            onClick={() => toggleDay(d.value)}
            className={cn(
              'w-6 h-6 rounded-full text-xs font-medium transition-colors',
              value.days.includes(d.value)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
            title={`Day ${d.value}`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Start time */}
      <Select
        value={value.startTime}
        onValueChange={(v) => v !== null && onChange({ ...value, startTime: v })}
      >
        <SelectTrigger className="w-24 h-7 text-xs">
          <SelectValue placeholder="Start" />
        </SelectTrigger>
        <SelectContent>
          {TIME_OPTIONS.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-xs text-muted-foreground">to</span>

      {/* End time */}
      <Select
        value={value.endTime}
        onValueChange={(v) => v !== null && onChange({ ...value, endTime: v })}
      >
        <SelectTrigger className="w-24 h-7 text-xs">
          <SelectValue placeholder="End" />
        </SelectTrigger>
        <SelectContent>
          {TIME_OPTIONS.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Discount */}
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min={0}
          max={100}
          value={value.discount}
          onChange={(e) => onChange({ ...value, discount: Number(e.target.value) })}
          className="w-16 h-7 text-xs"
          aria-label={`Window ${index + 1} discount percentage`}
        />
        <span className="text-xs text-muted-foreground">%</span>
      </div>

      {/* Remove */}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        aria-label="Remove time window"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
