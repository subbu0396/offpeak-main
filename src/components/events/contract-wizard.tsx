'use client'

import { useState } from 'react'
import { StepIndicator } from '@/components/common/step-indicator'
import { ContractStepHold } from './contract-step-hold'
import { ContractStepDetails } from './contract-step-details'
import { ContractStepSign } from './contract-step-sign'
import { ContractStepPayment } from './contract-step-payment'

export interface ContractFormData {
  spaceId: string
  eventDate: string
  eventType: string
  guestCount: number
  specialRequirements: string
  cateringOptions: string[]
  agreed: boolean
  signed: boolean
}

const STEPS = [
  { label: 'Request Hold' },
  { label: 'Contract Details' },
  { label: 'E-Sign' },
  { label: 'Deposit Payment' },
]

interface ContractWizardProps {
  preSelectedSpaceId?: string
}

export function ContractWizard({ preSelectedSpaceId }: ContractWizardProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ContractFormData>({
    spaceId: preSelectedSpaceId ?? '',
    eventDate: '',
    eventType: '',
    guestCount: 0,
    specialRequirements: '',
    cateringOptions: [],
    agreed: false,
    signed: false,
  })

  function updateForm(partial: Partial<ContractFormData>) {
    setFormData((prev) => ({ ...prev, ...partial }))
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Event Contract</h1>

      <StepIndicator steps={STEPS} currentStep={step} />

      {step === 1 && (
        <ContractStepHold
          formData={formData}
          onUpdate={updateForm}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <ContractStepDetails
          formData={formData}
          onUpdate={updateForm}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <ContractStepSign
          formData={formData}
          onUpdate={updateForm}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <ContractStepPayment
          formData={formData}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  )
}
