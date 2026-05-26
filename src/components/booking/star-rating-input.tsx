'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingInputProps {
  value: number
  onChange: (rating: number) => void
  size?: number
}

export function StarRatingInput({ value, onChange, size = 28 }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered > 0 ? hovered : value)
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            aria-pressed={star === value}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
          >
            <Star
              style={{ width: size, height: size }}
              className={cn(
                'transition-colors',
                filled
                  ? 'fill-teal-500 text-teal-500'
                  : 'fill-none text-slate-300'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
