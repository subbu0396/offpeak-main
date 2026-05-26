'use client'

import { useEffect } from 'react'
import { useQueryState, parseAsString } from 'nuqs'
import { useExploreStore } from '@/store/explore-store'
import { getAllSpaces, getPricingForSpace, getAvailabilityForSpace } from '@/lib/mock-data'
import { SORT_OPTIONS } from '@/lib/constants'
import { SearchX } from 'lucide-react'
import { CategoryPills } from '@/components/discovery/category-pills'
import { ViewToggle } from '@/components/discovery/view-toggle'
import { FilterSheet } from '@/components/discovery/filter-sheet'
import { ResultsCount } from '@/components/discovery/results-count'
import { SpaceCard } from '@/components/discovery/space-card'
import { MapView } from '@/components/discovery/map-view'
import { SpaceDetailSheet } from '@/components/detail/space-detail-sheet'
import { EmptyState } from '@/components/common/empty-state'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Category } from '@/types'

function SortSelect() {
  const sortBy = useExploreStore((s) => s.sortBy)
  const setSortBy = useExploreStore((s) => s.setSortBy)

  return (
    <Select
      value={sortBy}
      onValueChange={(value) => {
        if (value !== null) setSortBy(value)
      }}
    >
      <SelectTrigger className="w-auto text-sm">
        <SelectValue placeholder="Sort..." />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function ExplorePage() {
  const {
    selectedCategory,
    selectedCity,
    priceRange,
    capacityMin,
    amenityFilters,
    instantBookOnly,
    offPeakOnly,
    sortBy,
    viewMode,
    searchQuery,
    setCategory,
    setCity,
    setSearchQuery,
    resetFilters,
  } = useExploreStore()

  // URL sync — category
  const [categoryParam, setCategoryParam] = useQueryState('category', parseAsString)
  // URL sync — city
  const [cityParam, setCityParam] = useQueryState('city', parseAsString)
  // URL sync — search query
  const [searchParam] = useQueryState('q', parseAsString)

  // On mount: read URL params into store
  useEffect(() => {
    if (categoryParam) setCategory(categoryParam as Category)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (cityParam) setCity(cityParam)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (searchParam) setSearchQuery(searchParam)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When store changes: update URL
  useEffect(() => {
    setCategoryParam(selectedCategory ?? null)
  }, [selectedCategory, setCategoryParam])

  useEffect(() => {
    setCityParam(selectedCity ?? null)
  }, [selectedCity, setCityParam])

  // --- Filtering ---
  const allSpaces = getAllSpaces()

  // Use URL params directly for initial render (synchronous), with store as fallback
  const activeCategory = categoryParam || selectedCategory
  const activeCity = cityParam || selectedCity

  let filteredSpaces = allSpaces.filter((space) => {
    // Category filter
    if (activeCategory && space.category !== activeCategory) return false

    // City filter
    if (
      activeCity &&
      space.location.city.toLowerCase() !== activeCity.toLowerCase()
    ) {
      return false
    }

    // Price range filter
    const pricing = getPricingForSpace(space.id)
    if (pricing) {
      if (
        pricing.basePrice < priceRange[0] ||
        pricing.basePrice > priceRange[1]
      ) {
        return false
      }
    }

    // Capacity filter
    if (capacityMin > 0 && space.capacity < capacityMin) return false

    // Amenity filters — space must have ALL selected amenities
    if (
      amenityFilters.length > 0 &&
      !amenityFilters.every((a) => space.amenities.includes(a))
    ) {
      return false
    }

    // Instant book filter
    if (instantBookOnly && !space.instantBook) return false

    // Off-peak only filter
    if (offPeakOnly) {
      const availability = getAvailabilityForSpace(space.id)
      const hasOffPeak = availability.some((a) => a.isOffPeak && a.isAvailable)
      if (!hasOffPeak) return false
    }

    return true
  })

  // Search query filter — use searchParam directly (synchronous) with store fallback
  const activeSearch = searchParam || searchQuery
  if (activeSearch) {
    filteredSpaces = filteredSpaces.filter((s) =>
      s.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
      s.location.city.toLowerCase().includes(activeSearch.toLowerCase())
    )
  }

  // --- Sorting ---
  const sortedSpaces = [...filteredSpaces].sort((a, b) => {
    if (sortBy === 'price-asc') {
      const pA = getPricingForSpace(a.id)?.basePrice ?? 0
      const pB = getPricingForSpace(b.id)?.basePrice ?? 0
      return pA - pB
    }
    if (sortBy === 'price-desc') {
      const pA = getPricingForSpace(a.id)?.basePrice ?? 0
      const pB = getPricingForSpace(b.id)?.basePrice ?? 0
      return pB - pA
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating
    }
    if (sortBy === 'newest') {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }
    return 0
  })

  return (
    <>
      {/* Mobile layout (< lg) */}
      <div className="flex flex-col h-[calc(100vh-8rem)] lg:hidden">
        <div className="p-4 space-y-3 border-b">
          <CategoryPills />
          <div className="flex items-center justify-between">
            <ViewToggle />
            <FilterSheet />
          </div>
          <ResultsCount count={sortedSpaces.length} />
        </div>
        {viewMode === 'list' ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {sortedSpaces.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <EmptyState
                  icon={SearchX}
                  title="No spaces found"
                  description="Try adjusting your filters or searching in a different area."
                  actionLabel="Clear Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : (
              sortedSpaces.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))
            )}
          </div>
        ) : (
          <div className="flex-1">
            <MapView spaces={sortedSpaces} />
          </div>
        )}
      </div>

      {/* Desktop layout (lg+) */}
      <div className="hidden lg:flex h-[calc(100vh-4rem)]">
        {/* Left panel — 40% */}
        <div className="w-2/5 border-r flex flex-col">
          <div className="p-4 space-y-3 border-b">
            <CategoryPills />
            <div className="flex items-center justify-between">
              <ResultsCount count={sortedSpaces.length} />
              <div className="flex items-center gap-2">
                <SortSelect />
                <FilterSheet />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {sortedSpaces.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <EmptyState
                  icon={SearchX}
                  title="No spaces found"
                  description="Try adjusting your filters or searching in a different area."
                  actionLabel="Clear Filters"
                  onAction={resetFilters}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {sortedSpaces.map((space) => (
                  <SpaceCard key={space.id} space={space} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — 60% */}
        <div className="w-3/5">
          <MapView spaces={sortedSpaces} />
        </div>
      </div>

      <SpaceDetailSheet />
    </>
  )
}
