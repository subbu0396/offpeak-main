'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ImageOff, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  photos: string[]
  title: string
}

export function ImageGallery({ photos, title }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [mobileIndex, setMobileIndex] = useState(0)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % photos.length)
  }, [lightboxIndex, photos.length])

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)
  }, [lightboxIndex, photos.length])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, goNext, goPrev])

  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-slate-100 rounded-xl gap-3 text-slate-500">
        <ImageOff className="h-12 w-12" />
        <p className="text-sm">No photos available</p>
      </div>
    )
  }

  const mainPhoto = photos[0]
  const thumbnails = photos.slice(1, 5)

  return (
    <>
      {/* Mobile: horizontal scroll */}
      <div className="md:hidden relative">
        <div
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
          onScroll={(e) => {
            const el = e.currentTarget
            const index = Math.round(el.scrollLeft / el.clientWidth)
            setMobileIndex(index)
          }}
        >
          {photos.map((photo, i) => (
            <div
              key={i}
              className="relative snap-center shrink-0 w-full h-64"
              onClick={() => openLightbox(i)}
            >
              <Image
                src={photo}
                alt={`${title} - Photo ${i + 1}`}
                fill
                className="object-cover cursor-pointer"
                sizes="100vw"
              />
            </div>
          ))}
        </div>
        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setMobileIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === mobileIndex
                  ? 'w-4 bg-teal-600'
                  : 'w-1.5 bg-slate-300'
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop: grid layout */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[320px] rounded-xl overflow-hidden">
        {/* Large main image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={mainPhoto}
            alt={`${title} - Photo 1`}
            fill
            className="object-cover hover:brightness-95 transition-all"
            sizes="(max-width: 1200px) 50vw, 600px"
          />
        </div>

        {/* Thumbnails */}
        {thumbnails.map((photo, i) => (
          <div
            key={i}
            className="relative cursor-pointer"
            onClick={() => openLightbox(i + 1)}
          >
            <Image
              src={photo}
              alt={`${title} - Photo ${i + 2}`}
              fill
              className="object-cover hover:brightness-95 transition-all"
              sizes="(max-width: 1200px) 25vw, 300px"
            />
            {/* "Show all" overlay on last thumbnail if there are more */}
            {i === 3 && photos.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  +{photos.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Fill empty thumbnail slots */}
        {thumbnails.length < 4 &&
          Array.from({ length: 4 - thumbnails.length }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-slate-100" />
          ))}
      </div>

      {/* Show all button for desktop */}
      {photos.length > 5 && (
        <div className="hidden md:flex justify-end mt-2">
          <button
            onClick={() => openLightbox(0)}
            className="text-sm text-slate-600 underline hover:text-teal-600 transition-colors"
          >
            Show all {photos.length} photos
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium">
            {lightboxIndex + 1} of {photos.length}
          </div>

          {/* Close */}
          <button
            onClick={closeLightbox}
            aria-label="Close lightbox"
            className="absolute top-4 right-4 text-white hover:text-slate-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 transition-colors bg-black/30 rounded-full p-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[80vh] w-full h-full mx-12"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightboxIndex]}
              alt={`${title} - Photo ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 transition-colors bg-black/30 rounded-full p-2"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </>
  )
}
