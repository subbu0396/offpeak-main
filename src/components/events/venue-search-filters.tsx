'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const CAPACITY_RANGES = [
  { value: '10-25', label: '10–25 guests' },
  { value: '25-50', label: '25–50 guests' },
  { value: '50-100', label: '50–100 guests' },
  { value: '100+', label: '100+ guests' },
]

const KEY_AMENITIES = ['Projector', 'Sound System', 'Catering', 'Kitchen', 'Outdoor Area']

interface VenueSearchFiltersProps {
  capacityRange: string
  onCapacityChange: (value: string) => void
  amenityFilters: string[]
  onAmenityChange: (value: string[]) => void
  maxPrice: number
  onMaxPriceChange: (value: number) => void
}

export function VenueSearchFilters({
  capacityRange,
  onCapacityChange,
  amenityFilters,
  onAmenityChange,
  maxPrice,
  onMaxPriceChange,
}: VenueSearchFiltersProps) {
  function toggleAmenity(amenity: string) {
    if (amenityFilters.includes(amenity)) {
      onAmenityChange(amenityFilters.filter((a) => a !== amenity))
    } else {
      onAmenityChange([...amenityFilters, amenity])
    }
  }

  function clearAll() {
    onCapacityChange('')
    onAmenityChange([])
    onMaxPriceChange(300)
  }

  const hasFilters = capacityRange || amenityFilters.length > 0 || maxPrice < 300

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
      {/* Capacity */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Capacity:</span>
        <Select value={capacityRange} onValueChange={(v) => onCapacityChange(v ?? '')}>
          <SelectTrigger className="h-8 w-36 bg-white">
            <SelectValue placeholder="Any size" />
          </SelectTrigger>
          <SelectContent>
            {CAPACITY_RANGES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amenity pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Amenities:</span>
        {KEY_AMENITIES.map((amenity) => {
          const active = amenityFilters.includes(amenity)
          return (
            <button
              key={amenity}
              onClick={() => toggleAmenity(amenity)}
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                active
                  ? 'bg-teal-500 border-teal-500 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600'
              )}
            >
              {amenity}
            </button>
          )
        })}
      </div>

      {/* Price range */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
          Max price: £{maxPrice}/hr
        </span>
        <input
          type="range"
          min={0}
          max={300}
          step={10}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-28 accent-teal-500"
          aria-label="Maximum price per hour"
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="ml-auto text-slate-500 hover:text-slate-700 gap-1"
        >
          <X className="h-3.5 w-3.5" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
