'use client'

import { useState } from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { StarRating } from '@/components/common/star-rating'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ReviewResponseDialogProps {
  review: {
    rating: number
    comment: string
    flaggedIssue?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReviewResponseDialog({
  review,
  open,
  onOpenChange,
}: ReviewResponseDialogProps) {
  const [response, setResponse] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (!response.trim()) return
    setSubmitted(true)
  }

  function handleOpenChange(value: boolean) {
    onOpenChange(value)
    if (!value) {
      setTimeout(() => {
        setResponse('')
        setSubmitted(false)
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Respond to Review</DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle className="size-12 text-teal-500" />
            <p className="font-medium">Response sent!</p>
            <p className="text-sm text-muted-foreground">
              Your response has been posted.
            </p>
            <Button variant="outline" onClick={() => handleOpenChange(false)} className="mt-2">
              Close
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Review content */}
            <div className="rounded-lg border border-border p-3 flex flex-col gap-2">
              <StarRating rating={review.rating} />
              <p className="text-sm text-foreground">{review.comment}</p>
            </div>

            {/* Flagged issue */}
            {review.flaggedIssue && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                <AlertTriangle className="size-4 shrink-0 mt-0.5 text-red-500" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                    Flagged Issue
                  </p>
                  <p className="text-sm text-red-800">{review.flaggedIssue}</p>
                </div>
              </div>
            )}

            {/* Response textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="owner-response">
                Your response
              </label>
              <Textarea
                id="owner-response"
                placeholder="Write your response to the guest..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-24"
              />
            </div>

            <DialogFooter>
              <Button
                onClick={handleSubmit}
                disabled={!response.trim()}
                className="w-full sm:w-auto"
              >
                Send Response
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
