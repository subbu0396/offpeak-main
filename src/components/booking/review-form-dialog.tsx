'use client'

import { useState } from 'react'
import { Camera, CheckCircle, Flag } from 'lucide-react'
import { SuccessState } from '@/components/common/success-state'
import type { FlagIssueCategory, FlagSeverity } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StarRatingInput } from '@/components/booking/star-rating-input'

interface ReviewFormDialogProps {
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

const SEVERITIES: { value: FlagSeverity; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

export function ReviewFormDialog({
  spaceId: _spaceId,
  bookingId: _bookingId,
  open,
  onOpenChange,
}: ReviewFormDialogProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [photoAdded, setPhotoAdded] = useState(false)
  const [flagEnabled, setFlagEnabled] = useState(false)
  const [flagCategory, setFlagCategory] = useState<FlagIssueCategory | ''>('')
  const [flagSeverity, setFlagSeverity] = useState<FlagSeverity>('LOW')
  const [flagDescription, setFlagDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = rating > 0 && comment.length >= 10

  function handleSubmit() {
    if (!canSubmit) return
    setSubmitted(true)
    setTimeout(() => {
      onOpenChange(false)
    }, 2000)
  }

  function handleOpenChange(value: boolean) {
    onOpenChange(value)
    if (!value) {
      // reset on close
      setTimeout(() => {
        setRating(0)
        setComment('')
        setPhotoAdded(false)
        setFlagEnabled(false)
        setFlagCategory('')
        setFlagSeverity('LOW')
        setFlagDescription('')
        setSubmitted(false)
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <SuccessState
            icon={CheckCircle}
            title="Review submitted!"
            message="Thank you for your feedback."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {/* Star rating */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Your rating</label>
              <StarRatingInput value={rating} onChange={setRating} />
              {rating === 0 && (
                <p className="text-xs text-muted-foreground">Click a star to rate</p>
              )}
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="review-comment">
                Your review
              </label>
              <Textarea
                id="review-comment"
                placeholder="Share your experience (min. 10 characters)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-24"
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length} chars{comment.length < 10 ? ` (${10 - comment.length} more needed)` : ''}
              </p>
            </div>

            {/* Add photo */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPhotoAdded((v) => !v)}
                className="gap-1.5"
              >
                <Camera className="size-4" />
                {photoAdded ? 'Remove Photo' : 'Add Photo'}
              </Button>
              {photoAdded && (
                <Badge variant="secondary">Photo added</Badge>
              )}
            </div>

            {/* Flag issue toggle */}
            <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
              <button
                type="button"
                onClick={() => setFlagEnabled((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
              >
                <Flag className="size-4" />
                {flagEnabled ? 'Remove issue report' : 'Flag an Issue'}
              </button>

              {flagEnabled && (
                <div className="flex flex-col gap-3">
                  {/* Category */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Issue category
                    </label>
                    <Select
                      value={flagCategory}
                      onValueChange={(v) => setFlagCategory(v as FlagIssueCategory)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category..." />
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
                    <label className="text-xs font-medium text-muted-foreground">
                      Severity
                    </label>
                    <div className="flex gap-2">
                      {SEVERITIES.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFlagSeverity(value)}
                          className={[
                            'flex-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors',
                            flagSeverity === value
                              ? value === 'LOW'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : value === 'MEDIUM'
                                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                                  : 'border-red-500 bg-red-50 text-red-700'
                              : 'border-border text-muted-foreground hover:bg-muted',
                          ].join(' ')}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Issue description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground" htmlFor="flag-desc">
                      Issue description
                    </label>
                    <Textarea
                      id="flag-desc"
                      placeholder="Describe the issue..."
                      value={flagDescription}
                      onChange={(e) => setFlagDescription(e.target.value)}
                      className="min-h-16"
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full sm:w-auto"
              >
                Submit Review
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
