'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { PricingTimeWindow, type TimeWindowValue } from './pricing-time-window'
import { getPricingForSpace } from '@/lib/mock-data'
import type { Space, PricingRule } from '@/types'

interface PricingEngineProps {
  space: Space
}

function buildInitialState(rule: PricingRule | undefined) {
  return {
    basePrice: rule?.basePrice ?? 10,
    occupancyThreshold: rule?.occupancyThreshold ?? 80,
    occupancyDiscount: rule?.occupancyDiscount ?? 20,
    autoApply: rule?.autoApply ?? false,
    minPrice: rule?.minPrice ?? 5,
    timeWindows: [] as TimeWindowValue[],
  }
}

export function PricingEngine({ space }: PricingEngineProps) {
  const original = getPricingForSpace(space.id)
  const initialState = buildInitialState(original)

  const [basePrice, setBasePrice] = useState(String(initialState.basePrice))
  const [occupancyThreshold, setOccupancyThreshold] = useState(initialState.occupancyThreshold)
  const [occupancyDiscount, setOccupancyDiscount] = useState(initialState.occupancyDiscount)
  const [autoApply, setAutoApply] = useState(initialState.autoApply)
  const [minPrice, setMinPrice] = useState(String(initialState.minPrice))
  const [timeWindows, setTimeWindows] = useState<TimeWindowValue[]>(initialState.timeWindows)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleReset() {
    const s = buildInitialState(original)
    setBasePrice(String(s.basePrice))
    setOccupancyThreshold(s.occupancyThreshold)
    setOccupancyDiscount(s.occupancyDiscount)
    setAutoApply(s.autoApply)
    setMinPrice(String(s.minPrice))
    setTimeWindows(s.timeWindows)
  }

  function addWindow() {
    setTimeWindows((prev) => [
      ...prev,
      { days: [1, 2, 3, 4, 5], startTime: '14:00', endTime: '17:00', discount: 20 },
    ])
  }

  function updateWindow(index: number, val: TimeWindowValue) {
    setTimeWindows((prev) => prev.map((w, i) => (i === index ? val : w)))
  }

  function removeWindow(index: number) {
    setTimeWindows((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Pricing Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Base price */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Base Price</label>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-slate-500">£</span>
            <Input
              type="number"
              min={0}
              step={0.5}
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-28"
              aria-label="Base price"
            />
            <span className="text-xs text-muted-foreground">per hour</span>
          </div>
        </div>

        <Separator />

        {/* Off-peak time windows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700">Off-Peak Time Windows</label>
            <Button type="button" variant="outline" size="sm" onClick={addWindow}>
              Add Time Window
            </Button>
          </div>
          {timeWindows.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No windows configured. Add windows to define off-peak periods.
            </p>
          )}
          <div className="space-y-2">
            {timeWindows.map((w, i) => (
              <PricingTimeWindow
                key={i}
                index={i}
                value={w}
                onChange={(val) => updateWindow(i, val)}
                onRemove={() => removeWindow(i)}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Occupancy rules */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-slate-700">Occupancy Rules</label>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Occupancy threshold</span>
              <span className="font-medium text-slate-700">{occupancyThreshold}%</span>
            </div>
            <Slider
              value={[occupancyThreshold]}
              min={0}
              max={100}
              onValueChange={(v) => {
                const val = Array.isArray(v) ? v[0] : v
                setOccupancyThreshold(val as number)
              }}
              aria-label="Occupancy threshold"
            />
            <p className="text-xs text-muted-foreground">
              Apply discount when occupancy falls below this threshold.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Occupancy discount</span>
              <span className="font-medium text-slate-700">{occupancyDiscount}%</span>
            </div>
            <Slider
              value={[occupancyDiscount]}
              min={0}
              max={50}
              onValueChange={(v) => {
                const val = Array.isArray(v) ? v[0] : v
                setOccupancyDiscount(val as number)
              }}
              aria-label="Occupancy discount"
            />
          </div>
        </div>

        <Separator />

        {/* Auto-apply */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-700">Auto-Apply Discounts</p>
            <p className="text-xs text-muted-foreground">
              Automatically apply off-peak rates without manual confirmation.
            </p>
          </div>
          <Toggle
            pressed={autoApply}
            onPressedChange={setAutoApply}
            variant="outline"
            size="sm"
            aria-label="Toggle auto-apply"
          >
            {autoApply ? 'On' : 'Off'}
          </Toggle>
        </div>

        <Separator />

        {/* Min price floor */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Minimum Price Floor</label>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-slate-500">£</span>
            <Input
              type="number"
              min={0}
              step={0.5}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28"
              aria-label="Minimum price floor"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Discounts will never reduce the price below this floor.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button onClick={handleSave}>
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {saved && (
          <p className="text-xs text-green-600 font-medium">
            Pricing configuration saved successfully.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
