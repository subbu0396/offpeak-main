'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StarRating } from '@/components/common/star-rating'
import { getReviewsForSpace } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface ReviewSectionProps {
  spaceId: string
}

// Simple deterministic name map for mock reviewer IDs
const REVIEWER_NAMES: Record<string, string> = {
  'reviewer-001': 'Alice T.',
  'reviewer-002': 'Ben K.',
  'reviewer-003': 'Chloe M.',
  'reviewer-004': 'David P.',
  'reviewer-005': 'Emma R.',
  'reviewer-006': 'Felix W.',
  'reviewer-007': 'Grace L.',
  'reviewer-008': 'Henry J.',
}

function getReviewerName(reviewerId: string): string {
  return REVIEWER_NAMES[reviewerId] ?? 'Anonymous'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function averageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0
  return Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
}

export function ReviewSection({ spaceId }: ReviewSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const reviews = getReviewsForSpace(spaceId)

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-slate-500">
        <MessageSquare className="h-10 w-10" />
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">No reviews yet</p>
          <p className="text-sm text-slate-500">Be the first to review this space after your booking</p>
        </div>
      </div>
    )
  }

  const avg = averageRating(reviews.map((r) => r.rating))
  const visibleReviews = showAll ? reviews : reviews.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold text-slate-900">{avg.toFixed(1)}</span>
        <div className="flex flex-col gap-1">
          <StarRating rating={avg} />
          <span className="text-sm text-slate-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {visibleReviews.map((review) => {
          const name = getReviewerName(review.reviewerId)
          return (
            <div key={review.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800 text-sm">{name}</span>
                  <span className="text-xs text-slate-500">{formatDate(review.createdAt)}</span>
                </div>
                <div className="ml-auto">
                  <StarRating rating={review.rating} />
                </div>
              </div>

              {/* Comment */}
              <p className="text-sm text-slate-700 leading-relaxed">{review.comment}</p>

              {/* Owner response */}
              {review.ownerResponse && (
                <div className={cn(
                  'ml-4 pl-3 border-l-2 border-teal-300 rounded-r-lg p-3',
                  'bg-slate-50'
                )}>
                  <p className="text-xs font-semibold text-slate-600 mb-1">Owner responded:</p>
                  <p className="text-sm text-slate-700">{review.ownerResponse}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Show more toggle */}
      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors underline-offset-2 hover:underline"
        >
          {showAll ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}
        </button>
      )}
    </div>
  )
}
