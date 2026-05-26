import Image from "next/image"
import { SearchBar } from "@/components/layout/search-bar"

export function Hero() {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80&auto=format&fit=crop"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/80" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto w-full text-center space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
          Find spaces at off-peak prices
        </h1>
        <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto drop-shadow-md">
          Parking, restaurants, hotels and more — at discounted off-peak rates
        </p>
        <div className="pt-4">
          <SearchBar />
        </div>
      </div>
    </section>
  )
}
