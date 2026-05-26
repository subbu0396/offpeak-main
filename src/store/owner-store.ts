import { create } from "zustand"
import type { Space, PricingRule, Promotion } from "@/types"

interface OwnerState {
  // Listing wizard
  listingWizardStep: number
  draftListing: Partial<Space>
  setWizardStep: (step: number) => void
  updateDraft: (partial: Partial<Space>) => void
  resetDraft: () => void

  // Verification
  verificationStep: number
  setVerificationStep: (step: number) => void

  // Pricing
  pricingConfig: Partial<PricingRule>
  updatePricingConfig: (partial: Partial<PricingRule>) => void

  // Availability scheduling
  activeDays: number[]
  offPeakDays: number[]
  scheduleStartTime: string
  scheduleEndTime: string
  setActiveDays: (days: number[]) => void
  setOffPeakDays: (days: number[]) => void
  setScheduleStartTime: (time: string) => void
  setScheduleEndTime: (time: string) => void

  // Promotion
  promotionDraft: Partial<Promotion>
  updatePromotionDraft: (partial: Partial<Promotion>) => void
  resetPromotion: () => void
  promotionWizardStep: number
  setPromotionWizardStep: (step: number) => void
}

export const useOwnerStore = create<OwnerState>()((set) => ({
  listingWizardStep: 1,
  draftListing: {},
  setWizardStep: (step) => set({ listingWizardStep: step }),
  updateDraft: (partial) => set((state) => ({ draftListing: { ...state.draftListing, ...partial } })),
  resetDraft: () => set({
    draftListing: {},
    listingWizardStep: 1,
    activeDays: [],
    offPeakDays: [],
    scheduleStartTime: "09:00",
    scheduleEndTime: "17:00",
  }),

  verificationStep: 1,
  setVerificationStep: (step) => set({ verificationStep: step }),

  pricingConfig: {},
  updatePricingConfig: (partial) => set((state) => ({ pricingConfig: { ...state.pricingConfig, ...partial } })),

  activeDays: [],
  offPeakDays: [],
  scheduleStartTime: "09:00",
  scheduleEndTime: "17:00",
  setActiveDays: (days) => set({ activeDays: days }),
  setOffPeakDays: (days) => set({ offPeakDays: days }),
  setScheduleStartTime: (time) => set({ scheduleStartTime: time }),
  setScheduleEndTime: (time) => set({ scheduleEndTime: time }),

  promotionDraft: {},
  updatePromotionDraft: (partial) => set((state) => ({ promotionDraft: { ...state.promotionDraft, ...partial } })),
  resetPromotion: () => set({ promotionDraft: {}, promotionWizardStep: 1 }),
  promotionWizardStep: 1,
  setPromotionWizardStep: (step) => set({ promotionWizardStep: step }),
}))
