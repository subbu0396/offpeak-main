'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Users, GitCompare, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MessageOwnerSheet } from '@/components/detail/message-owner-sheet'
import { useSpaceStore } from '@/store/space-store'
import { getSpaceById, getPricingForSpace, getOwnerForSpace } from '@/lib/mock-data'

export function VenueShortlist() {
  const { shortlistedIds, toggleShortlist } = useSpaceStore()
  const [showCompare, setShowCompare] = useState(false)
  const [messageVenueId, setMessageVenueId] = useState<string | null>(null)

  // Only event venue / function room categories
  const eventVenues = shortlistedIds
    .map((id) => getSpaceById(id))
    .filter(
      (s) =>
        s !== undefined &&
        (s.category === 'EVENT_VENUE' || s.category === 'FUNCTION_ROOM')
    )

  const compareVenues = eventVenues.slice(0, 3)

  const messageVenueOwner = messageVenueId
    ? (() => {
        try {
          return getOwnerForSpace(messageVenueId)
        } catch {
          return null
        }
      })()
    : null

  if (eventVenues.length === 0) {
    return (
      <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-1">My Shortlist</h2>
        <p className="text-sm text-slate-500">No venues shortlisted yet.</p>
        <p className="text-xs text-slate-500 mt-1">
          Click the heart icon on any venue card to shortlist it.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="sticky top-6 rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-base font-semibold text-slate-900">
            My Shortlist ({eventVenues.length})
          </h2>
          {eventVenues.length >= 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCompare((v) => !v)}
              className="gap-1.5"
            >
              <GitCompare className="h-3.5 w-3.5" />
              Compare
            </Button>
          )}
        </div>

        {/* Venue list */}
        <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
          {eventVenues.map((space) => {
            if (!space) return null
            const pricing = getPricingForSpace(space.id)
            return (
              <div key={space.id} className="flex gap-3 px-4 py-3">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  {space.photos[0] ? (
                    <Image
                      src={space.photos[0]}
                      alt={space.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : null}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{space.title}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Users className="h-3 w-3" />
                    {space.capacity} guests
                  </p>
                  {pricing && (
                    <p className="text-xs font-medium text-teal-600 mt-0.5">
                      £{pricing.basePrice}/hr
                    </p>
                  )}

                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <button
                      onClick={() => setMessageVenueId(space.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <MessageCircle className="h-3 w-3" />
                      Message
                    </button>
                    <Link
                      href={`/events/contracts/new?spaceId=${space.id}`}
                      className="inline-flex items-center rounded-md bg-teal-500 px-2 py-0.5 text-xs font-medium text-white hover:bg-teal-600 transition-colors"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => toggleShortlist(space.id)}
                  className="shrink-0 rounded-md p-1 text-slate-500 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label={`Remove ${space.title} from shortlist`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>

        {/* Compare table */}
        {showCompare && compareVenues.length >= 2 && (
          <div className="border-t border-slate-200 px-4 py-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Comparison (top {compareVenues.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2 font-semibold text-slate-500 pr-2">Venue</th>
                    {compareVenues.map((s) => s && (
                      <th key={s.id} className="pb-2 font-semibold text-slate-800 text-center px-1">
                        {s.title.length > 14 ? s.title.slice(0, 14) + '…' : s.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-1.5 text-slate-500 pr-2">Capacity</td>
                    {compareVenues.map((s) => s && (
                      <td key={s.id} className="py-1.5 text-center font-medium text-slate-900 px-1">
                        {s.capacity}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 text-slate-500 pr-2">Price/hr</td>
                    {compareVenues.map((s) => {
                      if (!s) return null
                      const p = getPricingForSpace(s.id)
                      return (
                        <td key={s.id} className="py-1.5 text-center font-medium text-teal-600 px-1">
                          {p ? `£${p.basePrice}` : '–'}
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <td className="py-1.5 text-slate-500 pr-2">Rating</td>
                    {compareVenues.map((s) => s && (
                      <td key={s.id} className="py-1.5 text-center font-medium text-slate-900 px-1">
                        {s.rating.toFixed(1)} ★
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1.5 text-slate-500 pr-2 align-top">Amenities</td>
                    {compareVenues.map((s) => s && (
                      <td key={s.id} className="py-1.5 text-center text-slate-700 px-1">
                        {s.amenities.slice(0, 3).join(', ')}
                        {s.amenities.length > 3 && ' …'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Message owner sheet */}
      <MessageOwnerSheet
        open={!!messageVenueId}
        onOpenChange={(open) => { if (!open) setMessageVenueId(null) }}
        ownerName={messageVenueOwner?.name ?? 'Manager'}
      />
    </>
  )
}
