import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getActiveDeals, getAllSpaces, getPricingForSpace } from "@/lib/mock-data"
import { PriceTag } from "@/components/common/price-tag"

export function FeaturedDeals() {
  const allSpaces = getAllSpaces()
  const activeDeals = getActiveDeals()

  const dealItems = activeDeals
    .slice(0, 4)
    .map((promo) => {
      const space = allSpaces.find((s) => s.id === promo.spaceId)
      const pricing = space ? getPricingForSpace(space.id) : undefined
      if (!space || !pricing) return null
      return { promo, space, pricing }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  if (dealItems.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Featured Deals
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dealItems.map(({ promo, space, pricing }) => (
          <div
            key={promo.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={space.photos[0]}
                alt={space.title}
                fill
                className="object-cover rounded-t-xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 leading-snug">
                {space.title}
              </h3>
              <p className="text-teal-600 text-xs font-medium line-clamp-1">
                {promo.title}
              </p>
              <PriceTag
                basePrice={pricing.basePrice}
                discountPercent={promo.discountPercent}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <Link href="/deals" className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1">
          View All Deals <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
