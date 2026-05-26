import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CATEGORIES } from "@/lib/constants"
import { getAllSpaces } from "@/lib/mock-data"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export function CategoryShowcase() {
  const spaces = getAllSpaces()

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Browse by Category
      </h2>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {CATEGORIES.map((cat) => {
            const count = spaces.filter((s) => s.category === cat.value).length
            const Icon = cat.icon

            return (
              <Link
                key={cat.value}
                href={`/explore?category=${cat.value}`}
                className="group flex flex-col items-center gap-3 bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow min-w-[150px] text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 group-hover:bg-teal-100 transition-colors">
                  <Icon className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">
                    {cat.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {count} {count === 1 ? "space" : "spaces"}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="text-center mt-6">
        <Link href="/explore" className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1">
          View All Categories <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
