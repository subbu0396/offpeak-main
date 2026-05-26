'use client'

import { ImagePlus, X } from 'lucide-react'
import { useOwnerStore } from '@/store/owner-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const UNSPLASH_URLS = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
  'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
  'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
]

const SLOT_COUNT = 6

export function ListingStepPhotos() {
  const { draftListing, updateDraft } = useOwnerStore()
  const photos: string[] = draftListing.photos ?? []

  function handleAddPhoto(slotIndex: number) {
    const newPhotos = [...photos]
    // Pick an Unsplash URL not already used
    const used = new Set(newPhotos)
    const available = UNSPLASH_URLS.filter((u) => !used.has(u))
    const url = available.length > 0 ? available[0] : UNSPLASH_URLS[slotIndex % UNSPLASH_URLS.length]
    newPhotos[slotIndex] = url
    updateDraft({ photos: newPhotos })
  }

  function handleRemovePhoto(slotIndex: number) {
    const newPhotos = [...photos]
    newPhotos.splice(slotIndex, 1)
    updateDraft({ photos: newPhotos })
  }

  const photoCount = photos.filter(Boolean).length

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Photos</h2>
        <p className="text-sm text-slate-500 mt-1">
          Add up to 6 photos of your space. The first photo will be the cover image.
        </p>
      </div>

      <p className="text-sm font-medium text-slate-700">
        {photoCount}/6 photos added
        {photoCount === 0 && (
          <span className="text-red-500 ml-2">At least 1 photo required</span>
        )}
      </p>

      {/* Grid: 2 columns mobile, 3 columns desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: SLOT_COUNT }, (_, i) => {
          const photo = photos[i]
          const isCover = i === 0

          if (photo) {
            return (
              <div
                key={i}
                className={cn(
                  'relative rounded-xl overflow-hidden bg-slate-100 aspect-[4/3]',
                  isCover && 'md:col-span-2'
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={isCover ? 'Cover photo' : `Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {isCover && (
                  <span className="absolute top-2 left-2 rounded-full bg-teal-500 px-2 py-0.5 text-xs font-medium text-white">
                    Cover Photo
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(i)}
                  className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  aria-label="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleAddPhoto(i)}
              className={cn(
                'rounded-xl border-2 border-dashed border-slate-300 bg-white aspect-[4/3]',
                'flex flex-col items-center justify-center gap-2',
                'hover:border-teal-400 hover:bg-teal-50/50 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
                isCover && 'md:col-span-2'
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <ImagePlus className="h-5 w-5 text-slate-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">
                  {isCover ? 'Cover Photo' : `Photo ${i + 1}`}
                </p>
                <p className="text-xs text-teal-600 font-medium mt-0.5">Click to add</p>
              </div>
            </button>
          )
        })}
      </div>

      <p className="text-xs text-slate-500">
        Photos are simulated with Unsplash placeholders in this demo.
      </p>
    </div>
  )
}

export function getPhotosStepValid(draft: { photos?: string[] }): boolean {
  return !!draft.photos && draft.photos.filter(Boolean).length >= 1
}
