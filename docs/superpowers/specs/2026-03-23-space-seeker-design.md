# Space Seeker Sub-project — Design Specification

**Project:** OffPeak Spaces Marketplace
**Sub-project:** 1 of 4 — Space Seeker Experience
**Date:** 2026-03-23
**Status:** Approved

---

## 1. Purpose

Build the complete buyer-side experience for the OffPeak Spaces Marketplace. A Space Seeker should be able to discover underutilized spaces (parking, restaurants, hotels, bars, co-working) on an interactive map, view detailed listings with off-peak pricing, book instantly or submit bids, and redeem promotional offers — all within a modal-driven, map-centric interface.

This sub-project covers 6 of the 15 user journeys defined in the product questionnaire and establishes the component foundation that subsequent sub-projects (Owner, Manager, Admin) will build upon.

---

## 2. Scope

### In Scope

- Landing page with hero, category showcase, featured deals
- Map-centric explore page with search, filters, and interactive pins
- Space detail via bottom sheet (mobile) and side panel (desktop)
- Standalone space detail page for SEO and deep-linking (`/spaces/[id]`)
- Quick-book flow (instant booking → confirmation + QR)
- Multi-step checkout flow (promo codes, bid-based bookings)
- Bid submission and status tracking
- Flash deals and promotions feed
- Booking history page
- 15-20 mock spaces across real UK cities
- Mock user identity (no auth)
- Mobile-first responsive design (375px → 1536px)
- Dark mode support via existing shadcn theme system (follows system preference via `prefers-color-scheme`, no manual toggle in this sub-project)

### Out of Scope

- Authentication / real user accounts
- Payment gateway integration (mock only)
- Owner/Manager dashboards
- Admin moderation tools
- Push notifications (UI only — no service worker)
- Real-time availability sync
- Contract/e-signature flows
- KYC/verification flows

---

## 3. Architecture

### 3.1 Routing

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, categories, featured deals, CTA to explore |
| `/explore` | **Main hub** — map + list + all modal interactions |
| `/spaces/[id]` | Standalone detail page (SEO, sharing, deep links) |
| `/deals` | Promotions and flash deals feed |
| `/bookings` | Mock user's booking history |

### 3.2 Modal/Sheet Layers (on `/explore`)

Layered modals triggered from map interactions:

1. **FilterSheet** — bottom sheet with search filters (price, category, capacity, amenities, instant book, off-peak only)
2. **SpaceDetailSheet** — full listing detail (slides up on mobile, right panel on desktop)
3. **BookingSheet** — nested quick-book flow (select time → confirm)
4. **CheckoutDialog** — multi-step flow for promo/bid bookings
5. **BidSheet** — "Make an Offer" form
6. **BookingConfirmationDialog** — success with QR code

### 3.3 State Management (Zustand)

| Store | Responsibility |
|---|---|
| `useExploreStore` | Search query, active filters, category, map bounds, view mode (map/list/split), sort order |
| `useSpaceStore` | Selected space data, active sheet/modal state, shortlisted spaces |
| `useBookingStore` | Booking flow state, selected time slot, price calculation, promo code |
| `useBidStore` | Bid form state (price, message, status) |

### 3.4 URL Parameter Sync

Filters and selected space sync to URL for deep-linking:
```
/explore?category=parking&city=london&space=abc123
```
Zustand stores bidirectionally sync with URL search params using `nuqs` (type-safe URL state management for Next.js) to avoid hydration mismatches and infinite update loops. Each filter gets a typed parser (e.g., `parseAsString`, `parseAsInteger`).

### 3.5 Data Flow

```
Mock JSON (/lib/mock-data.ts)
  → Zustand stores (filtered/sorted)
    → React components (render)
      → User actions (mutations to store)
        → UI updates + URL param sync
```

No API calls — all data is client-side from mock JSON. Components are structured to easily swap mock data for React Query fetches in future sub-projects.

---

## 4. User Journeys → Feature Mapping

### Journey 1: Find & Book Parking (Critical Path)

**Persona:** Space Seeker (commuter)
**Flow:** Landing → Explore → Search "parking" near location → Filter (duration, instant book) → Map pins → Tap pin → SpaceDetailSheet → Select time slot → "Book Now" → Quick-book confirmation → QR code + directions

**Components used:**
- SearchBar, CategoryPills, MapView (mapcn), SpaceCard
- SpaceDetailSheet, AvailabilityCalendar
- BookingSheet (quick flow), BookingConfirmationDialog

### Journey 2: Submit a Bid

**Persona:** Space Seeker (negotiator)
**Flow:** Explore → Find bid-enabled listing → SpaceDetailSheet → "Make an Offer" → BidSheet (price, message, expiry) → Submit → BidStatusCard in Bookings page

**Components used:**
- SpaceDetailSheet with BidWidget
- BidSheet (price input, message textarea, expiry display)
- BidStatusCard (in /bookings)

### Journey 3: Flash Deal → Quick Book

**Persona:** Space Seeker (impulse buyer)
**Flow:** Deals page → Flash deal with countdown → Tap → SpaceDetailSheet → Quick-book → Confirmation

**Components used:**
- DealsPage, FlashDealCard (countdown timer)
- SpaceDetailSheet, BookingSheet
- BookingConfirmationDialog

### Journey 4: Promo Code Booking

**Persona:** Space Seeker (budget-conscious)
**Flow:** SpaceDetailSheet → "Book Now" → CheckoutDialog → Enter promo code → Price recalculates to zero → Review terms → Confirm → QR redemption code

**Components used:**
- CheckoutDialog (multi-step), PromoCodeInput
- PriceBreakdown (dynamic recalculation)
- BookingConfirmationDialog with RedemptionQR

### Journey 5: Discover Venue for Event

**Persona:** Event Organizer (variant of Seeker)
**Flow:** Explore → Advanced filters (capacity 50+, AV, catering, private room) → Compare on map/list → Shortlist (save) → View details → Message owner or initiate bid

**Components used:**
- FilterSheet (advanced: capacity slider, amenity checkboxes)
- SpaceCard with ShortlistButton (heart)
- SpaceDetailSheet, MessageOwnerSheet, BidSheet

### Journey 6: Find & Redeem Free Offer

**Persona:** Space Seeker (deal hunter)
**Flow:** Deals page → Filter "free offers" → View promo terms → Book qualifying slot → Claim offer → Get redemption QR

**Components used:**
- DealsPage with filter tabs
- PromoTermsCard
- CheckoutDialog (with promo auto-applied)
- BookingConfirmationDialog with RedemptionQR

---

## 5. Component Inventory

### 5.1 Layout Shell

| Component | Type | Description |
|---|---|---|
| `Navbar` | Client | Logo, search trigger, nav links (Explore, Deals, Bookings), avatar |
| `MobileBottomNav` | Client | Fixed bottom tabs: Explore, Map, Deals, Bookings, Profile |
| `SearchBar` | Client | Location + category + date. Inline desktop, expandable sheet mobile |

### 5.2 Discovery (Explore Page)

| Component | Type | Description |
|---|---|---|
| `CategoryPills` | Client | Horizontally scrollable category chips with icons |
| `FilterSheet` | Client | Bottom sheet: price range, capacity, amenities, toggles |
| `MapView` | Client | mapcn MapLibre map with price-labeled pins and clusters |
| `SpaceCard` | Server | Photo, title, category badge, off-peak badge, price, rating |
| `ViewToggle` | Client | Map / List / Split view toggle |
| `ResultsCount` | Server | "X spaces found" with active filter badges |

### 5.3 Space Detail

All detail sub-components are shared between `SpaceDetailSheet` (modal on `/explore`) and `SpaceDetailPage` (standalone `/spaces/[id]`). The page version adds SEO metadata and a sticky `BookingCTA` bar.

| Component | Type | Description |
|---|---|---|
| `SpaceDetailSheet` | Client | Full detail in sheet (mobile) or panel (desktop) |
| `SpaceDetailPage` | Server | Standalone page with SEO metadata (OG tags, JSON-LD Place schema). Renders same sub-components as sheet. Includes sticky `BookingCTA` footer bar |
| `SpaceDetailContent` | Server | Shared content layout used by both Sheet and Page containers |
| `BookingCTA` | Client | Sticky bottom bar (mobile) / sidebar card (desktop) on `/spaces/[id]` — shows price + "Book Now" / "Make an Offer" buttons. Opens BookingSheet or BidSheet |
| `ImageGallery` | Client | Swipe carousel (mobile), grid (desktop), lightbox |
| `SpaceHeader` | Server | Title, category, location, verified badge, rating |
| `PriceBreakdown` | Server | Base price, off-peak discount, savings in teal. Uses `PricingRule` entity for calculations |
| `AvailabilityCalendar` | Client | Date picker with off-peak slots highlighted |
| `AmenityList` | Server | Grid of amenity icons + labels |
| `ReviewSection` | Server | Rating summary + review cards |
| `OwnerInfo` | Server | Avatar, name, verification, response rate |
| `MessageOwnerSheet` | Client | Simple message form sheet — name, email, message textarea, send button. Used in Journey 5 to contact owner about event availability |

### 5.4 Booking & Bidding

| Component | Type | Description |
|---|---|---|
| `BookingSheet` | Client | Quick-book: select slot → confirm (1-step). Used when space has `instantBook=true` and no promo code is being applied |
| `CheckoutDialog` | Client | Multi-step dialog (see Section 5.4.1 for step breakdown). Used when: a promo code is applied, a bid is being converted to booking, or `instantBook=false` |
| `PromoCodeInput` | Client | Code input with validation + price recalculation |
| `BidSheet` | Client | Price input (with min threshold validation), message textarea, expiry display, submit. Maps to `Bid` entity from data model |
| `BidStatusCard` | Server | Bid status (pending/accepted/countered/expired) with action CTAs |
| `BookingConfirmationDialog` | Client | Success state containing: space summary, date/time, price paid, `QRCodeDisplay` (SVG), `CalendarSyncButton` (.ics download), directions link |
| `QRCodeDisplay` | Client | SVG-rendered QR code for venue entry / promo redemption. Sub-component of BookingConfirmationDialog |
| `CalendarSyncButton` | Client | "Add to Calendar" — generates .ics file download. Sub-component of BookingConfirmationDialog |
| `BookingCard` | Server | Booking in history list (photo, name, date, status) |

#### 5.4.1 CheckoutDialog Steps

The multi-step checkout has 4 steps with a progress indicator:

1. **Select Slot** — Date/time picker (pre-filled if coming from AvailabilityCalendar)
2. **Add Promo** — Optional promo code input. PriceBreakdown updates dynamically. Skip if no promo
3. **Review** — Summary: space details, time, price breakdown, cancellation terms. Mock payment method display
4. **Confirmation** — Success state with QR code (reuses BookingConfirmationDialog content)

**Decision logic (BookingSheet vs CheckoutDialog):**
- `BookingSheet` when: `space.instantBook === true` AND user is not applying a promo code
- `CheckoutDialog` when: `space.instantBook === false` OR user taps "Have a promo code?" OR booking originated from a bid acceptance

### 5.5 Landing Page

| Component | Type | Description |
|---|---|---|
| `Hero` | Server | Full-width section with gradient/image background, headline "Find spaces at off-peak prices", inline SearchBar, CTA |
| `CategoryShowcase` | Server | Horizontal scroll of category cards with icons and space counts |
| `FeaturedDeals` | Server | Grid of 3-4 SpaceCards with active promotions |
| `HowItWorks` | Server | 3-step visual explainer: Search → Book → Go |

### 5.6 Deals Page

The `/deals` page has two sections: **Flash Deals** (time-limited, with countdown) and **Promotions** (ongoing offers). Filter tabs: All, Flash Deals, Free Offers, Discounts. Sort by: Expiring Soon, Biggest Discount, Nearest.

| Component | Type | Description |
|---|---|---|
| `DealsFilterTabs` | Client | Filter tabs for deal types |
| `FlashDealCard` | Client | Space card + countdown timer + urgency CTA |
| `PromoCard` | Server | Deal headline, terms summary, redemption info |
| `PromoTermsCard` | Server | Full terms and conditions display |

### 5.7 Bookings Page

The `/bookings` page shows the mock user's booking history with tab filters: **Upcoming** (confirmed), **Past** (completed), **Cancelled**, **Bids** (pending/accepted/countered). Empty state per tab.

| Component | Type | Description |
|---|---|---|
| `BookingsTabFilter` | Client | Tab filter for booking status categories |

### 5.8 Common

| Component | Type | Description |
|---|---|---|
| `OffPeakBadge` | Server | Teal badge "Off-Peak -X%" |
| `VerifiedBadge` | Server | Green badge with checkmark |
| `StarRating` | Server | 1-5 stars with numeric value |
| `PriceTag` | Server | Price with optional strikethrough + discount |
| `EmptyState` | Server | Illustrated empty state with CTA |
| `SkeletonLoader` | Server | Loading placeholder per component type |
| `ShortlistButton` | Client | Heart icon toggle for saving spaces |
| `CountdownTimer` | Client | Live countdown for flash deals |

---

## 6. Mock Data Structure

### 6.1 Mock Spaces (15-20)

Distributed across real UK cities with real coordinates:
- **London** (5-6): Parking in Shoreditch, co-working in Clerkenwell, restaurant in Soho, bar in Camden, coffee shop in Notting Hill
- **Manchester** (3-4): Parking, function room, restaurant, co-working
- **Birmingham** (2-3): Hotel room, event venue, parking
- **Bristol** (2): Coffee shop, bar
- **Edinburgh** (2): Restaurant, co-working
- **Leeds** (1-2): Parking, function room

Each space includes:
- 3-5 photo URLs (Unsplash placeholder images by category)
- Realistic pricing in GBP (parking: 2-8/hr, restaurant: 15-50/session, etc.)
- Off-peak discount rules (20-40% off)
- Amenities appropriate to category
- 2-5 mock reviews
- Availability schedule with off-peak windows marked

### 6.2 Mock User

```typescript
const MOCK_USER: User = {
  id: "seeker-001",
  name: "Alex Morgan",
  email: "alex@example.com",
  role: "SEEKER",
  avatarUrl: "/images/avatar-placeholder.jpg",
  phone: "+44 7700 900123",
  verificationStatus: "VERIFIED",
  createdAt: "2025-09-15T10:00:00Z"
}
```

### 6.3 Mock Bookings (3-5 pre-seeded)

Mix of statuses: 1 confirmed (upcoming), 1 completed, 1 cancelled, 1 pending bid.

### 6.4 Mock Promotions (4-6)

Each maps to the `Promotion.type` enum from data-model.md:

| Mock Promotion | Enum Type | Description |
|---|---|---|
| 50% off co-working afternoon | `DISCOUNT` | Percentage discount |
| Free coffee with parking booking | `FREEBIE` | Value-add freebie |
| Flash: Restaurant table tonight -40% | `FLASH_DEAL` | Time-limited flash deal with countdown |
| Flash: Bar private room this weekend | `FLASH_DEAL` | Time-limited flash deal with countdown |
| Use code OFFPEAK25 for 25% off | `PROMO_CODE` | Redeemable promo code |
| Free meeting room (owner-sponsored) | `FREEBIE` | Zero-cost, owner-covered |

---

## 7. Design Tokens Integration

All visual styling follows `offpeak-context/.brainchain/design-tokens.md`:

- **Primary palette:** Navy `#0F172A`, Charcoal `#1E293B`
- **Accent:** Teal `#14B8A6` (badges, CTAs), Teal-600 `#0D9488` (text on white)
- **Font:** Inter via next/font/google (replace existing Geist)
- **Spacing:** 4px base unit scale
- **Radius:** sm=6px, md=8px, lg=12px
- **Shadows:** Subtle only

**Accessibility enforcement:**
- Teal-500 on white fails AA for text → use Teal-600 or white-on-teal
- All tap targets 44x44px minimum
- Focus-visible ring on all interactive elements
- Semantic landmarks on all pages

---

## 8. Error Handling & Edge Cases

| Scenario | Handling |
|---|---|
| No search results | EmptyState: illustration + "No spaces found" + adjust filters CTA |
| No availability | Calendar greyed out + "No slots this week" message |
| Bid rejected/expired | BidStatusCard with status + "Browse alternatives" CTA |
| Invalid promo code | Inline error under PromoCodeInput |
| Map fails to load | Fallback to list-only view + info banner |
| Flash deal expired | Card greys out, "Expired" badge, CTA disabled |
| Zero-price booking | Checkout skips payment, shows "Free" with redemption terms |
| Bid below minimum | Client-side validation error |
| Map panned away | "Search this area" floating button |
| Long titles/descriptions | CSS truncation with "Show more" expand |
| Missing photos | Category-specific placeholder image |

---

## 9. Loading States

Every async-feeling component gets a skeleton loader:
- `SpaceCardSkeleton` — image placeholder + text lines
- `SpaceDetailSkeleton` — gallery placeholder + content blocks
- `MapSkeleton` — shimmer overlay on map container
- `BookingCardSkeleton` — card with pulsing blocks

Mock data loads are wrapped in simulated delays (300-500ms) to demonstrate real loading UX during development.

---

## 10. Responsive Breakpoints

| Breakpoint | Layout Changes |
|---|---|
| **375px** (mobile) | Single column, bottom nav, bottom sheets, map fills viewport |
| **640px** (sm) | Slightly wider cards, 2-column SpaceCard grid in list view |
| **768px** (md) | Side-by-side map + list panels begin, sheets become wider |
| **1024px** (lg) | Full split layout (40% list / 60% map), navbar replaces bottom nav |
| **1280px** (xl) | Max-width container, spacious padding |

---

## 11. File Structure

```
src/
├── app/
│   ├── layout.tsx                    # Shell: Navbar + MobileBottomNav
│   ├── page.tsx                      # Landing page
│   ├── error.tsx                     # Global error boundary
│   ├── not-found.tsx                 # Custom 404
│   ├── explore/
│   │   ├── page.tsx                  # Map hub
│   │   └── loading.tsx               # Explore skeleton
│   ├── spaces/
│   │   └── [id]/
│   │       ├── page.tsx              # SEO detail page
│   │       ├── loading.tsx           # Detail skeleton
│   │       └── not-found.tsx         # Space-specific 404
│   ├── deals/
│   │   ├── page.tsx                  # Promotions feed
│   │   └── loading.tsx
│   └── bookings/
│       ├── page.tsx                  # Booking history
│       └── loading.tsx
├── components/
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── mobile-bottom-nav.tsx
│   │   └── search-bar.tsx
│   ├── landing/
│   │   ├── hero.tsx
│   │   ├── category-showcase.tsx
│   │   ├── featured-deals.tsx
│   │   └── how-it-works.tsx
│   ├── discovery/
│   │   ├── category-pills.tsx
│   │   ├── filter-sheet.tsx
│   │   ├── map-view.tsx
│   │   ├── space-card.tsx
│   │   ├── view-toggle.tsx
│   │   └── results-count.tsx
│   ├── detail/
│   │   ├── space-detail-sheet.tsx
│   │   ├── space-detail-content.tsx  # Shared content for sheet + page
│   │   ├── booking-cta.tsx           # Sticky CTA for standalone page
│   │   ├── image-gallery.tsx
│   │   ├── space-header.tsx
│   │   ├── price-breakdown.tsx
│   │   ├── availability-calendar.tsx
│   │   ├── amenity-list.tsx
│   │   ├── review-section.tsx
│   │   ├── owner-info.tsx
│   │   └── message-owner-sheet.tsx
│   ├── booking/
│   │   ├── booking-sheet.tsx
│   │   ├── checkout-dialog.tsx
│   │   ├── promo-code-input.tsx
│   │   ├── bid-sheet.tsx
│   │   ├── bid-status-card.tsx
│   │   ├── booking-confirmation-dialog.tsx
│   │   ├── qr-code-display.tsx
│   │   ├── calendar-sync-button.tsx
│   │   ├── booking-card.tsx
│   │   └── countdown-timer.tsx
│   ├── deals/
│   │   ├── deals-filter-tabs.tsx
│   │   ├── flash-deal-card.tsx
│   │   ├── promo-card.tsx
│   │   └── promo-terms-card.tsx
│   ├── bookings/
│   │   └── bookings-tab-filter.tsx
│   ├── common/
│   │   ├── offpeak-badge.tsx
│   │   ├── verified-badge.tsx
│   │   ├── star-rating.tsx
│   │   ├── price-tag.tsx
│   │   ├── empty-state.tsx
│   │   ├── shortlist-button.tsx
│   │   └── skeleton-loaders.tsx
│   └── ui/                           # shadcn (already installed)
├── hooks/
│   └── use-simulated-query.ts        # Mock data loader with delay, matches React Query API
├── lib/
│   ├── utils.ts                      # cn() helper (exists)
│   ├── mock-data.ts                  # All mock spaces, bookings, promos
│   └── constants.ts                  # Categories, amenities, enums
├── store/
│   ├── explore-store.ts
│   ├── space-store.ts                # Includes shortlistedIds with localStorage persist
│   ├── booking-store.ts
│   └── bid-store.ts
├── types/
│   └── index.ts                      # TypeScript interfaces from data-model.md
└── styles/
    └── globals.css                   # Already exists — extend with design tokens
```

---

## 12. Verification Plan

### Journey Walkthroughs
Walk through each of the 6 user journeys end-to-end at mobile and desktop:
1. Search for parking → book via quick-book → see QR
2. Find bid-enabled listing → submit offer → check status
3. Browse flash deals → tap deal → quick-book before expiry
4. Book with promo code → see price drop to zero → confirm
5. Advanced filter for event venue → shortlist → view details
6. Find free offer → book qualifying slot → get redemption code

### Responsive Testing
Preview at: 375px, 640px, 768px, 1024px, 1280px

### Accessibility Checks
- Keyboard navigation through all sheets/modals (Tab, Escape to close)
- Screen reader: landmark regions, button labels, image alt text, price context
- Contrast: verify teal text uses Teal-600, not Teal-500 on white
- Tap targets: all buttons/links at 44x44px minimum

### Component Edge Cases
- SpaceCard with 0 reviews, missing photo, very long title
- AvailabilityCalendar with no available slots
- BidSheet with bid below minimum threshold
- FlashDealCard after countdown expires
- Empty bookings page, empty search results

---

## 13. Sub-project Roadmap

| # | Sub-project | Builds On |
|---|---|---|
| **1** | **Space Seeker** (this spec) | Foundation |
| 2 | Space Owner | Seeker components + auth |
| 3 | Space Manager | Owner components + bulk tools |
| 4 | Administrator | All components + moderation |

Each subsequent sub-project follows its own spec → plan → build cycle.

---

## 14. Error Boundaries & Route Error Handling

- `app/error.tsx` — Global error boundary with "Something went wrong" UI and retry CTA
- `app/not-found.tsx` — Custom 404 page: "Space not found" with link back to explore
- `app/spaces/[id]/not-found.tsx` — Space-specific 404 for invalid space IDs
- Each route has `loading.tsx` using the appropriate skeleton loader

---

## 15. SEO Metadata Strategy

### `/spaces/[id]` Page
- Dynamic `<title>`: "{space.title} | OffPeak Spaces"
- Dynamic `<meta description>`: "{category} in {city} — from {offPeakPrice}/hr. {rating} stars."
- Open Graph: `og:image` from first space photo, `og:title`, `og:description`
- JSON-LD structured data: `Place` schema with name, address, geo coordinates, price range

### Other Pages
- `/` — Static metadata: "OffPeak Spaces | Find spaces at off-peak prices"
- `/explore` — Dynamic based on active filters
- `/deals` — Static: "Deals & Flash Offers | OffPeak Spaces"
- `/bookings` — noindex (private content)

---

## 16. Shortlist Feature

Shortlisted spaces are stored in `useSpaceStore.shortlistedIds` (persisted to localStorage via Zustand's `persist` middleware). Shortlisted spaces are viewable via a popover triggered from the Navbar heart icon (desktop) or accessible via the Profile tab (mobile). The popover shows a simple list of shortlisted SpaceCards with remove buttons.

---

## 17. Component Composition Notes

- **SpaceCard**: Server component wrapping a client `ShortlistButton`. The card itself is a `<Link>` or clickable region, with the heart button using `e.stopPropagation()` to prevent navigation
- **UI Inventory reconciliation**: `BookingWidget` (UI Inventory) → split into `BookingSheet` + `CheckoutDialog` (modal architecture). `BookingConfirmation` (UI Inventory, page) → `BookingConfirmationDialog` (modal) + confirmation content in BookingCard expand. `QRCode` + `CalendarSyncButton` → sub-components of `BookingConfirmationDialog`. `ListView` → layout concern within explore page, not a standalone component. `BidWidget` (UI Inventory) → `BidSheet` (spec)
- **Simulated loading**: A `useSimulatedQuery` hook wraps mock data access with configurable delay (300-500ms) and returns `{ data, isLoading, error }` matching React Query's API shape for easy future migration

---

## 18. Next.js 16 Compatibility

This project uses Next.js 16 which has breaking changes from earlier versions. Before implementing:
- Consult `node_modules/next/dist/docs/` for any API changes
- Verify `next/font/google` usage for Inter font loading
- Check App Router conventions haven't changed (page.tsx, layout.tsx, error.tsx patterns)
- Follow any deprecation notices in the Next.js 16 changelog

---

## 19. Scope Note

This sub-project intentionally includes Promotions/Deals (Journeys 3, 4, 6) which were listed as "out of scope for first milestone" in the original project requirements doc. This expansion was approved during design brainstorming to deliver a more complete buyer experience. The promotions features here are read-only/consumption-side — the creation/management of promotions is deferred to the Owner sub-project.
