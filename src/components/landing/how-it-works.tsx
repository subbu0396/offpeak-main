import { Search, Calendar, MapPin } from "lucide-react"

const STEPS = [
  {
    icon: Search,
    title: "Search",
    description: "Find available spaces near you at off-peak prices",
  },
  {
    icon: Calendar,
    title: "Book",
    description: "Reserve instantly or submit an offer for the best deal",
  },
  {
    icon: MapPin,
    title: "Go",
    description: "Show your QR code on arrival and enjoy your space",
  },
]

export function HowItWorks() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-500">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
