'use client'

import { useOwnerStore } from '@/store/owner-store'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const DAYS = [
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
  { label: 'Sun', value: 0 },
]

// Generate time options in 30-min increments 00:00–23:30
function generateTimeOptions(): string[] {
  const times: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return times
}

const TIME_OPTIONS = generateTimeOptions()

export function ListingStepAvailability() {
  const { pricingConfig, updatePricingConfig } = useOwnerStore()
  const activeDays = useOwnerStore((s) => s.activeDays)
  const offPeakDays = useOwnerStore((s) => s.offPeakDays)
  const startTime = useOwnerStore((s) => s.scheduleStartTime)
  const endTime = useOwnerStore((s) => s.scheduleEndTime)
  const setActiveDays = useOwnerStore((s) => s.setActiveDays)
  const setOffPeakDays = useOwnerStore((s) => s.setOffPeakDays)
  const setScheduleStartTime = useOwnerStore((s) => s.setScheduleStartTime)
  const setScheduleEndTime = useOwnerStore((s) => s.setScheduleEndTime)

  const basePrice = pricingConfig.basePrice ?? 0
  const offPeakDiscount = pricingConfig.offPeakDiscount ?? 0
  const minPrice = pricingConfig.minPrice ?? 0

  const offPeakPrice = basePrice > 0
    ? Math.max(minPrice, Math.round(basePrice * (1 - offPeakDiscount / 100)))
    : 0

  function toggleDay(day: number) {
    const newDays = activeDays.includes(day)
      ? activeDays.filter((d) => d !== day)
      : [...activeDays, day]
    setActiveDays(newDays)
  }

  function toggleOffPeak(day: number) {
    const newDays = offPeakDays.includes(day)
      ? offPeakDays.filter((d) => d !== day)
      : [...offPeakDays, day]
    setOffPeakDays(newDays)
  }

  function handleStartTime(t: string | null) {
    if (t) setScheduleStartTime(t)
  }

  function handleEndTime(t: string | null) {
    if (t) setScheduleEndTime(t)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Availability & Pricing</h2>
        <p className="text-sm text-slate-500 mt-1">
          Set when your space is available and configure your pricing strategy.
        </p>
      </div>

      {/* Day toggles */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Available Days</p>
        <div className="flex flex-wrap gap-2">
          {DAYS.map(({ label, value }) => {
            const isActive = activeDays.includes(value)
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleDay(value)}
                className={cn(
                  'h-9 w-12 rounded-lg border-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-teal-500 bg-teal-500 text-white'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-teal-300'
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
        {activeDays.length === 0 && (
          <p className="text-xs text-amber-600 mt-1">Select at least one available day</p>
        )}
      </div>

      {/* Time range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Start Time</label>
          <Select value={startTime} onValueChange={handleStartTime}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">End Time</label>
          <Select value={endTime} onValueChange={handleEndTime}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Off-peak toggles per active day */}
      {activeDays.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Off-Peak Windows</p>
          <div className="space-y-2">
            {DAYS.filter(({ value }) => activeDays.includes(value)).map(({ label, value }) => (
              <label
                key={value}
                className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 cursor-pointer hover:bg-slate-50"
              >
                <Checkbox
                  checked={offPeakDays.includes(value)}
                  onCheckedChange={() => toggleOffPeak(value)}
                />
                <span className="text-sm text-slate-700">
                  Mark <strong>{label}</strong> as off-peak
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Pricing section */}
      <div className="space-y-5 pt-2 border-t border-slate-100">
        <p className="text-sm font-semibold text-slate-900 pt-2">Pricing</p>

        {/* Base price */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Base Price (per hour)</label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
              £
            </span>
            <Input
              type="number"
              min={0}
              step={1}
              value={basePrice || ''}
              onChange={(e) => updatePricingConfig({ basePrice: Number(e.target.value) })}
              className="pl-6"
            />
          </div>
        </div>

        {/* Off-peak discount slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Off-Peak Discount</label>
            <span className="text-sm font-semibold text-teal-600">
              Save {offPeakDiscount}% off-peak
            </span>
          </div>
          <Slider
            min={0}
            max={80}
            value={[offPeakDiscount]}
            onValueChange={(val) => {
              const v = Array.isArray(val) ? val[0] : val
              updatePricingConfig({ offPeakDiscount: v })
            }}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>80%</span>
          </div>
        </div>

        {/* Calculated off-peak price */}
        {basePrice > 0 && (
          <div className="rounded-lg bg-teal-50 border border-teal-200 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-slate-600">Off-peak price</span>
            <span className="text-lg font-bold text-teal-600">£{offPeakPrice}</span>
          </div>
        )}

        {/* Min price floor */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Minimum Price Floor</label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
              £
            </span>
            <Input
              type="number"
              min={0}
              step={1}
              value={minPrice || ''}
              onChange={(e) => updatePricingConfig({ minPrice: Number(e.target.value) })}
              className="pl-6"
            />
          </div>
          <p className="text-xs text-slate-500">
            The off-peak price will never drop below this amount
          </p>
        </div>
      </div>
    </div>
  )
}

export function getAvailabilityStepValid(pricingConfig: { basePrice?: number }, activeDays: number[]): boolean {
  return !!pricingConfig.basePrice && pricingConfig.basePrice > 0 && activeDays.length > 0
}
