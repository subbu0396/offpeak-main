import {
  Wifi,
  Projector,
  CookingPot,
  Zap,
  Accessibility,
  Wind,
  Speaker,
  Car,
  UtensilsCrossed,
  Shield,
  Bath,
  Trees,
  Eye,
  Clock,
  UserCheck,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react'

const AMENITY_ICONS: Record<string, LucideIcon> = {
  'Wi-Fi': Wifi,
  'Projector': Projector,
  'Kitchen': CookingPot,
  'EV Charging': Zap,
  'Disabled Access': Accessibility,
  'Air Conditioning': Wind,
  'Sound System': Speaker,
  'Parking': Car,
  'Catering': UtensilsCrossed,
  'Security': Shield,
  'Toilets': Bath,
  'Outdoor Area': Trees,
  'CCTV': Eye,
  '24/7 Access': Clock,
  'Reception': UserCheck,
}

interface AmenityListProps {
  amenities: string[]
}

export function AmenityList({ amenities }: AmenityListProps) {
  if (amenities.length === 0) {
    return (
      <p className="text-sm text-slate-500">No amenities listed.</p>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
      {amenities.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity] ?? CheckCircle
        return (
          <div key={amenity} className="flex items-center gap-3 p-2">
            <Icon className="h-4 w-4 text-teal-600 shrink-0" aria-hidden="true" />
            <span className="text-sm text-slate-700">{amenity}</span>
          </div>
        )
      })}
    </div>
  )
}
