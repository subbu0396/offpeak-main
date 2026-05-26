'use client'

import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { buttonVariants } from '@/components/ui/button'
import { ListingManagementCard } from '@/components/owner/listing-management-card'
import { getSpacesForOwner } from '@/lib/mock-data-owner'
import { cn } from '@/lib/utils'
import type { SpaceStatus } from '@/types'

const OWNER_ID = 'owner-001'

const TAB_FILTERS: { value: string; label: string; status?: SpaceStatus }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active', status: 'ACTIVE' },
  { value: 'draft', label: 'Draft', status: 'DRAFT' },
  { value: 'suspended', label: 'Suspended', status: 'SUSPENDED' },
]

export default function ListingsPage() {
  const spaces = getSpacesForOwner(OWNER_ID)

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Listings</h1>
        <Link href="/owner/listings/new" className={cn(buttonVariants())}>
          <PlusCircle className="h-4 w-4" />
          Create New Listing
        </Link>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          {TAB_FILTERS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              {' '}
              <span className="text-xs opacity-60">
                ({tab.status ? spaces.filter((s) => s.status === tab.status).length : spaces.length})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_FILTERS.map((tab) => {
          const filtered = tab.status
            ? spaces.filter((s) => s.status === tab.status)
            : spaces

          return (
            <TabsContent key={tab.value} value={tab.value}>
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-sm">No {tab.label.toLowerCase()} listings found.</p>
                  {tab.value === 'all' && (
                    <Link href="/owner/listings/new" className={cn(buttonVariants(), 'mt-4')}>
                      Create your first listing
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {filtered.map((space) => (
                    <ListingManagementCard key={space.id} space={space} />
                  ))}
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
