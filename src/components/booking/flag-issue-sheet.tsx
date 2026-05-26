'use client'

import { useState } from 'react'
import { Camera, CheckCircle, Info } from 'lucide-react'
import type { FlagIssueCategory, FlagSeverity } from '@/types'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FlagIssueSheetProps {
  spaceId: string
  bookingId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const FLAG_CATEGORIES: { value: FlagIssueCategory; label: string }[] = [
  { value: 'CLEANLINESS', label: 'Cleanliness' },
  { value: 'SAFETY', label: 'Safety' },
  { value: 'MISREPRESENTATION', label: 'Misrepresentation' },
  { value: 'NOISE', label: 'Noise' },
  { value: 'ACCESS', label: 'Access' },
  { value: 'OTHER', label: 'Other' },
]

const SEVERITIES: { value: FlagSeverity; label: string; activeClass: string }[] = [
  { value: 'LOW', label: 'Low', activeClass: 'border-green-500 bg-green-50 text-green-700' },
  { value: 'MEDIUM', label: 'Medium', activeClass: 'border-amber-500 bg-amber-50 text-amber-700' },
  { value: 'HIGH', label: 'High', activeClass: 'border-red-500 bg-red-50 text-red-700' },
]

export function FlagIssueSheet({
  spaceId: _spaceId,
  bookingId: _bookingId,
  open,
  onOpenChange,
}: FlagIssueSheetProps) {
  const [category, setCategory] = useState<FlagIssueCategory | ''>('')
  const [severity, setSeverity] = useState<FlagSeverity>('LOW')
  const [description, setDescription] = useState('')
  const [photoAdded, setPhotoAdded] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    setSubmitted(true)
    setTimeout(() => {
      onOpenChange(false)
    }, 2000)
  }

  function handleOpenChange(value: boolean) {
    onOpenChange(value)
    if (!value) {
      setTimeout(() => {
        setCategory('')
        setSeverity('LOW')
        setDescription('')
        setPhotoAdded(false)
        setSubmitted(false)
      }, 200)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-xl">
        <SheetHeader>
          <SheetTitle>Report an Issue</SheetTitle>
        </SheetHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center px-4">
            <CheckCircle className="size-12 text-teal-500" />
            <p className="font-medium text-base">Issue reported successfully.</p>
            <p className="text-sm text-muted-foreground">
              {"We'll notify the owner."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-4 pb-4">
            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Issue category</label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as FlagIssueCategory)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  {FLAG_CATEGORIES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Severity</label>
              <div className="flex gap-2">
                {SEVERITIES.map(({ value, label, activeClass }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSeverity(value)}
                    className={[
                      'flex-1 rounded-md border px-2 py-2 text-sm font-medium transition-colors',
                      severity === value
                        ? activeClass
                        : 'border-border text-muted-foreground hover:bg-muted',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="flag-sheet-desc">
                Description
              </label>
              <Textarea
                id="flag-sheet-desc"
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-24"
              />
            </div>

            {/* Add evidence photo */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPhotoAdded((v) => !v)}
                className="gap-1.5"
              >
                <Camera className="size-4" />
                {photoAdded ? 'Evidence photo added' : 'Add Evidence Photo'}
              </Button>
            </div>

            {/* SLA info */}
            <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
              <Info className="size-4 shrink-0 mt-0.5 text-blue-500" />
              <p>
                The owner will be notified and must respond within{' '}
                <strong>48 hours</strong>.
              </p>
            </div>

            <SheetFooter>
              <Button
                onClick={handleSubmit}
                disabled={!category || !description.trim()}
                className="w-full"
              >
                Submit Report
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
