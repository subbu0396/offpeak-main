// Enums / Union types
export type Category = "PARKING" | "RESTAURANT" | "HOTEL_ROOM" | "BAR" | "COFFEE_SHOP" | "CO_WORKING" | "EVENT_VENUE" | "FUNCTION_ROOM"
export type UserRole = "SEEKER" | "OWNER" | "MANAGER" | "ADMIN" | "EVENT_ORGANIZER"
export type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED"
export type SpaceStatus = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED"
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "DISPUTED"
export type BidStatus = "PENDING" | "ACCEPTED" | "COUNTERED" | "REJECTED" | "EXPIRED"
export type PromotionType = "DISCOUNT" | "FREEBIE" | "FLASH_DEAL" | "PROMO_CODE"

// Interfaces
export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: UserRole
  phone?: string
  verificationStatus: VerificationStatus
  createdAt: string
}

export interface Location {
  lat: number
  lng: number
  address: string
  city: string
  postcode: string
}

export interface Space {
  id: string
  ownerId: string
  title: string
  description: string
  category: Category
  photos: string[]
  capacity: number
  amenities: string[]
  location: Location
  status: SpaceStatus
  isVerified: boolean
  rating: number
  reviewCount: number
  instantBook: boolean
  biddingEnabled: boolean
  managerId?: string
  createdAt: string
}

export interface Availability {
  id: string
  spaceId: string
  dayOfWeek: number // 0=Sunday, 6=Saturday
  startTime: string // HH:mm
  endTime: string // HH:mm
  isOffPeak: boolean
  isAvailable: boolean
  blackoutDates: string[] // ISO dates
}

export interface PricingRule {
  id: string
  spaceId: string
  basePrice: number
  currency: string
  offPeakDiscount: number // 0-100 percentage
  occupancyThreshold: number // 0-100 percentage
  occupancyDiscount: number // 0-100 percentage
  autoApply: boolean
  minPrice?: number
}

export interface Booking {
  id: string
  spaceId: string
  seekerId: string
  startTime: string
  endTime: string
  status: BookingStatus
  totalPrice: number
  currency: string
  promoCode?: string
  qrCode?: string
  createdAt: string
}

export interface Bid {
  id: string
  spaceId: string
  seekerId: string
  proposedPrice: number
  currency: string
  message?: string
  status: BidStatus
  expiresAt: string
  counterPrice?: number
  createdAt: string
}

export interface Promotion {
  id: string
  spaceId: string
  type: PromotionType
  title: string
  terms: string
  discountPercent?: number
  promoCode?: string
  validFrom: string
  validTo: string
  redemptionLimit?: number
  redemptionCount: number
  isActive: boolean
}

export interface Review {
  id: string
  bookingId: string
  spaceId: string
  reviewerId: string
  rating: number // 1-5
  comment: string
  photos: string[]
  flaggedIssue?: string
  ownerResponse?: string
  createdAt: string
}

// Helper types for UI state
export interface TimeSlot {
  start: string // HH:mm
  end: string // HH:mm
  isOffPeak: boolean
  price: number
}

export interface MapBounds {
  ne: [number, number]
  sw: [number, number]
}

// === Verification ===
export type DocumentType = "ID" | "BUSINESS_REG" | "PHOTO" | "GEO_EVIDENCE" | "VIDEO_WALKTHROUGH"

export interface VerificationDocument {
  id: string
  userId: string
  type: DocumentType
  fileName: string
  fileUrl?: string
  uploadedAt: string
  status: VerificationStatus
}

// === Moderation ===
export type ModerationAction = "APPROVE" | "REQUEST_CHANGES" | "SUSPEND" | "DISMISS"

export type FlagReportStatus = "OPEN" | "INVESTIGATING" | "RESOLVED" | "DISMISSED"

export interface FlagReport {
  id: string
  reporterId: string
  spaceId: string
  bookingId?: string
  reason: string
  description: string
  status: FlagReportStatus
  photos?: string[]
  createdAt: string
  resolvedAt?: string
  adminAction?: ModerationAction
  adminNotes?: string
}

export interface ModerationLog {
  id: string
  adminId: string
  spaceId: string
  reportId?: string
  action: ModerationAction
  notes: string
  createdAt: string
}

// === Analytics ===
export interface AnalyticsSnapshot {
  spaceId: string
  date: string
  views: number
  bookings: number
  revenue: number
  occupancyRate: number // 0-100
  offPeakUtilization: number // 0-100
}

// === Bulk Import (Manager) ===
export interface CSVImportRow {
  title: string
  category: string
  address: string
  city: string
  postcode: string
  capacity: number
  amenities: string
  basePrice: number
  offPeakDiscount: number
}

export interface ImportValidationResult {
  rowIndex: number
  data: CSVImportRow
  errors: string[]
  warnings: string[]
  isValid: boolean
}

// === Event Contracts ===
export type ContractStatus = "DRAFT" | "SENT" | "SIGNED" | "DEPOSIT_PAID" | "FINALIZED" | "CANCELLED"

export interface EventContract {
  id: string
  spaceId: string
  organizerId: string
  eventDate: string
  eventType: string
  guestCount: number
  totalPrice: number
  depositAmount: number
  depositPaid: boolean
  contractStatus: ContractStatus
  specialRequirements?: string
  cateringOptions?: string[]
  cancellationPolicy?: string
  signedAt?: string
  createdAt: string
}

// === Notifications ===
export interface NotificationPreference {
  userId: string
  flashDeals: boolean
  priceDrops: boolean
  newInCategory: Category[]
  maxDistanceKm: number
  enabled: boolean
}

export interface DealAlert {
  id: string
  userId: string
  promotionId: string
  spaceId: string
  message: string
  read: boolean
  createdAt: string
}

// === Review Extensions ===
export type FlagIssueCategory = "CLEANLINESS" | "SAFETY" | "MISREPRESENTATION" | "NOISE" | "ACCESS" | "OTHER"
export type FlagSeverity = "LOW" | "MEDIUM" | "HIGH"
