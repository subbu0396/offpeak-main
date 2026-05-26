import { Hero } from "@/components/landing/hero"
import { CategoryShowcase } from "@/components/landing/category-showcase"
import { FeaturedDeals } from "@/components/landing/featured-deals"
import { HowItWorks } from "@/components/landing/how-it-works"

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <CategoryShowcase />
        <FeaturedDeals />
        <HowItWorks />
      </div>
    </>
  )
}
