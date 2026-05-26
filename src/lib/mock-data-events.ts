import type { EventContract, DealAlert, NotificationPreference, CSVImportRow, Space } from "@/types"
import { getAllSpaces } from "./mock-data"

export const MOCK_CONTRACTS: EventContract[] = [
  {
    id: "contract-001", spaceId: "space-011", organizerId: "organizer-001",
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    eventType: "Corporate Networking", guestCount: 45, totalPrice: 1200, depositAmount: 360,
    depositPaid: false, contractStatus: "DRAFT",
    specialRequirements: "Need projector and PA system. Catering for 45.", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "contract-002", spaceId: "space-006", organizerId: "organizer-001",
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    eventType: "Birthday Party", guestCount: 30, totalPrice: 800, depositAmount: 240,
    depositPaid: true, contractStatus: "SIGNED", signedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    cateringOptions: ["Finger food", "Drinks package"], cancellationPolicy: "Full refund up to 7 days before event.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "contract-003", spaceId: "space-011", organizerId: "organizer-001",
    eventDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    eventType: "Product Launch", guestCount: 60, totalPrice: 2000, depositAmount: 600,
    depositPaid: true, contractStatus: "FINALIZED", signedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    cateringOptions: ["Full catering", "Premium drinks"], cancellationPolicy: "50% refund up to 14 days.",
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
  },
]

export const MOCK_DEAL_ALERTS: DealAlert[] = [
  { id: "alert-001", userId: "organizer-001", promotionId: "promo-001", spaceId: "space-002", message: "50% off afternoon co-working at Clerkenwell Creative Hub", read: false, createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  { id: "alert-002", userId: "organizer-001", promotionId: "promo-003", spaceId: "space-003", message: "Flash deal: 40% off Soho restaurant tonight!", read: false, createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { id: "alert-003", userId: "organizer-001", promotionId: "promo-004", spaceId: "space-004", message: "Weekend flash deal: Camden bar private room", read: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: "alert-004", userId: "seeker-001", promotionId: "promo-001", spaceId: "space-002", message: "New deal near you: 50% off co-working", read: false, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "alert-005", userId: "seeker-001", promotionId: "promo-005", spaceId: "space-001", message: "Use code OFFPEAK25 for 25% off parking", read: true, createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
]

export const MOCK_NOTIFICATION_PREFS: NotificationPreference = {
  userId: "organizer-001", flashDeals: true, priceDrops: true,
  newInCategory: ["EVENT_VENUE", "FUNCTION_ROOM"], maxDistanceKm: 25, enabled: true,
}

export const CSV_TEMPLATE_HEADERS = [
  "title", "category", "address", "city", "postcode", "capacity", "amenities", "basePrice", "offPeakDiscount"
]

export const MOCK_CSV_IMPORT_DATA: CSVImportRow[] = [
  { title: "Grand Ballroom A", category: "FUNCTION_ROOM", address: "100 Park Lane", city: "London", postcode: "W1K 1AA", capacity: 200, amenities: "Projector,Sound System,Catering,Air Conditioning", basePrice: 175, offPeakDiscount: 35 },
  { title: "Meeting Room 101", category: "FUNCTION_ROOM", address: "100 Park Lane", city: "London", postcode: "W1K 1AA", capacity: 12, amenities: "Projector,Wi-Fi,Air Conditioning", basePrice: 45, offPeakDiscount: 25 },
  { title: "Garden Terrace", category: "EVENT_VENUE", address: "100 Park Lane", city: "London", postcode: "W1K 1AA", capacity: 80, amenities: "Outdoor Area,Sound System,Catering,Toilets", basePrice: 150, offPeakDiscount: 40 },
  { title: "Executive Boardroom", category: "FUNCTION_ROOM", address: "100 Park Lane", city: "London", postcode: "W1K 1AA", capacity: 20, amenities: "Projector,Wi-Fi,Air Conditioning,Reception", basePrice: 85, offPeakDiscount: 20 },
  { title: "Rooftop Lounge", category: "EVENT_VENUE", address: "100 Park Lane", city: "London", postcode: "W1K 1AA", capacity: 50, amenities: "Outdoor Area,Sound System,CCTV,Security", basePrice: 120, offPeakDiscount: 30 },
]

// Helpers
export function getContractsForUser(userId: string): EventContract[] {
  return MOCK_CONTRACTS.filter(c => c.organizerId === userId)
}

export function getContractById(id: string): EventContract | undefined {
  return MOCK_CONTRACTS.find(c => c.id === id)
}

export function getAlertsForUser(userId: string): DealAlert[] {
  return MOCK_DEAL_ALERTS.filter(a => a.userId === userId)
}

export function getUnreadAlertCount(userId: string): number {
  return MOCK_DEAL_ALERTS.filter(a => a.userId === userId && !a.read).length
}

export function getEventVenues(): Space[] {
  return getAllSpaces().filter(s => s.category === "EVENT_VENUE" || s.category === "FUNCTION_ROOM")
}
