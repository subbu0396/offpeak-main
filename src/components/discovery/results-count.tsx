'use client'

import { X } from 'lucide-react'
import { useExploreStore } from '@/store/explore-store'
import { Badge } from '@/components/ui/badge'
import { CATEGORIES } from '@/lib/constants'

interface ActiveFilter {
  key: string
  label: string
  onRemove: () => void
}

interface ResultsCountProps {
  count: number
}

export function ResultsCount({ count }: ResultsCountProps) {
  const {
    selectedCategory,
    priceRange,
    capacityMin,
    amenityFilters,
    instantBookOnly,
    offPeakOnly,
    setCategory,
    setPriceRange,
    setCapacityMin,
    toggleAmenity,
    setInstantBookOnly,
    setOffPeakOnly,
    resetFilters,
  } = useExploreStore()

  const activeFilters: ActiveFilter[] = []

  if (selectedCategory) {
    const meta = CATEGORIES.find((c) => c.value === selectedCategory)
    activeFilters.push({
      key: 'category',
      label: meta?.label ?? selectedCategory,
      onRemove: () => setCategory(null),
    })
  }

  if (priceRange[0] > 0 || priceRange[1] < 200) {
    activeFilters.push({
      key: 'price',
      label: `£${priceRange[0]} – £${priceRange[1]}`,
      onRemove: () => setPriceRange([0, 200]),
    })
  }

  if (capacityMin > 0) {
    activeFilters.push({
      key: 'capacity',
      label: `${capacityMin}+ guests`,
      onRemove: () => setCapacityMin(0),
    })
  }

  for (const amenity of amenityFilters) {
    activeFilters.push({
      key: `amenity-${amenity}`,
      label: amenity,
      onRemove: () => toggleAmenity(amenity),
    })
  }

  if (instantBookOnly) {
    activeFilters.push({
      key: 'instant-book',
      label: 'Instant Book',
      onRemove: () => setInstantBookOnly(false),
    })
  }

  if (offPeakOnly) {
    activeFilters.push({
      key: 'off-peak',
      label: 'Off-Peak Only',
      onRemove: () => setOffPeakOnly(false),
    })
  }

  const hasFilters = activeFilters.length > 0

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-700">
        <span className="font-semibold text-slate-900">{count}</span>{' '}
        {count === 1 ? 'space' : 'spaces'} found
      </span>

      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          className="gap-1 bg-teal-500/10 text-teal-700 border-teal-500/20 hover:bg-teal-500/10 pr-1"
        >
          <span>{filter.label}</span>
          <button
            onClick={filter.onRemove}
            aria-label={`Remove filter: ${filter.label}`}
            className="ml-0.5 rounded-full hover:bg-teal-500/20 transition-colors p-0.5"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </Badge>
      ))}

      {hasFilters && (
        <button
          onClick={resetFilters}
          className="text-sm text-teal-600 underline-offset-2 hover:underline transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
