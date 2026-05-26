# Space Seeker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Space Seeker buyer experience — map-centric discovery, modal-driven booking/bidding, deals, and booking history — covering 6 user journeys with mock data.

**Architecture:** Modal-driven, map-centric SPA. The `/explore` page is the hub; space detail, booking, and bidding happen via layered sheets/modals. A standalone `/spaces/[id]` page provides SEO. State managed via Zustand with URL sync via `nuqs`. All data is client-side mock JSON.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Zustand, nuqs, Framer Motion, mapcn (MapLibre), Lucide React

**Spec:** `docs/superpowers/specs/2026-03-23-space-seeker-design.md`

**Next.js 16 Critical Note:** `params` and `searchParams` in page/layout components are now **Promises** — must use `await params` and `await searchParams`. All page components that use them must be `async`.

---

## Phase 1: Foundation (Types, Data, State, Theme)

### Task 1: TypeScript Type Definitions

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Create all entity types from data-model.md**

Define interfaces for: `User`, `Space`, `Location`, `Availability`, `PricingRule`, `Booking`, `Bid`, `Promotion`, `Review`. Define enums/unions for: `Category`, `BookingStatus`, `BidStatus`, `PromotionType`, `VerificationStatus`, `UserRole`, `SpaceStatus`.

Key types:
```typescript
export type Category = "PARKING" | "RESTAURANT" | "HOTEL_ROOM" | "BAR" | "COFFEE_SHOP" | "CO_WORKING" | "EVENT_VENUE" | "FUNCTION_ROOM"

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
  status: "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED"
  isVerified: boolean
  rating: number
  reviewCount: number
  instantBook: boolean
  biddingEnabled: boolean
  createdAt: string
}
```

Add `instantBook` and `biddingEnabled` boolean fields to `Space` (needed for booking flow decision logic). These aren't in the data model doc but are required by the spec's checkout logic.

- [ ] **Step 2: Verify types compile**

Run: `cd /Users/inventor/Downloads/projects/freelance/offpeak/offpeak && npx tsc --noEmit`

- [ ] **Step 3: Commit**

---

### Task 2: Constants & Enums

**Files:**
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Define category metadata, amenity lists, and UI constants**

```typescript
import { Car, UtensilsCrossed, Hotel, Wine, Coffee, Laptop, PartyPopper, DoorOpen } from "lucide-react"

export const CATEGORIES = [
  { value: "PARKING", label: "Parking", icon: Car },
  { value: "RESTAURANT", label: "Restaurant", icon: UtensilsCrossed },
  // ... all 8 categories with Lucide icons
] as const

export const AMENITIES = [
  "Wi-Fi", "Projector", "Kitchen", "EV Charging", "Disabled Access",
  "Air Conditioning", "Sound System", "Parking", "Catering", "Security"
] as const

export const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
] as const

export const MOCK_USER: User = { /* from spec section 6.2 */ }
```

- [ ] **Step 2: Commit**

---

### Task 3: Mock Data

**Files:**
- Create: `src/lib/mock-data.ts`

- [ ] **Step 1: Create 18 mock spaces across UK cities**

Each space needs: id, title, description, category, 3-5 placeholder photo URLs (use `https://images.unsplash.com/photo-{id}?w=800&h=600&fit=crop` patterns), capacity, amenities, real UK coordinates, pricing rule (base price + off-peak discount), availability slots, 2-5 reviews, owner info. Distribute across London (6), Manchester (4), Birmingham (3), Bristol (2), Edinburgh (2), Leeds (1).

Ensure mix includes:
- At least 3 spaces with `instantBook: true`
- At least 3 with `biddingEnabled: true`
- At least 4 with active promotions

- [ ] **Step 2: Create mock bookings (4 pre-seeded)**

Statuses: 1 CONFIRMED (upcoming), 1 COMPLETED (past), 1 CANCELLED, 1 pending bid (use PENDING status).

- [ ] **Step 3: Create mock promotions (6)**

Map to enum types as defined in spec section 6.4. Include 2 FLASH_DEAL with future expiry times, 2 FREEBIE, 1 DISCOUNT, 1 PROMO_CODE.

- [ ] **Step 4: Create helper functions**

```typescript
export function getSpaceById(id: string): Space | undefined
export function getSpacesByCategory(category: Category): Space[]
export function getBookingsForUser(userId: string): Booking[]
export function getReviewsForSpace(spaceId: string): Review[]
export function getPromotionsForSpace(spaceId: string): Promotion[]
export function getActiveDeals(): Promotion[]
export function getOwnerForSpace(spaceId: string): User
```

- [ ] **Step 5: Verify imports work**

Run: `npx tsc --noEmit`

- [ ] **Step 6: Commit**

---

### Task 4: Zustand Stores

**Files:**
- Create: `src/store/explore-store.ts`
- Create: `src/store/space-store.ts`
- Create: `src/store/booking-store.ts`
- Create: `src/store/bid-store.ts`

- [ ] **Step 1: Create explore store**

```typescript
interface ExploreState {
  searchQuery: string
  selectedCategory: Category | null
  selectedCity: string | null
  priceRange: [number, number]
  capacityMin: number
  amenityFilters: string[]
  instantBookOnly: boolean
  offPeakOnly: boolean
  sortBy: string
  viewMode: "map" | "list" | "split"
  mapBounds: { ne: [number, number]; sw: [number, number] } | null
  // actions
  setSearchQuery: (q: string) => void
  setCategory: (c: Category | null) => void
  // ... all setters + resetFilters()
}
```

- [ ] **Step 2: Create space store with localStorage persist for shortlist**

```typescript
interface SpaceState {
  selectedSpaceId: string | null
  isDetailSheetOpen: boolean
  shortlistedIds: string[]
  // actions
  selectSpace: (id: string) => void
  closeDetail: () => void
  toggleShortlist: (id: string) => void
  isShortlisted: (id: string) => boolean
}
```

Use `zustand/middleware` `persist` for `shortlistedIds` only.

- [ ] **Step 3: Create booking store**

```typescript
interface BookingState {
  selectedDate: Date | null
  selectedTimeSlot: { start: string; end: string } | null
  promoCode: string
  promoValidation: { valid: boolean; discount: number; message: string } | null
  checkoutStep: number // 1-4 for multi-step
  // actions + calculateTotalPrice(space: Space): number
}
```

- [ ] **Step 4: Create bid store**

```typescript
interface BidState {
  proposedPrice: number
  message: string
  // actions + submitBid() + resetBid()
}
```

- [ ] **Step 5: Commit**

---

### Task 5: Theme & Font Configuration

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace Geist font with Inter in layout.tsx**

```typescript
import { Inter } from "next/font/google"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})
```

Update `<html>` className to use `inter.variable`.

- [ ] **Step 2: Update CSS custom properties in globals.css**

Add OffPeak design tokens to the `:root` block. Key additions:
- `--offpeak-teal-500: #14B8A6`
- `--offpeak-teal-600: #0D9488`
- `--offpeak-navy-950: #0F172A`

Update `--font-sans` to reference Inter. Keep shadcn's OKLCH color system but ensure the accent/primary colors map to the teal palette.

- [ ] **Step 3: Verify dark mode works via system preference**

The existing shadcn theme uses a `.dark` class with `@custom-variant dark (&:is(.dark *))`. Ensure `prefers-color-scheme` is wired: add a small script or CSS media query that applies `.dark` class to `<html>` based on system preference. The simplest approach: use `@media (prefers-color-scheme: dark)` in globals.css to set `.dark` on `:root`, or add `className="dark"` conditionally in layout. Verify shadcn component colors invert correctly.

- [ ] **Step 4: Verify dev server starts**

Run: `npm run dev` — check no CSS errors, verify both light and dark modes render.

- [ ] **Step 5: Commit**

---

### Task 6: useSimulatedQuery Hook

**Files:**
- Create: `src/hooks/use-simulated-query.ts`

- [ ] **Step 1: Create hook that wraps mock data with simulated loading delay**

```typescript
export function useSimulatedQuery<T>(
  key: string,
  queryFn: () => T,
  delay: number = 400
): { data: T | undefined; isLoading: boolean; error: Error | null }
```

Uses `useState` + `useEffect` with `setTimeout`. Returns API shape matching React Query for easy migration later.

- [ ] **Step 2: Commit**

---

## Phase 2: Layout Shell & Error Pages

### Task 7: Navbar

**Files:**
- Create: `src/components/layout/navbar.tsx`

- [ ] **Step 1: Build responsive navbar**

Desktop: OffPeak logo (left), nav links [Explore, Deals, Bookings] (center), heart icon (shortlist popover) + user avatar (right).
Mobile: Logo (left), search icon + avatar (right). Hide nav links (handled by bottom nav).

Use shadcn `Button`, `Avatar`, `Popover` components. Lucide icons: `Search`, `Heart`, `User`.

Mark active route with teal underline using `usePathname()`.

- [ ] **Step 2: Build shortlist popover content**

The heart icon in the navbar opens a `Popover` showing shortlisted spaces. Content:
- Header: "Saved Spaces ({count})"
- List of shortlisted SpaceCards (compact variant: photo thumbnail, title, price, remove button)
- Empty state: "No saved spaces yet" with "Explore" CTA
- Uses `useSpaceStore.shortlistedIds` to get IDs, look up spaces from mock data

On mobile, shortlisted spaces are accessible via the Profile tab (show as a section on a simple profile page or as a sheet triggered from profile).

- [ ] **Step 3: Verify renders at mobile and desktop**

- [ ] **Step 4: Commit**

---

### Task 8: MobileBottomNav

**Files:**
- Create: `src/components/layout/mobile-bottom-nav.tsx`

- [ ] **Step 1: Build fixed bottom tab bar (mobile only, hidden lg+)**

5 tabs: Explore (Search icon), Map (Map icon), Deals (Tag icon), Bookings (Calendar icon), Profile (User icon).

Active tab uses teal-600 color. 44px min tap targets. `role="tablist"` with proper aria.

- [ ] **Step 2: Commit**

---

### Task 9: Root Layout Integration

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add Navbar + MobileBottomNav to layout**

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-1">{children}</main>
        <MobileBottomNav />
      </body>
    </html>
  )
}
```

Add skip-to-content link before Navbar: `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to content</a>`

- [ ] **Step 2: Update metadata**

```typescript
export const metadata: Metadata = {
  title: "OffPeak Spaces | Find spaces at off-peak prices",
  description: "Discover and book underutilized spaces at discounted off-peak prices. Parking, restaurants, hotels, co-working and more.",
}
```

- [ ] **Step 3: Verify shell renders**

Run dev server, check Navbar at desktop and MobileBottomNav at mobile.

- [ ] **Step 4: Commit**

---

### Task 10: Error & Not-Found Pages

**Files:**
- Create: `src/app/error.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/spaces/[id]/not-found.tsx`

- [ ] **Step 1: Create global error boundary**

`'use client'` component with "Something went wrong" message and retry button. Per Next.js 16, error component receives `{ error, unstable_retry }` props.

- [ ] **Step 2: Create 404 pages**

Global 404: "Page not found" with link to `/explore`.
Space 404: "Space not found" with link to `/explore`.

- [ ] **Step 3: Commit**

---

## Phase 3: Common Components

### Task 11: Badges, StarRating, PriceTag

**Files:**
- Create: `src/components/common/offpeak-badge.tsx`
- Create: `src/components/common/verified-badge.tsx`
- Create: `src/components/common/star-rating.tsx`
- Create: `src/components/common/price-tag.tsx`

- [ ] **Step 1: Build OffPeakBadge**

Teal badge showing "Off-Peak -{discount}%". Uses shadcn `Badge` with teal background variant.

- [ ] **Step 2: Build VerifiedBadge**

Green badge with `ShieldCheck` icon + "Verified". Uses shadcn `Badge`.

- [ ] **Step 3: Build StarRating**

Renders 1-5 filled/empty `Star` icons with numeric rating and review count. `aria-label` reads "4.5 out of 5 stars, 23 reviews".

- [ ] **Step 4: Build PriceTag**

Shows price with optional strikethrough original and teal discounted price. `aria-label` reads full context: "Was 25 pounds, now 17.50 pounds, save 30 percent".

Props: `basePrice: number`, `discountPercent?: number`, `currency?: string`

- [ ] **Step 5: Commit**

---

### Task 12: EmptyState & SkeletonLoaders

**Files:**
- Create: `src/components/common/empty-state.tsx`
- Create: `src/components/common/skeleton-loaders.tsx`

- [ ] **Step 1: Build EmptyState**

Props: `icon: LucideIcon`, `title: string`, `description: string`, `actionLabel?: string`, `onAction?: () => void`. Centered layout with icon, text, optional CTA button.

- [ ] **Step 2: Build skeleton variants**

`SpaceCardSkeleton`, `SpaceDetailSkeleton`, `MapSkeleton`, `BookingCardSkeleton`. Use shadcn `Skeleton` component.

- [ ] **Step 3: Commit**

---

### Task 13: ShortlistButton & CountdownTimer

**Files:**
- Create: `src/components/common/shortlist-button.tsx`
- Create: `src/components/booking/countdown-timer.tsx`

- [ ] **Step 1: Build ShortlistButton**

`'use client'`. Heart icon toggle. Uses `useSpaceStore.toggleShortlist()`. Filled red when active, outline when not. `e.stopPropagation()` to prevent card click. 44px tap target.

- [ ] **Step 2: Build CountdownTimer**

`'use client'`. Props: `expiresAt: string` (ISO datetime). Displays "2h 15m 30s" countdown. Uses `useEffect` with 1-second interval. Shows "Expired" when timer hits zero.

- [ ] **Step 3: Commit**

---

## Phase 4: Landing Page

### Task 14: Hero & SearchBar

**Files:**
- Create: `src/components/layout/search-bar.tsx`
- Create: `src/components/landing/hero.tsx`

- [ ] **Step 1: Build SearchBar**

`'use client'`. Three inputs: location (text input with city suggestions from mock data), category (select from CATEGORIES), date (shadcn Calendar in popover).

Desktop: inline horizontal form. Mobile: tapping opens full-screen search sheet.

On submit, navigates to `/explore` with query params.

- [ ] **Step 2: Build Hero**

Full-width section with navy-to-teal gradient background. Headline: "Find spaces at off-peak prices". Subheading: "Parking, restaurants, hotels and more — at discounted rates". Inline SearchBar below. "Explore Spaces" CTA button.

- [ ] **Step 3: Commit**

---

### Task 15: Landing Page Components & Assembly

**Files:**
- Create: `src/components/landing/category-showcase.tsx`
- Create: `src/components/landing/how-it-works.tsx`
- Create: `src/components/landing/featured-deals.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build CategoryShowcase**

Horizontal scroll of category cards using `ScrollArea`. Each card shows category icon, label, and count of available spaces (from mock data).

- [ ] **Step 2: Build HowItWorks**

3-column grid (stacks on mobile): Search (Search icon), Book (Calendar icon), Go (MapPin icon). Each with title and short description.

- [ ] **Step 3: Build FeaturedDeals**

Grid of 3-4 SpaceCards (will reference SpaceCard from Task 17 — use placeholder div for now, replace after Task 17).

- [ ] **Step 4: Assemble landing page in page.tsx**

```tsx
export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedDeals />
      <HowItWorks />
    </>
  )
}
```

- [ ] **Step 5: Verify landing page renders**

- [ ] **Step 6: Commit**

---

## Phase 5: Explore Page (Map Hub)

### Task 16: CategoryPills, ViewToggle, ResultsCount

**Files:**
- Create: `src/components/discovery/category-pills.tsx`
- Create: `src/components/discovery/view-toggle.tsx`
- Create: `src/components/discovery/results-count.tsx`

- [ ] **Step 1: Build CategoryPills**

`'use client'`. Horizontal scroll of pill buttons using `ScrollArea` + `Toggle`. Each shows category icon + label. Active pill highlighted in teal. Updates `useExploreStore.selectedCategory`. `role="radiogroup"`.

- [ ] **Step 2: Build ViewToggle**

`'use client'`. Three toggle buttons: Map, List, Split (desktop only). Uses `useExploreStore.viewMode`. Icons: Map, List, Columns (Lucide).

- [ ] **Step 3: Build ResultsCount**

Shows "X spaces found" with active filter badges (removable chips). Uses `useExploreStore` for filter state.

- [ ] **Step 4: Commit**

---

### Task 17: SpaceCard

**Files:**
- Create: `src/components/discovery/space-card.tsx`

- [ ] **Step 1: Build SpaceCard**

Props: `space: Space`. Shows: hero photo (with fallback), title, category badge, location text, StarRating, PriceTag (with off-peak discount), OffPeakBadge (if has off-peak pricing), VerifiedBadge (if verified), ShortlistButton (absolute positioned top-right).

Card is clickable — calls `useSpaceStore.selectSpace(space.id)` and opens SpaceDetailSheet.

Responsive: Full-width on mobile, card in grid on desktop.

Use shadcn `Card`. Image uses `next/image` with Unsplash URLs.

- [ ] **Step 2: Update FeaturedDeals to use real SpaceCard**

Replace placeholder divs from Task 15.

- [ ] **Step 3: Commit**

---

### Task 18: FilterSheet

**Files:**
- Create: `src/components/discovery/filter-sheet.tsx`

- [ ] **Step 1: Build FilterSheet**

`'use client'`. Uses shadcn `Sheet` (slides from bottom on mobile, side on desktop).

Filter controls:
- **Sort by:** shadcn `Select` dropdown using `SORT_OPTIONS` from constants (Price Low-High, Price High-Low, Highest Rated, Newest). Updates `useExploreStore.sortBy`
- Price range: shadcn `Slider` (min-max)
- Capacity: shadcn `Slider` (minimum)
- Amenities: shadcn `Checkbox` group (from AMENITIES constant)
- Instant book: shadcn `Checkbox` toggle
- Off-peak only: shadcn `Checkbox` toggle

Footer: "Clear All" (ghost button) + "Apply Filters" (teal primary button).

All values read/write from `useExploreStore`.

On desktop, the sort dropdown is also rendered inline above the SpaceCard list (outside the FilterSheet) for quick access — this is handled in the explore page assembly (Task 20).

- [ ] **Step 2: Commit**

---

### Task 19: MapView (mapcn Integration)

**Files:**
- Create: `src/components/discovery/map-view.tsx`

- [ ] **Step 1: Install mapcn**

Run: Check mapcn docs at https://mapcn.vercel.app/docs for install instructions. Install the package and any peer dependencies.

- [ ] **Step 2: Build MapView**

`'use client'`. Full-height map component using mapcn's BasicMap.

Features:
- Center on UK (lat: 54.5, lng: -2, zoom: 6)
- Markers for each filtered space at their coordinates
- Each marker shows price label
- Clicking marker calls `useSpaceStore.selectSpace(id)`
- "Search this area" button when map pans
- Map bounds sync to `useExploreStore.mapBounds`

Fallback: If map fails to render, show info banner + list-only view.

- [ ] **Step 3: Commit**

---

### Task 20: Explore Page Assembly

**Files:**
- Create: `src/app/explore/page.tsx`
- Create: `src/app/explore/loading.tsx`

- [ ] **Step 1: Build explore page**

`'use client'` page (needs stores and URL sync).

**Mobile layout (< lg):**
```
[SearchBar (compact)]
[CategoryPills]
[ViewToggle]
[Map or List view (full viewport height)]
```

**Desktop layout (lg+):**
```
[SearchBar + FilterButton]
[CategoryPills]
[Left panel 40%: ResultsCount + SpaceCard list scrollable]
[Right panel 60%: MapView]
```

Integrate `nuqs` for URL param sync with explore store filters. Use `useQueryState` or `useQueryStates` from `nuqs` with typed parsers:

```typescript
import { useQueryState, parseAsString, parseAsInteger } from "nuqs"

const [category, setCategory] = useQueryState("category", parseAsString)
const [city, setCity] = useQueryState("city", parseAsString)
const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsInteger)
const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger)
```

Sync these URL params with `useExploreStore` using a `useEffect` that reads URL state into the store on mount, and writes store changes back to URL. Avoid infinite loops by comparing before updating.

Also render a sort dropdown (using shadcn `Select` with `SORT_OPTIONS`) inline above the SpaceCard list on desktop.

**Note:** `SpaceDetailSheet` will be built in Task 25. For now, render a placeholder `{/* SpaceDetailSheet goes here */}` comment. Task 25 Step 3 will wire it in.

- [ ] **Step 2: Build loading.tsx**

Use `MapSkeleton` + `SpaceCardSkeleton` grid.

- [ ] **Step 3: Verify explore page renders with mock data**

Check: categories filter, map pins, card list, view toggle.

- [ ] **Step 4: Commit**

---

## Phase 6: Space Detail

### Task 21: SpaceHeader, AmenityList, OwnerInfo

**Files:**
- Create: `src/components/detail/space-header.tsx`
- Create: `src/components/detail/amenity-list.tsx`
- Create: `src/components/detail/owner-info.tsx`

- [ ] **Step 1: Build SpaceHeader**

Displays: title (h1), category badge, location with MapPin icon, VerifiedBadge, StarRating, share button (Share2 icon), ShortlistButton.

- [ ] **Step 2: Build AmenityList**

Grid of amenity items. Each shows a Lucide icon (mapped from amenity name) + label text. 2-column grid on mobile, 3-column on desktop.

- [ ] **Step 3: Build OwnerInfo**

Uses shadcn `Avatar` + `Badge`. Shows: owner avatar, name, "Verified" badge, "Response rate: 95%", "Member since 2024". "Message Owner" button (triggers MessageOwnerSheet — placeholder for now).

- [ ] **Step 4: Commit**

---

### Task 22: ImageGallery

**Files:**
- Create: `src/components/detail/image-gallery.tsx`

- [ ] **Step 1: Build ImageGallery**

`'use client'`. Props: `photos: string[]`.

**Mobile:** Horizontal swipeable carousel with dot indicators and "X of Y" counter.
**Desktop:** Grid layout — 1 large image (left) + up to 4 thumbnails (right 2x2). "Show all photos" button if >5.

Tap/click opens lightbox (full-screen overlay with prev/next navigation and close button).

Handle missing photos: show category-specific placeholder.

All images use `next/image` with alt text: "{space.title} - Photo {index}".

- [ ] **Step 2: Commit**

---

### Task 23: PriceBreakdown & AvailabilityCalendar

**Files:**
- Create: `src/components/detail/price-breakdown.tsx`
- Create: `src/components/detail/availability-calendar.tsx`

- [ ] **Step 1: Build PriceBreakdown**

Props: `pricingRule: PricingRule`, `selectedSlot?: TimeSlot`.

Shows: base price, off-peak discount percentage, calculated off-peak price, "You save X%" in teal. Uses `aria-label` for full price context.

If a slot is selected, show calculated total for the duration.

- [ ] **Step 2: Build AvailabilityCalendar**

`'use client'`. Uses shadcn `Calendar` component.

Shows available dates from mock availability data. Off-peak slots highlighted with teal dot/background. Unavailable dates disabled/greyed. Selecting a date shows available time slots for that day as a list of buttons below the calendar.

Updates `useBookingStore.selectedDate` and `selectedTimeSlot`.

- [ ] **Step 3: Commit**

---

### Task 24: ReviewSection

**Files:**
- Create: `src/components/detail/review-section.tsx`

- [ ] **Step 1: Build ReviewSection**

Props: `reviews: Review[]`, `averageRating: number`.

Top: Average rating display (large number + StarRating + "X reviews" text).
Below: List of individual review cards. Each shows: Avatar, reviewer name, date, StarRating, comment text, owner response (if present, indented with "Owner responded:" prefix).

"Show all reviews" button if >3 reviews (expands the list).

Handle empty state: "No reviews yet" message.

- [ ] **Step 2: Commit**

---

### Task 25: SpaceDetailContent & SpaceDetailSheet

**Files:**
- Create: `src/components/detail/space-detail-content.tsx`
- Create: `src/components/detail/space-detail-sheet.tsx`

- [ ] **Step 1: Build SpaceDetailContent**

Shared content component used by both Sheet and Page. Props: `space: Space`.

Layout order:
1. ImageGallery
2. SpaceHeader
3. PriceBreakdown
4. AvailabilityCalendar
5. AmenityList
6. OwnerInfo
7. ReviewSection

Each section separated by shadcn `Separator`.

- [ ] **Step 2: Build SpaceDetailSheet**

`'use client'`. Uses shadcn `Sheet`.

**Mobile:** Full-height bottom sheet (`side="bottom"`, `className="h-[90vh]"`). Draggable handle at top.
**Desktop:** Right side panel (`side="right"`, `className="w-[500px]"`).

Renders `SpaceDetailContent` inside. Sticky footer with booking CTAs: "Book Now" button (teal) + "Make an Offer" link (if `biddingEnabled`). "Book Now" opens BookingSheet or CheckoutDialog based on spec decision logic.

Controlled by `useSpaceStore.isDetailSheetOpen`. Close sets `selectedSpaceId` to null.

- [ ] **Step 3: Wire SpaceDetailSheet into explore page**

Update `src/app/explore/page.tsx` to render `<SpaceDetailSheet />` and populate it with selected space data from mock-data.

- [ ] **Step 4: Verify: click SpaceCard → sheet opens with detail**

- [ ] **Step 5: Commit**

---

### Task 26: Standalone Space Detail Page

**Files:**
- Create: `src/app/spaces/[id]/page.tsx`
- Create: `src/app/spaces/[id]/loading.tsx`

- [ ] **Step 1: Build page with SEO metadata**

```tsx
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const space = getSpaceById(id)
  if (!space) return { title: "Space Not Found" }
  return {
    title: `${space.title} | OffPeak Spaces`,
    description: `${space.category} in ${space.location.city} — from £${offPeakPrice}/hr`,
    openGraph: { images: [space.photos[0]] },
  }
}

export default async function SpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const space = getSpaceById(id)
  if (!space) notFound()
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <SpaceDetailContent space={space} />
      <BookingCTA space={space} />
    </div>
  )
}
```

Add JSON-LD structured data (`Place` schema) in a `<script type="application/ld+json">` tag.

- [ ] **Step 2: Build loading.tsx**

Use `SpaceDetailSkeleton`.

- [ ] **Step 3: Verify page renders at `/spaces/{mock-id}`**

- [ ] **Step 4: Commit**

---

### Task 27: BookingCTA & MessageOwnerSheet

**Files:**
- Create: `src/components/detail/booking-cta.tsx`
- Create: `src/components/detail/message-owner-sheet.tsx`

- [ ] **Step 1: Build BookingCTA**

`'use client'`. Sticky bottom bar on mobile, sidebar card on desktop. Shows: off-peak price, "Book Now" button, "Make an Offer" link (if bidding enabled). Opens BookingSheet or CheckoutDialog (placeholder handlers for now — will wire in Phase 7).

- [ ] **Step 2: Build MessageOwnerSheet**

`'use client'`. Uses shadcn `Sheet`. Simple form: name input, email input, message textarea, send button. On submit, show success toast (mock — no real send).

- [ ] **Step 3: Commit**

---

## Phase 7: Booking & Bidding Flows

### Task 28: BookingSheet (Quick-Book)

**Files:**
- Create: `src/components/booking/booking-sheet.tsx`

- [ ] **Step 1: Build quick-book sheet**

`'use client'`. Uses shadcn `Sheet`. Single-step flow:

1. Shows space name + photo thumbnail
2. Date/time selection (pre-filled from AvailabilityCalendar if already selected)
3. PriceBreakdown (showing off-peak discount)
4. "Have a promo code?" link → switches to CheckoutDialog
5. "Confirm Booking" button (teal, full-width)

On confirm: adds booking to mock data, opens BookingConfirmationDialog.

Uses `useBookingStore` for state.

- [ ] **Step 2: Commit**

---

### Task 29: QRCodeDisplay, CalendarSyncButton, PromoCodeInput

**Files:**
- Create: `src/components/booking/qr-code-display.tsx`
- Create: `src/components/booking/calendar-sync-button.tsx`
- Create: `src/components/booking/promo-code-input.tsx`

- [ ] **Step 1: Build QRCodeDisplay**

`'use client'`. Props: `value: string`. Generates a simple QR code as SVG. Use a lightweight approach — encode as a grid pattern or install `qrcode` package. Display with booking ID encoded.

- [ ] **Step 2: Build CalendarSyncButton**

`'use client'`. Props: `booking: Booking, space: Space`. Generates an `.ics` file content and triggers download. Button text: "Add to Calendar" with Calendar icon.

- [ ] **Step 3: Build PromoCodeInput**

`'use client'`. Text input + "Apply" button. On apply, validates against mock promo codes. Shows success (green text + discount amount) or error (red text + "Invalid code"). Updates `useBookingStore.promoCode` and `promoValidation`.

- [ ] **Step 4: Commit**

---

### Task 30: CheckoutDialog (Multi-Step)

**Files:**
- Create: `src/components/booking/checkout-dialog.tsx`

- [ ] **Step 1: Build 4-step checkout dialog**

`'use client'`. Uses shadcn `Dialog`. Progress indicator at top (4 dots/steps).

**Step 1 - Select Slot:** AvailabilityCalendar (compact) + time slot buttons.
**Step 2 - Add Promo:** PromoCodeInput + live PriceBreakdown. "Skip" link to proceed without promo.
**Step 3 - Review:** Space summary, date/time, full PriceBreakdown, cancellation terms text, mock payment method display ("Visa ending 4242").
**Step 4 - Confirmation:** Reuses BookingConfirmationDialog content.

Navigation: "Back" + "Next"/"Confirm" buttons. Step 4 has "Done" button that closes dialog.

Uses `useBookingStore.checkoutStep` for navigation.

- [ ] **Step 2: Commit**

---

### Task 31: BookingConfirmationDialog

**Files:**
- Create: `src/components/booking/booking-confirmation-dialog.tsx`

- [ ] **Step 1: Build confirmation dialog**

`'use client'`. Uses shadcn `Dialog`. Shows:
- Success checkmark icon (green)
- "Booking Confirmed!" heading
- Space name + photo thumbnail
- Date/time
- Total price paid (or "Free" for promo-covered)
- QRCodeDisplay with booking ID
- CalendarSyncButton
- "Get Directions" link (opens Google Maps with space coordinates)
- "View Booking" link → `/bookings`
- "Done" button closes dialog

- [ ] **Step 2: Wire booking flows together**

Connect BookingSheet → BookingConfirmationDialog.
Connect CheckoutDialog step 4 → BookingConfirmationDialog content.
Update BookingCTA to open correct flow based on decision logic.

- [ ] **Step 3: Verify Journey 1: Search → SpaceCard → Detail → Book → QR**

- [ ] **Step 4: Commit**

---

### Task 32: BidSheet & BidStatusCard

**Files:**
- Create: `src/components/booking/bid-sheet.tsx`
- Create: `src/components/booking/bid-status-card.tsx`

- [ ] **Step 1: Build BidSheet**

`'use client'`. Uses shadcn `Sheet`. Form:
- "Your Offer" price input (number, with minimum threshold validation from space's pricing rule `minPrice`)
- Message textarea (optional, placeholder: "Tell the owner about your plans...")
- Bid expiry display: "Bid expires in 48 hours"
- "Submit Offer" button

On submit: creates mock bid entry, shows success toast, adds to bookings page.

Uses `useBidStore`.

- [ ] **Step 2: Build BidStatusCard**

Props: `bid: Bid, space: Space`. Shows: space photo + name, bid amount, status badge (color-coded: PENDING=amber, ACCEPTED=green, COUNTERED=blue, REJECTED=red, EXPIRED=gray), counter price if countered, action CTAs ("Accept Counter", "Browse Alternatives").

- [ ] **Step 3: Wire BidSheet into SpaceDetailSheet "Make an Offer" button**

- [ ] **Step 4: Verify Journey 2: Find listing → Make offer → See status in bookings**

- [ ] **Step 5: Commit**

---

## Phase 8: Deals & Bookings Pages

### Task 33: Deal Components

**Files:**
- Create: `src/components/deals/flash-deal-card.tsx`
- Create: `src/components/deals/promo-card.tsx`
- Create: `src/components/deals/promo-terms-card.tsx`
- Create: `src/components/deals/deals-filter-tabs.tsx`

- [ ] **Step 1: Build FlashDealCard**

`'use client'`. Extends SpaceCard with: CountdownTimer overlay, urgency banner ("Ends in 2h!"), flash bolt icon. When expired, card greys out with "Expired" badge and disabled CTA.

Click opens SpaceDetailSheet with the space.

- [ ] **Step 2: Build PromoCard**

Props: `promotion: Promotion, space: Space`. Shows: space photo, deal headline, discount amount or "FREE", terms summary, "Book Now" CTA. Different styling for FREEBIE (green accent) vs DISCOUNT (teal accent).

- [ ] **Step 3: Build PromoTermsCard**

Full terms and conditions display in a collapsible section. Shows: valid dates, redemption method, conditions, maximum uses.

- [ ] **Step 4: Build DealsFilterTabs**

`'use client'`. Tab buttons: All, Flash Deals, Free Offers, Discounts. Uses shadcn `Tabs`. Filters the deals list.

- [ ] **Step 5: Commit**

---

### Task 34: Deals Page

**Files:**
- Create: `src/app/deals/page.tsx`
- Create: `src/app/deals/loading.tsx`

- [ ] **Step 1: Build deals page**

Layout:
1. Page header: "Deals & Offers" with subtitle
2. DealsFilterTabs
3. Flash Deals section (if any active): horizontal scroll of FlashDealCards
4. Promotions grid: PromoCards in responsive grid (1 col mobile, 2 col md, 3 col lg)

Static metadata: `title: "Deals & Flash Offers | OffPeak Spaces"`

Empty state per filter tab.

- [ ] **Step 2: Build loading.tsx skeleton**

- [ ] **Step 3: Verify Journeys 3 & 6: Browse deals → tap → book**

- [ ] **Step 4: Commit**

---

### Task 35: Booking History Components

**Files:**
- Create: `src/components/booking/booking-card.tsx`
- Create: `src/components/bookings/bookings-tab-filter.tsx`

- [ ] **Step 1: Build BookingCard**

Props: `booking: Booking, space: Space`. Shows: space photo, space name, date/time, total price, status badge (color-coded: CONFIRMED=green, COMPLETED=gray, CANCELLED=red, PENDING=amber). Click expands to show QR code + details.

- [ ] **Step 2: Build BookingsTabFilter**

`'use client'`. Tabs: Upcoming, Past, Cancelled, Bids. Uses shadcn `Tabs`. Filters booking list by status.

- [ ] **Step 3: Commit**

---

### Task 36: Bookings Page

**Files:**
- Create: `src/app/bookings/page.tsx`
- Create: `src/app/bookings/loading.tsx`

- [ ] **Step 1: Build bookings page**

Layout:
1. Page header: "My Bookings"
2. BookingsTabFilter
3. Filtered list of BookingCards + BidStatusCards (for Bids tab)

Metadata: `robots: "noindex"` (private content).

Empty states per tab: "No upcoming bookings" with "Explore Spaces" CTA, etc.

- [ ] **Step 2: Build loading.tsx skeleton**

- [ ] **Step 3: Verify: booking appears after completing a booking flow**

- [ ] **Step 4: Commit**

---

## Phase 9: Polish & Verification

### Task 37: Framer Motion Animations

**Files:**
- Modify: Multiple component files

- [ ] **Step 1: Add page transitions**

Wrap page content in `motion.div` with fade-in: `initial={{ opacity: 0 }}, animate={{ opacity: 1 }}, transition={{ duration: 0.2 }}`.

- [ ] **Step 2: Add SpaceCard stagger animation**

In list view, wrap card grid in `motion.div` with `staggerChildren: 0.05`. Each card: `initial={{ opacity: 0, y: 20 }}, animate={{ opacity: 1, y: 0 }}`.

- [ ] **Step 3: Add card hover effect**

On desktop, SpaceCard gets `whileHover={{ y: -4 }}` with shadow transition.

- [ ] **Step 4: Commit**

---

### Task 38: End-to-End Journey Verification

**Files:** None (verification only)

- [ ] **Step 1: Start dev server and preview**

Run: `npm run dev`

- [ ] **Step 2: Walk through Journey 1 (Find & Book Parking)**

Landing → Explore → select "Parking" category → see filtered results on map → tap card → detail sheet opens → select date/time → Book Now → confirmation with QR.

- [ ] **Step 3: Walk through Journey 2 (Submit Bid)**

Explore → find bid-enabled listing → detail sheet → "Make an Offer" → fill bid → submit → check Bookings page → see BidStatusCard.

- [ ] **Step 4: Walk through Journey 3 (Flash Deal)**

Deals page → see flash deals with countdown → tap → detail sheet → quick book → confirmation.

- [ ] **Step 5: Walk through Journey 4 (Promo Code)**

Detail sheet → Book Now → "Have a promo code?" → enter "OFFPEAK25" → price recalculates → review → confirm → QR.

- [ ] **Step 6: Walk through Journey 5 (Venue Discovery)**

Explore → advanced filters (capacity 50+, amenities) → view results → shortlist → detail → message owner.

- [ ] **Step 7: Walk through Journey 6 (Free Offer)**

Deals → filter "Free Offers" → view terms → book → confirmation with redemption QR.

- [ ] **Step 8: Responsive check at all breakpoints**

Preview at: 375px, 768px, 1024px, 1280px. Verify layout changes per spec section 10.

- [ ] **Step 9: Accessibility spot-check**

Tab through all interactive elements. Verify focus rings. Check teal contrast usage. Verify aria-labels on prices and ratings.

- [ ] **Step 10: Final commit**

```bash
git add -A
git commit -m "feat: complete Space Seeker sub-project implementation

Implements all 6 user journeys:
- Find & Book Parking (instant book)
- Submit a Bid
- Flash Deal booking
- Promo Code checkout
- Venue Discovery with shortlisting
- Free Offer redemption

Includes: landing page, map-centric explore, modal-driven
detail/booking/bidding, deals feed, booking history."
```

---

## Task Dependency Graph

```
Phase 1: [T1] → [T2] → [T3] → [T4] → [T5, T6]
Phase 2: [T7, T8] → [T9] → [T10]
Phase 3: [T11, T12, T13] (parallel, after T1)
Phase 4: [T14] → [T15] (after T11)
Phase 5: [T16, T17, T18] → [T19] → [T20] (after T3, T11)
Phase 6: [T21, T22, T23, T24] → [T25] → [T26, T27] (after T20)
Phase 7: [T28, T29] → [T30] → [T31] → [T32] (after T25)
Phase 8: [T33] → [T34] and [T35] → [T36] (after T31, T32)
Phase 9: [T37] → [T38] (after everything)
```

**Parallelizable groups:**
- T7 + T8 (layout components)
- T11 + T12 + T13 (common components)
- T16 + T17 + T18 (discovery components)
- T21 + T22 + T23 + T24 (detail components)
- T28 + T29 (booking sub-components)
- T33 + T35 (deal + booking history components)
