'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import type { Category, NotificationPreference } from '@/types'
import { MOCK_NOTIFICATION_PREFS } from '@/lib/mock-data-events'
import { CATEGORIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'

export function NotificationPreferences() {
  const [prefs, setPrefs] = useState<NotificationPreference>({ ...MOCK_NOTIFICATION_PREFS })
  const [saved, setSaved] = useState(false)

  function toggle(field: keyof Pick<NotificationPreference, 'flashDeals' | 'priceDrops' | 'enabled'>) {
    setPrefs((p) => ({ ...p, [field]: !p[field] }))
    setSaved(false)
  }

  function toggleCategory(category: Category) {
    setPrefs((p) => {
      const has = p.newInCategory.includes(category)
      return {
        ...p,
        newInCategory: has
          ? p.newInCategory.filter((c) => c !== category)
          : [...p.newInCategory, category],
      }
    })
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-5">
      {/* Master toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm">Notifications enabled</p>
          <p className="text-xs text-muted-foreground">Master switch for all deal alerts</p>
        </div>
        <ToggleSwitch checked={prefs.enabled} onChange={() => toggle('enabled')} />
      </div>

      <div className={prefs.enabled ? '' : 'opacity-50 pointer-events-none'}>
        {/* Flash deals */}
        <div className="flex items-center justify-between py-3 border-t border-border">
          <div>
            <p className="font-medium text-sm">Flash Deals</p>
            <p className="text-xs text-muted-foreground">Time-limited offers near you</p>
          </div>
          <ToggleSwitch checked={prefs.flashDeals} onChange={() => toggle('flashDeals')} />
        </div>

        {/* Price drops */}
        <div className="flex items-center justify-between py-3 border-t border-border">
          <div>
            <p className="font-medium text-sm">Price Drops</p>
            <p className="text-xs text-muted-foreground">When a saved space drops in price</p>
          </div>
          <ToggleSwitch checked={prefs.priceDrops} onChange={() => toggle('priceDrops')} />
        </div>

        {/* Category filter */}
        <div className="py-3 border-t border-border flex flex-col gap-2">
          <p className="font-medium text-sm">Watch categories</p>
          <p className="text-xs text-muted-foreground">Get alerts for new deals in these categories</p>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {CATEGORIES.map(({ value, label }) => {
              const checked = prefs.newInCategory.includes(value)
              return (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleCategory(value)}
                  />
                  {label}
                </label>
              )
            })}
          </div>
        </div>

        {/* Max distance */}
        <div className="py-3 border-t border-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">Max distance</p>
            <span className="text-sm font-semibold text-teal-600">
              {prefs.maxDistanceKm} km
            </span>
          </div>
          <Slider
            min={1}
            max={50}
            value={[prefs.maxDistanceKm]}
            onValueChange={(val) => {
              const distance = Array.isArray(val) ? val[0] : val
              setPrefs((p) => ({ ...p, maxDistanceKm: distance as number }))
              setSaved(false)
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} className="w-full sm:w-auto">
          Save Preferences
        </Button>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm text-teal-600">
            <CheckCircle className="size-4" />
            Saved!
          </div>
        )}
      </div>
    </div>
  )
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
        checked ? 'bg-teal-500' : 'bg-slate-200',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none inline-block size-5 rounded-full bg-white shadow ring-0 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  )
}
