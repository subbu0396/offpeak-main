'use client'

import { useOwnerStore } from '@/store/owner-store'
import { AMENITIES } from '@/lib/constants'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

export function ListingStepAmenities() {
  const { draftListing, updateDraft } = useOwnerStore()
  const selected: string[] = draftListing.amenities ?? []

  function toggle(amenity: string) {
    if (selected.includes(amenity)) {
      updateDraft({ amenities: selected.filter((a) => a !== amenity) })
    } else {
      updateDraft({ amenities: [...selected, amenity] })
    }
  }

  function selectAll() {
    updateDraft({ amenities: [...AMENITIES] })
  }

  function clearAll() {
    updateDraft({ amenities: [] })
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Amenities</h2>
        <p className="text-sm text-slate-500 mt-1">
          Select all the amenities available at your space.
        </p>
        <p className="text-sm text-slate-500 mt-0.5">
          Select amenities your space offers (optional)
        </p>
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">
          {selected.length} amenities selected
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Amenities grid: 2 columns mobile, 3 desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {AMENITIES.map((amenity) => {
          const isChecked = selected.includes(amenity)
          return (
            <label
              key={amenity}
              className="flex items-center gap-2.5 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:border-teal-300 hover:bg-teal-50/50 transition-colors"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggle(amenity)}
              />
              <span className="text-sm text-slate-700 select-none">{amenity}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export function getAmenitiesStepValid(): boolean {
  // No minimum required for amenities
  return true
}
