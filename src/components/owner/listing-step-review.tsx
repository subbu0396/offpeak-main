'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOwnerStore } from '@/store/owner-store'
import { CATEGORIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const DAYS_MAP: Record<number, string> = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
}

export function ListingStepReview() {
  const router = useRouter()
  const { draftListing, pricingConfig, resetDraft } = useOwnerStore()
  const activeDays = useOwnerStore((s) => s.activeDays)
  const offPeakDays = useOwnerStore((s) => s.offPeakDays)
  const startTime = useOwnerStore((s) => s.scheduleStartTime)
  const endTime = useOwnerStore((s) => s.scheduleEndTime)
  const [open, setOpen] = useState(false)

  const categoryMeta = CATEGORIES.find((c) => c.value === draftListing.category)
  const photos: string[] = draftListing.photos ?? []
  const amenities: string[] = draftListing.amenities ?? []

  const basePrice = pricingConfig.basePrice ?? 0
  const offPeakDiscount = pricingConfig.offPeakDiscount ?? 0
  const minPrice = pricingConfig.minPrice ?? 0
  const offPeakPrice = basePrice > 0
    ? Math.max(minPrice, Math.round(basePrice * (1 - offPeakDiscount / 100)))
    : 0

  function handlePublish() {
    setOpen(true)
  }

  function handleViewListings() {
    setOpen(false)
    router.push('/owner/listings')
  }

  function handleCreateAnother() {
    setOpen(false)
    resetDraft()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Review & Publish</h2>
        <p className="text-sm text-slate-500 mt-1">
          Review your listing details before publishing.
        </p>
      </div>

      {/* Basic Info */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Basic Info
        </h3>
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-start gap-3 flex-wrap">
            <p className="text-base font-semibold text-slate-900 flex-1 min-w-0">
              {draftListing.title || <span className="text-slate-500 italic">No title set</span>}
            </p>
            {categoryMeta && (
              <Badge variant="secondary">{categoryMeta.label}</Badge>
            )}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {draftListing.description || <span className="text-slate-500 italic">No description</span>}
          </p>
          {draftListing.capacity && (
            <p className="text-sm text-slate-500">
              Capacity: <strong>{draftListing.capacity} guests</strong>
            </p>
          )}
        </div>
      </section>

      <Separator />

      {/* Photos */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Photos ({photos.length})
        </h3>
        {photos.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {photos.map((url, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden aspect-[4/3] bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-teal-500 px-1 py-0.5 text-[10px] font-medium text-white">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No photos added</p>
        )}
      </section>

      <Separator />

      {/* Amenities */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Amenities ({amenities.length})
        </h3>
        {amenities.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {amenities.map((a) => (
              <Badge key={a} variant="outline">{a}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No amenities selected</p>
        )}
      </section>

      <Separator />

      {/* Availability */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Availability
        </h3>
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
          {activeDays.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-1.5">
                {activeDays.sort((a, b) => a - b).map((d) => (
                  <span
                    key={d}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      offPeakDays.includes(d)
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {DAYS_MAP[d]}
                    {offPeakDays.includes(d) && ' (off-peak)'}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-600">
                Hours: <strong>{startTime} – {endTime}</strong>
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500 italic">No availability days set</p>
          )}
        </div>
      </section>

      <Separator />

      {/* Pricing */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Pricing
        </h3>
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Base price</span>
            <span className="font-semibold text-slate-900">£{basePrice}/hr</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Off-peak discount</span>
            <span className="font-semibold text-slate-900">{offPeakDiscount}%</span>
          </div>
          {offPeakDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Off-peak price</span>
              <span className="font-semibold text-teal-600">£{offPeakPrice}/hr</span>
            </div>
          )}
          {minPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Minimum price floor</span>
              <span className="font-semibold text-slate-900">£{minPrice}/hr</span>
            </div>
          )}
        </div>
      </section>

      {/* Publish button */}
      <div className="pt-2">
        <Button
          onClick={handlePublish}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white border-teal-500"
          size="lg"
        >
          Publish Listing
        </Button>
      </div>

      {/* Success dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <div className="text-5xl text-center py-2">🎉</div>
            <DialogTitle className="text-center text-lg">
              Listing Published!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your listing <strong>{draftListing.title}</strong> is now live and visible
              to seekers. You can manage it from your listings dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              onClick={handleViewListings}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white border-teal-500"
            >
              View Listings
            </Button>
            <Button
              variant="outline"
              onClick={handleCreateAnother}
              className="w-full"
            >
              Create Another
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
