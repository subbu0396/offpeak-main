import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SpaceState {
  selectedSpaceId: string | null
  isDetailSheetOpen: boolean
  shortlistedIds: string[]
  // Actions
  selectSpace: (id: string) => void
  closeDetail: () => void
  toggleShortlist: (id: string) => void
  isShortlisted: (id: string) => boolean
  clearShortlist: () => void
}

export const useSpaceStore = create<SpaceState>()(
  persist(
    (set, get) => ({
      selectedSpaceId: null,
      isDetailSheetOpen: false,
      shortlistedIds: [],
      selectSpace: (id) => set({ selectedSpaceId: id, isDetailSheetOpen: true }),
      closeDetail: () => set({ selectedSpaceId: null, isDetailSheetOpen: false }),
      toggleShortlist: (id) => set((state) => ({
        shortlistedIds: state.shortlistedIds.includes(id)
          ? state.shortlistedIds.filter((sid) => sid !== id)
          : [...state.shortlistedIds, id],
      })),
      isShortlisted: (id) => get().shortlistedIds.includes(id),
      clearShortlist: () => set({ shortlistedIds: [] }),
    }),
    {
      name: "offpeak-space-store",
      partialize: (state) => ({ shortlistedIds: state.shortlistedIds }),
    }
  )
)
