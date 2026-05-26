import {
  Car, UtensilsCrossed, Hotel, Wine, Coffee,
  Laptop, PartyPopper, DoorOpen
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { Category, User } from "@/types"

export interface CategoryMeta {
  value: Category
  label: string
  icon: LucideIcon
}

export const CATEGORIES: CategoryMeta[] = [
  { value: "PARKING", label: "Parking", icon: Car },
  { value: "RESTAURANT", label: "Restaurant", icon: UtensilsCrossed },
  { value: "HOTEL_ROOM", label: "Hotel Room", icon: Hotel },
  { value: "BAR", label: "Bar", icon: Wine },
  { value: "COFFEE_SHOP", label: "Coffee Shop", icon: Coffee },
  { value: "CO_WORKING", label: "Co-Working", icon: Laptop },
  { value: "EVENT_VENUE", label: "Event Venue", icon: PartyPopper },
  { value: "FUNCTION_ROOM", label: "Function Room", icon: DoorOpen },
]

export const AMENITIES = [
  "Wi-Fi", "Projector", "Kitchen", "EV Charging", "Disabled Access",
  "Air Conditioning", "Sound System", "Parking", "Catering", "Security",
  "Toilets", "Outdoor Area", "CCTV", "24/7 Access", "Reception"
] as const

export const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
] as const

export const MOCK_USER: User = {
  id: "seeker-001",
  name: "Alex Morgan",
  email: "alex@example.com",
  role: "SEEKER",
  avatarUrl: undefined,
  phone: "+44 7700 900123",
  verificationStatus: "VERIFIED",
  createdAt: "2025-09-15T10:00:00Z",
}
