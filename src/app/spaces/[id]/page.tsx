import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getSpaceById, getPricingForSpace } from "@/lib/mock-data"
import { SpaceDetailContent } from "@/components/detail/space-detail-content"
import { BookingCTA } from "@/components/detail/booking-cta"
import { PromoAutoApply } from "@/components/detail/promo-auto-apply"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const space = getSpaceById(id)
  if (!space) return { title: "Space Not Found | OffPeak Spaces" }
  const pricing = getPricingForSpace(space.id)
  const offPeakPrice = pricing
    ? (pricing.basePrice * (1 - pricing.offPeakDiscount / 100)).toFixed(2)
    : undefined
  return {
    title: `${space.title} | OffPeak Spaces`,
    description: `${space.category.replace("_", " ")} in ${space.location.city} — from £${offPeakPrice}/session. ${space.rating} stars.`,
    openGraph: {
      title: space.title,
      description: space.description,
      images: space.photos.length > 0 ? [{ url: space.photos[0] }] : undefined,
    },
  }
}

export default async function SpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const space = getSpaceById(id)
  if (!space) notFound()

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: space.title,
    description: space.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: space.location.address,
      addressLocality: space.location.city,
      postalCode: space.location.postcode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: space.location.lat,
      longitude: space.location.lng,
    },
    aggregateRating: space.reviewCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: space.rating,
      reviewCount: space.reviewCount,
    } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={null}>
        <PromoAutoApply />
      </Suspense>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SpaceDetailContent space={space} />
      </div>
      <BookingCTA space={space} />
    </>
  )
}
