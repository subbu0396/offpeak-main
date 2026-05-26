'use client'

import { useState, useMemo } from 'react'
import { VenueSearchFilters } from '@/components/events/venue-search-filters'
import { VenueShortlist } from '@/components/events/venue-shortlist'
import { SpaceCard } from '@/components/discovery/space-card'
import { getEventVenues } from '@/lib/mock-data-events'

export default function DiscoverVenuesPage() {
  const [capacityRange, setCapacityRange] = useState('')
  const [amenityFilters, setAmenityFilters] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(300)

  const allVenues = useMemo(() => getEventVenues(), [])

  const filtered = useMemo(() => {
    return allVenues.filter((space) => {
      // Capacity filter
      if (capacityRange) {
        if (capacityRange === '10-25' && !(space.capacity >= 10 && space.capacity <= 25)) return false
        if (capacityRange === '25-50' && !(space.capacity > 25 && space.capacity <= 50)) return false
        if (capacityRange === '50-100' && !(space.capacity > 50 && space.capacity <= 100)) return false
        if (capacityRange === '100+' && space.capacity <= 100) return false
      }

      // Amenity filter — space must have all selected amenities
      if (amenityFilters.length > 0) {
        const spaceAmenities = space.amenities.map((a) => a.toLowerCase())
        const hasAll = amenityFilters.every((f) =>
          spaceAmenities.some((a) => a.includes(f.toLowerCase()))
        )
        if (!hasAll) return false
      }

      return true
    })
  }, [allVenues, capacityRange, amenityFilters])

  return (
    <div className="p-6 space-y-4 max-w-7xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Discover Venues</h1>

      <VenueSearchFilters
        capacityRange={capacityRange}
        onCapacityChange={setCapacityRange}
        amenityFilters={amenityFilters}
        onAmenityChange={setAmenityFilters}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Venue results — 60% */}
        <div className="flex-1 lg:w-[60%]">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-base font-medium">No venues match your filters.</p>
              <p className="text-sm mt-1">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-3">
                {filtered.length} venue{filtered.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((space) => (
                  <SpaceCard key={space.id} space={space} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Shortlist sidebar — 40% */}
        <div className="lg:w-[40%] lg:max-w-sm xl:max-w-md">
          <VenueShortlist />
        </div>
      </div>
    </div>
  )
}
