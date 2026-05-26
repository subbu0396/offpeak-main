import { create } from "zustand"
import type { TimeSlot, PricingRule } from "@/types"

interface BookingState {
  selectedDate: Date | null
  selectedTimeSlot: TimeSlot | null
  promoCode: string
  promoValidation: { valid: boolean; discount: number; message: string } | null
  checkoutStep: number // 1-4 for multi-step checkout
  isBookingSheetOpen: boolean
  isCheckoutOpen: boolean
  isConfirmationOpen: boolean
  lastBookingId: string | null
  // Actions
  setSelectedDate: (date: Date | null) => void
  setSelectedTimeSlot: (slot: TimeSlot | null) => void
  setPromoCode: (code: string) => void
  setPromoValidation: (validation: { valid: boolean; discount: number; message: string } | null) => void
  setCheckoutStep: (step: number) => void
  nextCheckoutStep: () => void
  prevCheckoutStep: () => void
  openBookingSheet: () => void
  closeBookingSheet: () => void
  openCheckout: () => void
  closeCheckout: () => void
  openConfirmation: (bookingId: string) => void
  closeConfirmation: () => void
  calculateTotalPrice: (pricingRule: PricingRule) => number
  resetBooking: () => void
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedDate: null,
  selectedTimeSlot: null,
  promoCode: "",
  promoValidation: null,
  checkoutStep: 1,
  isBookingSheetOpen: false,
  isCheckoutOpen: false,
  isConfirmationOpen: false,
  lastBookingId: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTimeSlot: (slot) => set({ selectedTimeSlot: slot }),
  setPromoCode: (code) => set({ promoCode: code }),
  setPromoValidation: (validation) => set({ promoValidation: validation }),
  setCheckoutStep: (step) => set({ checkoutStep: step }),
  nextCheckoutStep: () => set((state) => ({ checkoutStep: Math.min(state.checkoutStep + 1, 4) })),
  prevCheckoutStep: () => set((state) => ({ checkoutStep: Math.max(state.checkoutStep - 1, 1) })),
  openBookingSheet: () => set({ isBookingSheetOpen: true }),
  closeBookingSheet: () => set({ isBookingSheetOpen: false }),
  openCheckout: () => set({ isCheckoutOpen: true, checkoutStep: 1 }),
  closeCheckout: () => set({ isCheckoutOpen: false, checkoutStep: 1 }),
  openConfirmation: (bookingId) => set({ isConfirmationOpen: true, lastBookingId: bookingId }),
  closeConfirmation: () => set({ isConfirmationOpen: false, lastBookingId: null }),
  calculateTotalPrice: (pricingRule) => {
    const { selectedTimeSlot, promoValidation } = get()
    if (!selectedTimeSlot) return pricingRule.basePrice

    let price = pricingRule.basePrice

    // Apply off-peak discount if the slot is off-peak
    if (selectedTimeSlot.isOffPeak) {
      price = price * (1 - pricingRule.offPeakDiscount / 100)
    }

    // Apply promo discount if valid
    if (promoValidation?.valid) {
      price = price * (1 - promoValidation.discount / 100)
    }

    // Enforce minimum price
    if (pricingRule.minPrice && price < pricingRule.minPrice) {
      price = pricingRule.minPrice
    }

    return Math.round(price * 100) / 100
  },
  resetBooking: () => set({
    selectedDate: null,
    selectedTimeSlot: null,
    promoCode: "",
    promoValidation: null,
    checkoutStep: 1,
    isBookingSheetOpen: false,
    isCheckoutOpen: false,
    isConfirmationOpen: false,
    lastBookingId: null,
  }),
}))
