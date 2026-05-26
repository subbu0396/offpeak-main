'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { StepIndicator } from '@/components/common/step-indicator'
import { useOwnerStore } from '@/store/owner-store'

import { ListingStepBasic, getBasicStepValid } from '@/components/owner/listing-step-basic'
import { ListingStepPhotos, getPhotosStepValid } from '@/components/owner/listing-step-photos'
import { ListingStepAmenities } from '@/components/owner/listing-step-amenities'
import { ListingStepAvailability, getAvailabilityStepValid } from '@/components/owner/listing-step-availability'
import { ListingStepReview } from '@/components/owner/listing-step-review'

const STEPS = [
  { number: 1, label: 'Basic Info' },
  { number: 2, label: 'Photos' },
  { number: 3, label: 'Amenities' },
  { number: 4, label: 'Availability' },
  { number: 5, label: 'Review' },
]

const INDICATOR_STEPS = STEPS.map((s) => ({ label: s.label }))

// Simple inline toast
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-slate-500 hover:text-white transition-colors text-xs"
      >
        ✕
      </button>
    </div>
  )
}

export function ListingWizard() {
  const {
    listingWizardStep,
    setWizardStep,
    draftListing,
    pricingConfig,
  } = useOwnerStore()
  const activeDays = useOwnerStore((s) => s.activeDays)

  const [showErrors, setShowErrors] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return getBasicStepValid(draftListing)
      case 2:
        return getPhotosStepValid(draftListing)
      case 3:
        return true // Amenities optional
      case 4:
        return getAvailabilityStepValid(pricingConfig, activeDays)
      case 5:
        return true
      default:
        return true
    }
  }

  function handleNext() {
    if (!isStepValid(listingWizardStep)) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)
    setWizardStep(Math.min(5, listingWizardStep + 1))
  }

  function handleBack() {
    setShowErrors(false)
    setWizardStep(Math.max(1, listingWizardStep - 1))
  }

  function handleSaveDraft() {
    setToast('Draft saved successfully')
    setTimeout(() => setToast(null), 3000)
  }

  function renderStep() {
    switch (listingWizardStep) {
      case 1:
        return <ListingStepBasic showErrors={showErrors} />
      case 2:
        return <ListingStepPhotos />
      case 3:
        return <ListingStepAmenities />
      case 4:
        return <ListingStepAvailability />
      case 5:
        return <ListingStepReview />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <StepIndicator steps={INDICATOR_STEPS} currentStep={listingWizardStep} />

      {/* Step content */}
      <div>{renderStep()}</div>

      {/* Navigation (hidden on step 5 which has its own publish button) */}
      {listingWizardStep < 5 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={listingWizardStep === 1}
          >
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button onClick={handleNext}>
              {listingWizardStep === 4 ? 'Review' : 'Next'}
            </Button>
          </div>
        </div>
      )}

      {listingWizardStep === 5 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button variant="ghost" onClick={handleSaveDraft}>
            Save Draft
          </Button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
