'use client'

import { SlidersHorizontal } from 'lucide-react'
import { useExploreStore } from '@/store/explore-store'
import { SORT_OPTIONS, AMENITIES } from '@/lib/constants'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function FilterSheet() {
  const {
    sortBy,
    priceRange,
    capacityMin,
    amenityFilters,
    instantBookOnly,
    offPeakOnly,
    setSortBy,
    setPriceRange,
    setCapacityMin,
    toggleAmenity,
    setInstantBookOnly,
    setOffPeakOnly,
    resetFilters,
    selectedCategory,
  } = useExploreStore()

  // Count active non-default filters
  const activeCount = [
    sortBy !== 'price-asc',
    priceRange[0] > 0 || priceRange[1] < 200,
    capacityMin > 0,
    amenityFilters.length > 0,
    instantBookOnly,
    offPeakOnly,
    selectedCategory !== null,
  ].filter(Boolean).length

  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            className="relative flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            aria-label="Open filters"
          />
        }
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        <span>Filters</span>
        {activeCount > 0 && (
          <Badge className="ml-0.5 flex h-5 min-w-5 items-center justify-center bg-teal-500 text-white text-xs px-1">
            {activeCount}
          </Badge>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col overflow-y-auto sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 py-2">
          {/* Sort by */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">Sort by</h3>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                if (value !== null) setSortBy(value as string)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          {/* Price Range */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Price Range</h3>
              <span className="text-sm text-slate-500">
                £{priceRange[0]} – £{priceRange[1]}
              </span>
            </div>
            <Slider
              value={priceRange}
              min={0}
              max={200}
              step={5}
              onValueChange={(value) => {
                const arr = value as number[]
                if (arr.length === 2) {
                  setPriceRange([arr[0], arr[1]])
                }
              }}
              aria-label="Price range"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>£0</span>
              <span>£200</span>
            </div>
          </section>

          {/* Minimum Capacity */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Minimum Capacity</h3>
              <span className="text-sm text-slate-500">
                {capacityMin > 0 ? `${capacityMin}+` : 'Any'}
              </span>
            </div>
            <Slider
              value={[capacityMin]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => {
                const arr = value as number[]
                if (arr.length === 1) setCapacityMin(arr[0])
              }}
              aria-label="Minimum capacity"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500">
              <span>Any</span>
              <span>100+</span>
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Amenities</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {AMENITIES.map((amenity) => {
                const checked = amenityFilters.includes(amenity)
                return (
                  <label
                    key={amenity}
                    className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleAmenity(amenity)}
                      aria-label={amenity}
                    />
                    <span>{amenity}</span>
                  </label>
                )
              })}
            </div>
          </section>

          {/* Instant Book Only */}
          <section>
            <label className="flex cursor-pointer items-center gap-3">
              <Checkbox
                checked={instantBookOnly}
                onCheckedChange={(checked) => setInstantBookOnly(Boolean(checked))}
                aria-label="Instant Book Only"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Instant Book Only</p>
                <p className="text-xs text-slate-500">Skip the request — book immediately</p>
              </div>
            </label>
          </section>

          {/* Off-Peak Only */}
          <section>
            <label className="flex cursor-pointer items-center gap-3">
              <Checkbox
                checked={offPeakOnly}
                onCheckedChange={(checked) => setOffPeakOnly(Boolean(checked))}
                aria-label="Off-Peak Only"
              />
              <div>
                <p className="text-sm font-medium text-slate-900">Off-Peak Only</p>
                <p className="text-xs text-slate-500">Show spaces with discounted off-peak pricing</p>
              </div>
            </label>
          </section>
        </div>

        <SheetFooter className="flex-row gap-2">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={resetFilters}
          >
            Clear All
          </Button>
          <SheetClose
            render={
              <Button className="flex-1 bg-teal-500 text-white hover:bg-teal-600" />
            }
          >
            Apply
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
