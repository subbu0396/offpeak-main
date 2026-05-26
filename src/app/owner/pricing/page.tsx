'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, BarChart2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PricingEngine } from '@/components/owner/pricing-engine'
import { getSpacesForOwner } from '@/lib/mock-data-owner'
import { CATEGORIES } from '@/lib/constants'
import type { Space } from '@/types'

const OWNER_ID = 'owner-001'

function SpaceRow({ space }: { space: Space }) {
  const [expanded, setExpanded] = useState(false)
  const categoryMeta = CATEGORIES.find((c) => c.value === space.category)

  return (
    <div className="rounded-xl ring-1 ring-foreground/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 p-4 bg-card text-left hover:bg-muted/30 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-slate-900 truncate">{space.title}</p>
          <div className="flex gap-1.5 mt-0.5">
            {categoryMeta && (
              <Badge variant="outline" className="text-xs">
                {categoryMeta.label}
              </Badge>
            )}
            <Badge
              className={`text-xs ${
                space.status === 'ACTIVE'
                  ? 'bg-green-500/10 text-green-700 border-green-500/20'
                  : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
              }`}
            >
              {space.status}
            </Badge>
          </div>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <PricingEngine space={space} />
        </div>
      )}
    </div>
  )
}

export default function PricingPage() {
  const spaces = getSpacesForOwner(OWNER_ID)

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dynamic Pricing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure off-peak discounts and occupancy rules for each of your spaces.
        </p>
        <Link
          href="/owner/analytics"
          className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium mt-2"
        >
          <BarChart2 className="w-4 h-4" />
          See how your pricing affects bookings — View Analytics
        </Link>
      </div>

      {spaces.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No spaces yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create a listing first to configure pricing.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {spaces.map((space) => (
            <SpaceRow key={space.id} space={space} />
          ))}
        </div>
      )}
    </div>
  )
}
