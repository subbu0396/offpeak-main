import { create } from "zustand"
import type { Bid, BidStatus } from "@/types"

interface BidState {
  proposedPrice: number
  message: string
  isBidSheetOpen: boolean
  submittedBids: Bid[]
  // Actions
  setProposedPrice: (price: number) => void
  setMessage: (msg: string) => void
  openBidSheet: () => void
  closeBidSheet: () => void
  resetBid: () => void
  addBid: (bid: Bid) => void
  updateBidStatus: (id: string, status: BidStatus, counterPrice?: number) => void
}

export const useBidStore = create<BidState>((set) => ({
  proposedPrice: 0,
  message: "",
  isBidSheetOpen: false,
  submittedBids: [],
  setProposedPrice: (price) => set({ proposedPrice: price }),
  setMessage: (msg) => set({ message: msg }),
  openBidSheet: () => set({ isBidSheetOpen: true }),
  closeBidSheet: () => set({ isBidSheetOpen: false }),
  resetBid: () => set({ proposedPrice: 0, message: "", isBidSheetOpen: false }),
  addBid: (bid) => set((state) => ({ submittedBids: [...state.submittedBids, bid] })),
  updateBidStatus: (id, status, counterPrice) =>
    set((state) => ({
      submittedBids: state.submittedBids.map((b) =>
        b.id === id ? { ...b, status, ...(counterPrice !== undefined ? { counterPrice } : {}) } : b
      ),
    })),
}))
