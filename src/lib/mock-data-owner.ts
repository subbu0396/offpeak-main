import type { VerificationDocument, AnalyticsSnapshot, Bid, Booking, Space } from "@/types"
// Import from existing mock data
import { MOCK_SPACES, MOCK_BOOKINGS } from "./mock-data"

// 3 verification docs for owner-001
export const MOCK_VERIFICATION_DOCS: VerificationDocument[] = [
  { id: "vdoc-001", userId: "owner-001", type: "ID", fileName: "passport-scan.pdf", uploadedAt: "2025-05-28T10:00:00Z", status: "VERIFIED" },
  { id: "vdoc-002", userId: "owner-001", type: "PHOTO", fileName: "space-photos.zip", uploadedAt: "2025-05-29T14:00:00Z", status: "VERIFIED" },
  { id: "vdoc-003", userId: "owner-001", type: "GEO_EVIDENCE", fileName: "location-proof.jpg", uploadedAt: "2025-05-30T09:00:00Z", status: "PENDING" },
  { id: "vdoc-004", userId: "owner-005", type: "ID", fileName: "drivers-license.pdf", uploadedAt: "2025-09-12T11:00:00Z", status: "PENDING" },
]

// 30 days of analytics for owner-001's first 3 spaces (space-001, space-002, space-003)
// Generate programmatically with realistic patterns
export const MOCK_ANALYTICS: AnalyticsSnapshot[] = generateAnalytics()

function generateAnalytics(): AnalyticsSnapshot[] {
  const data: AnalyticsSnapshot[] = []
  const spaceIds = ["space-001", "space-002", "space-003"]
  const now = new Date()

  for (const spaceId of spaceIds) {
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      // Realistic patterns: weekdays busier, weekends vary by space
      const baseViews = isWeekend ? 15 + Math.floor(Math.random() * 20) : 30 + Math.floor(Math.random() * 40)
      const baseBookings = isWeekend ? 1 + Math.floor(Math.random() * 3) : 3 + Math.floor(Math.random() * 5)
      const baseRevenue = baseBookings * (20 + Math.floor(Math.random() * 30))

      data.push({
        spaceId,
        date: date.toISOString().split("T")[0],
        views: baseViews,
        bookings: baseBookings,
        revenue: baseRevenue,
        occupancyRate: Math.min(95, 30 + Math.floor(Math.random() * 50)),
        offPeakUtilization: Math.min(80, 20 + Math.floor(Math.random() * 40)),
      })
    }
  }
  return data
}

// Mock incoming bids on owner's spaces
export const MOCK_INCOMING_BIDS: Bid[] = [
  { id: "bid-inc-001", spaceId: "space-001", seekerId: "seeker-001", proposedPrice: 5.50, currency: "GBP", message: "I'd like to use this spot regularly on weekday afternoons", status: "PENDING", expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "bid-inc-002", spaceId: "space-002", seekerId: "seeker-001", proposedPrice: 12.00, currency: "GBP", message: "Looking for a quiet desk for the afternoon", status: "PENDING", expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: "bid-inc-003", spaceId: "space-003", seekerId: "organizer-001", proposedPrice: 30.00, currency: "GBP", message: "Hosting a small lunch meeting for 6 people", status: "COUNTERED", counterPrice: 38.00, expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: "bid-inc-004", spaceId: "space-001", seekerId: "organizer-001", proposedPrice: 4.00, currency: "GBP", status: "REJECTED", expiresAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
]

// Helper functions
export function getSpacesForOwner(ownerId: string): Space[] {
  return MOCK_SPACES.filter(s => s.ownerId === ownerId)
}

export function getAnalyticsForSpace(spaceId: string, days: number = 30): AnalyticsSnapshot[] {
  return MOCK_ANALYTICS.filter(a => a.spaceId === spaceId).slice(-days)
}

export function getVerificationDocsForUser(userId: string): VerificationDocument[] {
  return MOCK_VERIFICATION_DOCS.filter(d => d.userId === userId)
}

export function getBookingsForSpace(spaceId: string): Booking[] {
  return MOCK_BOOKINGS.filter(b => b.spaceId === spaceId)
}

export function getRevenueForSpace(spaceId: string): number {
  return MOCK_BOOKINGS.filter(b => b.spaceId === spaceId && b.status === "COMPLETED").reduce((sum, b) => sum + b.totalPrice, 0)
}

export function getIncomingBidsForOwner(ownerId: string): Bid[] {
  const ownerSpaceIds = getSpacesForOwner(ownerId).map(s => s.id)
  return MOCK_INCOMING_BIDS.filter(b => ownerSpaceIds.includes(b.spaceId))
}
