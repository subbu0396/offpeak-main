'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/store/auth-store'
import { cn } from '@/lib/utils'
import type { ContractFormData } from './contract-wizard'

interface ContractStepSignProps {
  formData: ContractFormData
  onUpdate: (partial: Partial<ContractFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function ContractStepSign({ formData, onUpdate, onNext, onBack }: ContractStepSignProps) {
  const { currentUser } = useAuthStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3 — E-Sign Contract</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Terms scroll area */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 h-48 overflow-y-auto text-xs text-slate-600 leading-relaxed space-y-3">
          <p className="font-semibold text-slate-800 text-sm">Terms & Conditions</p>
          <p>
            This Event Contract (&quot;Contract&quot;) is entered into between the Event Organiser (&quot;Client&quot;)
            and the Venue Operator (&quot;Venue&quot;) facilitated through the OffPeak platform.
          </p>
          <p>
            <strong>1. Booking Confirmation.</strong> This Contract becomes binding upon receipt of the
            deposit payment as set out in Section 4. The Venue agrees to reserve the specified space
            exclusively for the Client on the agreed date.
          </p>
          <p>
            <strong>2. Event Requirements.</strong> The Client shall ensure that the number of guests
            does not exceed the venue&apos;s stated capacity. Any special requirements communicated at
            the time of booking are subject to availability.
          </p>
          <p>
            <strong>3. Cancellation.</strong> Cancellation terms are as set out in the booking summary.
            OffPeak acts solely as an intermediary and accepts no liability for cancellation by either party.
          </p>
          <p>
            <strong>4. Deposit &amp; Payment.</strong> A deposit of 30% of the total contract value is
            due within 48 hours of signing. The balance is due 7 days before the event date.
          </p>
          <p>
            <strong>5. Force Majeure.</strong> Neither party shall be liable for failure to perform
            their obligations where such failure results from circumstances beyond reasonable control.
          </p>
          <p>
            <strong>6. Governing Law.</strong> This Contract is governed by the laws of England and
            Wales and the parties submit to the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </div>

        {/* Agree checkbox */}
        <label className="flex items-start gap-2 cursor-pointer">
          <Checkbox
            checked={formData.agreed}
            onCheckedChange={(checked) => onUpdate({ agreed: checked === true })}
            className="mt-0.5"
          />
          <span className="text-sm text-slate-700">
            I have read and agree to the Terms &amp; Conditions above.
          </span>
        </label>

        {/* Signature area */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Signature</p>
          <button
            onClick={() => onUpdate({ signed: true })}
            className={cn(
              'w-full h-20 rounded-lg border-2 border-dashed transition-colors flex items-center justify-center',
              formData.signed
                ? 'border-teal-400 bg-teal-50'
                : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
            )}
            aria-label="Click to sign"
          >
            {formData.signed ? (
              <span
                className="text-2xl text-teal-700"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              >
                {currentUser.name} — {new Date().toLocaleDateString('en-GB')}
              </span>
            ) : (
              <span className="text-sm text-slate-500">Click to sign</span>
            )}
          </button>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!formData.agreed || !formData.signed}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
          >
            Sign Contract
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
