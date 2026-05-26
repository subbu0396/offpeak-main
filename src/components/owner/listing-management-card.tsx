'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { getBookingsForSpace, getRevenueForSpace } from '@/lib/mock-data-owner'
import { cn } from '@/lib/utils'
import type { Space, SpaceStatus } from '@/types'
import { CATEGORIES } from '@/lib/constants'

function getStatusBadgeClass(status: SpaceStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-500/10 text-green-700 border-green-500/20'
    case 'DRAFT':
      return 'bg-amber-500/10 text-amber-700 border-amber-500/20'
    case 'SUSPENDED':
      return 'bg-red-500/10 text-red-700 border-red-500/20'
    case 'ARCHIVED':
      return 'bg-slate-100 text-slate-600 border-slate-200'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

interface ListingManagementCardProps {
  space: Space
}

export function ListingManagementCard({ space }: ListingManagementCardProps) {
  const [status, setStatus] = useState<SpaceStatus>(space.status)

  const bookings = getBookingsForSpace(space.id)
  const revenue = getRevenueForSpace(space.id)
  const categoryMeta = CATEGORIES.find((c) => c.value === space.category)
  const thumbnail = space.photos[0]

  function toggleStatus() {
    setStatus((prev) => (prev === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'))
  }

  return (
    <Card>
      <CardContent className="flex gap-4 items-start">
        {/* Thumbnail */}
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt={space.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-200" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug truncate">
              {space.title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {categoryMeta && (
              <Badge variant="outline" className="text-xs">
                {categoryMeta.label}
              </Badge>
            )}
            <Badge className={`text-xs ${getStatusBadgeClass(status)}`}>
              {status}
            </Badge>
          </div>

          <div className="flex gap-4 text-xs text-slate-500 mb-3">
            <span>{bookings.length} bookings</span>
            <span>£{revenue.toFixed(2)} revenue</span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/owner/listings/${space.id}/edit`}
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
            >
              Edit
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleStatus}
            >
              {status === 'ACTIVE' ? 'Suspend' : 'Activate'}
            </Button>

            <Link
              href={`/spaces/${space.id}`}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              View
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
