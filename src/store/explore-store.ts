import { create } from "zustand"
import type { Category, MapBounds } from "@/types"

interface ExploreState {
  searchQuery: string
  selectedCategory: Category | null
  selectedCity: string | null
  priceRange: [number, number]
  capacityMin: number
  amenityFilters: string[]
  instantBookOnly: boolean
  offPeakOnly: boolean
  sortBy: string
  viewMode: "map" | "list" | "split"
  mapBounds: MapBounds | null
  // Actions
  setSearchQuery: (q: string) => void
  setCategory: (c: Category | null) => void
  setCity: (city: string | null) => void
  setPriceRange: (range: [number, number]) => void
  setCapacityMin: (min: number) => void
  toggleAmenity: (amenity: string) => void
  setInstantBookOnly: (v: boolean) => void
  setOffPeakOnly: (v: boolean) => void
  setSortBy: (sort: string) => void
  setViewMode: (mode: "map" | "list" | "split") => void
  setMapBounds: (bounds: MapBounds | null) => void
  resetFilters: () => void
}

const initialFilters = {
  searchQuery: "",
  selectedCategory: null as Category | null,
  selectedCity: null as string | null,
  priceRange: [0, 200] as [number, number],
  capacityMin: 0,
  amenityFilters: [] as string[],
  instantBookOnly: false,
  offPeakOnly: false,
  sortBy: "price-asc",
  viewMode: "map" as const,
  mapBounds: null as MapBounds | null,
}

export const useExploreStore = create<ExploreState>((set) => ({
  ...initialFilters,
  setSearchQuery: (q) => set({ searchQuery: q }),
  setCategory: (c) => set({ selectedCategory: c }),
  setCity: (city) => set({ selectedCity: city }),
  setPriceRange: (range) => set({ priceRange: range }),
  setCapacityMin: (min) => set({ capacityMin: min }),
  toggleAmenity: (amenity) => set((state) => ({
    amenityFilters: state.amenityFilters.includes(amenity)
      ? state.amenityFilters.filter((a) => a !== amenity)
      : [...state.amenityFilters, amenity],
  })),
  setInstantBookOnly: (v) => set({ instantBookOnly: v }),
  setOffPeakOnly: (v) => set({ offPeakOnly: v }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setMapBounds: (bounds) => set({ mapBounds: bounds }),
  resetFilters: () => set(initialFilters),
}))
