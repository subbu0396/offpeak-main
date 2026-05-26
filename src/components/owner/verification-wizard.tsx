'use client'

import { useState } from 'react'
import { IdCard, Camera, MapPin, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useOwnerStore } from '@/store/owner-store'
import { DocumentUploadCard } from '@/components/owner/document-upload-card'
import { StepIndicator } from '@/components/common/step-indicator'
import { SuccessState } from '@/components/common/success-state'

const STEPS = [
  {
    number: 1,
    label: 'Identity Verification',
    description: 'Upload a government-issued ID document (passport, driving licence, etc.)',
    icon: IdCard,
    placeholder: 'passport-scan.pdf',
  },
  {
    number: 2,
    label: 'Space Evidence',
    description: 'Upload clear photos of your space interior and exterior.',
    icon: Camera,
    placeholder: 'space-photos.zip',
  },
  {
    number: 3,
    label: 'Location Proof',
    description: 'Provide geotagged photos or documents confirming your space location.',
    icon: MapPin,
    placeholder: 'location-proof.jpg',
  },
]

const INDICATOR_STEPS = STEPS.map((s) => ({ label: s.label }))

export function VerificationWizard() {
  const { verificationStep, setVerificationStep } = useOwnerStore()

  const [uploads, setUploads] = useState<Record<number, string | null>>({
    1: null,
    2: null,
    3: null,
  })
  const [submitted, setSubmitted] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const currentStep = STEPS[verificationStep - 1]
  const isCurrentUploaded = !!uploads[verificationStep]

  function handleUpload(stepNum: number, placeholder: string) {
    setUploads((prev) => ({ ...prev, [stepNum]: placeholder }))
  }

  function handleNext() {
    if (verificationStep < 3) {
      setVerificationStep(verificationStep + 1)
    }
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <SuccessState
        icon={CheckCircle2}
        title="Submitted for Review"
        message="Your verification documents have been submitted. Our team will review them within 1–3 business days and update your status."
        className="py-12"
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <StepIndicator steps={INDICATOR_STEPS} currentStep={verificationStep} />

      {/* Current step content */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{currentStep.label}</h2>
          <p className="text-sm text-slate-500 mt-1">{currentStep.description}</p>
        </div>

        <DocumentUploadCard
          label={currentStep.label}
          description={currentStep.description}
          icon={currentStep.icon}
          isUploaded={isCurrentUploaded}
          fileName={uploads[verificationStep] ?? undefined}
          onUpload={() => handleUpload(verificationStep, currentStep.placeholder)}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={() => setVerificationStep(Math.max(1, verificationStep - 1))}
          disabled={verificationStep === 1}
        >
          Back
        </Button>

        {verificationStep < 3 ? (
          <Button onClick={handleNext} disabled={!isCurrentUploaded}>
            Next
          </Button>
        ) : (
          <Button onClick={() => setShowConfirm(true)} disabled={!isCurrentUploaded}>
            Submit for Review
          </Button>
        )}
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit for Review?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your verification documents for review? This will start the verification process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
