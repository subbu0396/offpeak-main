import type {
  Space,
  User,
  PricingRule,
  Availability,
  Booking,
  Promotion,
  Review,
  Category,
} from "@/types"

// ---------------------------------------------------------------------------
// Mock Owners (6 users with role "OWNER")
// ---------------------------------------------------------------------------

export const MOCK_OWNERS: User[] = [
  {
    id: "owner-001",
    name: "Sarah Okafor",
    email: "sarah.okafor@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: "OWNER",
    phone: "+44 7700 100001",
    verificationStatus: "VERIFIED",
    createdAt: "2024-11-01T09:00:00Z",
  },
  {
    id: "owner-002",
    name: "James Whitfield",
    email: "james.whitfield@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    role: "OWNER",
    phone: "+44 7700 100002",
    verificationStatus: "VERIFIED",
    createdAt: "2024-10-15T09:00:00Z",
  },
  {
    id: "owner-003",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop",
    role: "OWNER",
    phone: "+44 7700 100003",
    verificationStatus: "VERIFIED",
    createdAt: "2024-09-20T09:00:00Z",
  },
  {
    id: "owner-004",
    name: "Marcus Chen",
    email: "marcus.chen@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    role: "OWNER",
    phone: "+44 7700 100004",
    verificationStatus: "VERIFIED",
    createdAt: "2024-08-05T09:00:00Z",
  },
  {
    id: "owner-005",
    name: "Fiona MacLeod",
    email: "fiona.macleod@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    role: "OWNER",
    phone: "+44 7700 100005",
    verificationStatus: "PENDING",
    createdAt: "2025-01-10T09:00:00Z",
  },
  {
    id: "owner-006",
    name: "David Osei",
    email: "david.osei@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop",
    role: "OWNER",
    phone: "+44 7700 100006",
    verificationStatus: "VERIFIED",
    createdAt: "2024-12-01T09:00:00Z",
  },
]

// ---------------------------------------------------------------------------
// 18 Mock Spaces
// ---------------------------------------------------------------------------

export const MOCK_SPACES: Space[] = [
  // --- London (6) ---

  // 1. Shoreditch Parking (owner-001)
  {
    id: "space-001",
    ownerId: "owner-001",
    title: "Shoreditch Secure Parking - Off-Peak Spaces",
    description:
      "Gated, CCTV-monitored car park just off Brick Lane. Perfect for creatives and weekend visitors wanting to avoid street parking stress. EV charging bays available, with disabled access ramps throughout.",
    category: "PARKING",
    photos: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&h=600&fit=crop",
    ],
    capacity: 4,
    amenities: ["EV Charging", "CCTV", "Disabled Access", "24/7 Access"],
    location: {
      lat: 51.5234,
      lng: -0.0716,
      address: "14 Redchurch Street",
      city: "London",
      postcode: "E1 6JL",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.7,
    reviewCount: 31,
    instantBook: true,
    biddingEnabled: false,
    createdAt: "2025-02-01T10:00:00Z",
  },

  // 2. Clerkenwell Co-working (owner-001)
  {
    id: "space-002",
    ownerId: "owner-001",
    title: "Clerkenwell Creative Co-Working Hub",
    description:
      "Bright, open-plan co-working desks in a converted Victorian warehouse near Farringdon station. Off-peak rates from mid-morning to late afternoon make it ideal for freelancers on flexible schedules. High-speed Wi-Fi and standing-desk options included.",
    category: "CO_WORKING",
    photos: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
    ],
    capacity: 20,
    amenities: ["Wi-Fi", "Air Conditioning", "Kitchen", "Toilets", "Reception"],
    location: {
      lat: 51.5223,
      lng: -0.1027,
      address: "27 Clerkenwell Close",
      city: "London",
      postcode: "EC1R 0AT",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.8,
    reviewCount: 47,
    instantBook: true,
    biddingEnabled: false,
    createdAt: "2025-01-15T10:00:00Z",
  },

  // 3. Soho Restaurant (owner-002)
  {
    id: "space-003",
    ownerId: "owner-002",
    title: "Soho Bistro - Private Dining & Off-Peak Tables",
    description:
      "Stylish Soho restaurant available for private hire during off-peak afternoon sessions. Ideal for corporate lunches, birthday dinners, or casual catch-ups with friends. Full kitchen facilities and a curated wine list available for pre-booked groups.",
    category: "RESTAURANT",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&h=600&fit=crop",
    ],
    capacity: 45,
    amenities: ["Kitchen", "Air Conditioning", "Toilets", "Disabled Access", "Catering"],
    location: {
      lat: 51.5136,
      lng: -0.1340,
      address: "9 Frith Street",
      city: "London",
      postcode: "W1D 3JE",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.5,
    reviewCount: 22,
    instantBook: false,
    biddingEnabled: true,
    createdAt: "2025-01-20T10:00:00Z",
  },

  // 4. Camden Bar (owner-002)
  {
    id: "space-004",
    ownerId: "owner-002",
    title: "Camden Lock Bar - Daytime Private Hire",
    description:
      "Iconic Camden bar with exposed brick, a full sound system, and a stage area available for private events during off-peak daytime slots. Fits up to 60 guests for standing receptions or 35 seated. Great for product launches, birthdays, and live performances.",
    category: "BAR",
    photos: [
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop",
    ],
    capacity: 60,
    amenities: ["Sound System", "Toilets", "Kitchen", "Outdoor Area", "Security"],
    location: {
      lat: 51.5390,
      lng: -0.1426,
      address: "12 Chalk Farm Road",
      city: "London",
      postcode: "NW1 8AB",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.3,
    reviewCount: 18,
    instantBook: false,
    biddingEnabled: true,
    createdAt: "2025-02-10T10:00:00Z",
  },

  // 5. Notting Hill Coffee Shop (owner-003)
  {
    id: "space-005",
    ownerId: "owner-003",
    title: "Notting Hill Coffee Shop - Quiet Working Sessions",
    description:
      "Charming independent coffee shop on Portobello Road, available for focused work or small group meetings during quiet mid-morning and afternoon slots. Freshly brewed specialty coffee included with every booking. Perfect for one-to-one meetings or remote working days.",
    category: "COFFEE_SHOP",
    photos: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
    ],
    capacity: 12,
    amenities: ["Wi-Fi", "Kitchen", "Toilets", "Air Conditioning"],
    location: {
      lat: 51.5150,
      lng: -0.2015,
      address: "63 Portobello Road",
      city: "London",
      postcode: "W11 2QB",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.9,
    reviewCount: 39,
    instantBook: true,
    biddingEnabled: false,
    createdAt: "2025-01-05T10:00:00Z",
  },

  // 6. Canary Wharf Function Room (owner-003)
  {
    id: "space-006",
    ownerId: "owner-003",
    title: "Canary Wharf Function Room - Premium Events Space",
    description:
      "Sleek corporate function room on the 14th floor with panoramic Thames views. Available for off-peak hire including daytime conferences, team away-days, and evening celebrations. Fully equipped with AV, catering facilities, and a dedicated reception team.",
    category: "FUNCTION_ROOM",
    photos: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop",
    ],
    capacity: 80,
    amenities: ["Projector", "Air Conditioning", "Catering", "Toilets", "Reception", "Disabled Access"],
    location: {
      lat: 51.5054,
      lng: -0.0235,
      address: "1 Canada Square",
      city: "London",
      postcode: "E14 5AB",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.6,
    reviewCount: 14,
    instantBook: true,
    biddingEnabled: false,
    createdAt: "2025-03-01T10:00:00Z",
  },

  // --- Manchester (4) ---

  // 7. Manchester Parking (owner-004)
  {
    id: "space-007",
    ownerId: "owner-004",
    title: "Northern Quarter Secure Parking",
    description:
      "Safe, well-lit parking bays in Manchester's Northern Quarter, steps from the Arndale Centre. Ideal for shoppers and gig-goers wanting affordable city-centre parking at off-peak rates. Height restriction 2.1m; CCTV monitored 24/7.",
    category: "PARKING",
    photos: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555426984-33e5f14b4e24?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&h=600&fit=crop",
    ],
    capacity: 3,
    amenities: ["CCTV", "24/7 Access", "Disabled Access"],
    location: {
      lat: 53.4831,
      lng: -2.2352,
      address: "18 Dale Street",
      city: "Manchester",
      postcode: "M1 1EZ",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.4,
    reviewCount: 27,
    instantBook: true,
    biddingEnabled: false,
    createdAt: "2025-01-20T10:00:00Z",
  },

  // 8. Manchester Function Room (owner-004)
  {
    id: "space-008",
    ownerId: "owner-004",
    title: "Manchester City Centre Function Suite",
    description:
      "Modern function suite in the heart of Manchester city centre, ideal for conferences, workshops, and networking events. Full AV setup, catering kitchen, and a dedicated events coordinator on hand. Off-peak daytime rates represent significant savings versus weekend pricing.",
    category: "FUNCTION_ROOM",
    photos: [
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    ],
    capacity: 50,
    amenities: ["Projector", "Wi-Fi", "Air Conditioning", "Catering", "Toilets", "Reception"],
    location: {
      lat: 53.4808,
      lng: -2.2426,
      address: "5 Peter Street",
      city: "Manchester",
      postcode: "M2 5QR",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.2,
    reviewCount: 11,
    instantBook: false,
    biddingEnabled: true,
    createdAt: "2025-02-05T10:00:00Z",
  },

  // 9. Manchester Restaurant (owner-004)
  {
    id: "space-009",
    ownerId: "owner-004",
    title: "Ancoats Restaurant - Exclusive Hire Afternoons",
    description:
      "Award-winning Ancoats restaurant offering exclusive hire during quiet afternoon sessions. The intimate 35-cover space is perfect for private dining events, team lunches, and celebratory meals. Chef-curated menus available at additional cost.",
    category: "RESTAURANT",
    photos: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&h=600&fit=crop",
    ],
    capacity: 35,
    amenities: ["Kitchen", "Catering", "Toilets", "Air Conditioning", "Disabled Access"],
    location: {
      lat: 53.4841,
      lng: -2.2293,
      address: "44 Blossom Street",
      city: "Manchester",
      postcode: "M4 6BF",
    },
    status: "ACTIVE",
    isVerified: false,
    rating: 4.1,
    reviewCount: 8,
    instantBook: false,
    biddingEnabled: true,
    createdAt: "2025-03-01T10:00:00Z",
  },

  // 10. Manchester Co-working (owner-005)
  {
    id: "space-010",
    ownerId: "owner-005",
    title: "Spinningfields Co-Working Desks",
    description:
      "Quiet, professional co-working desks within a premium Spinningfields office building. Access to shared meeting rooms and a well-stocked kitchen. Off-peak pricing applies from 10:00–16:00 on weekdays — ideal for professionals on hybrid schedules.",
    category: "CO_WORKING",
    photos: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&h=600&fit=crop",
    ],
    capacity: 15,
    amenities: ["Wi-Fi", "Kitchen", "Air Conditioning", "Toilets", "Projector"],
    location: {
      lat: 53.4795,
      lng: -2.2496,
      address: "3 Hardman Street",
      city: "Manchester",
      postcode: "M3 3HF",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.6,
    reviewCount: 19,
    instantBook: true,
    biddingEnabled: false,
    createdAt: "2025-02-15T10:00:00Z",
  },

  // --- Birmingham (3) ---

  // 11. Birmingham Hotel Room (owner-005)
  {
    id: "space-011",
    ownerId: "owner-005",
    title: "Jewellery Quarter Boutique Hotel Room",
    description:
      "Well-appointed en-suite room in a boutique hotel in Birmingham's Jewellery Quarter, available for day-use bookings during off-peak hours. Ideal for remote workers needing a quiet, private space, or overnight guests at discounted weekday rates. Breakfast available on request.",
    category: "HOTEL_ROOM",
    photos: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop",
    ],
    capacity: 2,
    amenities: ["Wi-Fi", "Air Conditioning", "Toilets", "Disabled Access", "Reception"],
    location: {
      lat: 52.4862,
      lng: -1.9074,
      address: "7 Vyse Street",
      city: "Birmingham",
      postcode: "B1 3HG",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.4,
    reviewCount: 16,
    instantBook: true,
    biddingEnabled: false,
    createdAt: "2025-01-25T10:00:00Z",
  },

  // 12. Birmingham Event Venue (owner-005)
  {
    id: "space-012",
    ownerId: "owner-005",
    title: "Digbeth Creative Event Venue",
    description:
      "Large, flexible event space in Birmingham's creative quarter, Digbeth. The 200 sq-metre blank canvas venue suits exhibitions, product launches, pop-ups, and performances. Full sound system, configurable lighting, and a loading bay for props and equipment.",
    category: "EVENT_VENUE",
    photos: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=800&h=600&fit=crop",
    ],
    capacity: 120,
    amenities: ["Sound System", "Projector", "Toilets", "Disabled Access", "Security", "Outdoor Area"],
    location: {
      lat: 52.4751,
      lng: -1.8900,
      address: "22 Heath Mill Lane",
      city: "Birmingham",
      postcode: "B9 4AL",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.7,
    reviewCount: 23,
    instantBook: false,
    biddingEnabled: true,
    createdAt: "2025-01-10T10:00:00Z",
  },

  // 13. Birmingham Parking (owner-006)
  {
    id: "space-013",
    ownerId: "owner-006",
    title: "Birmingham City Centre Parking Bay",
    description:
      "Convenient parking bays located moments from New Street Station. Ideal for commuters and shoppers looking for reliable, affordable city-centre parking at off-peak rates. Fully monitored with CCTV and keypad entry.",
    category: "PARKING",
    photos: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&h=600&fit=crop",
    ],
    capacity: 5,
    amenities: ["CCTV", "Disabled Access", "24/7 Access"],
    location: {
      lat: 52.4784,
      lng: -1.8988,
      address: "40 Station Street",
      city: "Birmingham",
      postcode: "B2 4JT",
    },
    status: "ACTIVE",
    isVerified: false,
    rating: 3.9,
    reviewCount: 7,
    instantBook: true,
    biddingEnabled: false,
    createdAt: "2025-03-05T10:00:00Z",
  },

  // --- Bristol (2) ---

  // 14. Bristol Coffee Shop (owner-006)
  {
    id: "space-014",
    ownerId: "owner-006",
    title: "Clifton Village Coffee Shop - Morning Work Sessions",
    description:
      "Sun-drenched specialty coffee shop in the heart of Clifton Village, available for quiet work sessions before the lunchtime rush. Enjoy barista-made flat whites and freshly baked pastries while you work. Perfect for freelancers and remote teams.",
    category: "COFFEE_SHOP",
    photos: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=600&fit=crop",
    ],
    capacity: 10,
    amenities: ["Wi-Fi", "Kitchen", "Toilets"],
    location: {
      lat: 51.4583,
      lng: -2.6174,
      address: "12 Princess Victoria Street",
      city: "Bristol",
      postcode: "BS8 4BX",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.8,
    reviewCount: 33,
    instantBook: true,
    biddingEnabled: false,
    createdAt: "2025-02-20T10:00:00Z",
  },

  // 15. Bristol Bar (owner-006)
  {
    id: "space-015",
    ownerId: "owner-006",
    title: "Stokes Croft Bar - Afternoon Private Hire",
    description:
      "Vibrant bar in Bristol's Stokes Croft arts district, available for private hire during daytime off-peak hours. The space seats 40 and has a large outdoor terrace. A great fit for birthday parties, creative workshops, and pop-up events.",
    category: "BAR",
    photos: [
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop",
    ],
    capacity: 40,
    amenities: ["Sound System", "Outdoor Area", "Toilets", "Kitchen"],
    location: {
      lat: 51.4642,
      lng: -2.5908,
      address: "88 Cheltenham Road",
      city: "Bristol",
      postcode: "BS6 5JX",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.2,
    reviewCount: 12,
    instantBook: false,
    biddingEnabled: true,
    createdAt: "2025-02-28T10:00:00Z",
  },

  // --- Edinburgh (2) ---

  // 16. Edinburgh Restaurant (owner-001)
  {
    id: "space-016",
    ownerId: "owner-001",
    title: "Old Town Restaurant - Daytime Exclusive Hire",
    description:
      "Atmospheric Edinburgh restaurant in a Georgian townhouse, steps from the Royal Mile. Available for exclusive daytime hire between lunch and dinner service. Seats 28 for private dining with optional Scottish tasting menu available from the head chef.",
    category: "RESTAURANT",
    photos: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&h=600&fit=crop",
    ],
    capacity: 28,
    amenities: ["Kitchen", "Catering", "Toilets", "Air Conditioning"],
    location: {
      lat: 55.9497,
      lng: -3.1887,
      address: "3 Cockburn Street",
      city: "Edinburgh",
      postcode: "EH1 1BP",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.6,
    reviewCount: 20,
    instantBook: false,
    biddingEnabled: true,
    createdAt: "2025-01-30T10:00:00Z",
  },

  // 17. Edinburgh Co-working (owner-002)
  {
    id: "space-017",
    ownerId: "owner-002",
    title: "New Town Co-Working Studio",
    description:
      "Elegant co-working studio in Edinburgh's New Town, housed in a beautifully restored Georgian building. Desks are available at discounted off-peak rates from mid-morning. Includes access to a private phone booth, well-equipped kitchen, and weekly networking events.",
    category: "CO_WORKING",
    photos: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
    ],
    capacity: 25,
    amenities: ["Wi-Fi", "Kitchen", "Air Conditioning", "Toilets", "Reception"],
    location: {
      lat: 55.9533,
      lng: -3.2010,
      address: "15 Frederick Street",
      city: "Edinburgh",
      postcode: "EH2 2HB",
    },
    status: "ACTIVE",
    isVerified: true,
    rating: 4.5,
    reviewCount: 17,
    instantBook: true,
    biddingEnabled: false,
    createdAt: "2025-02-12T10:00:00Z",
  },

  // --- Leeds (1) ---

  // 18. Leeds Parking (owner-002)
  {
    id: "space-018",
    ownerId: "owner-002",
    title: "Leeds City Centre Parking - LS1",
    description:
      "Affordable city-centre parking bays near Leeds train station, ideal for commuters arriving after the morning peak. CCTV-secured with level access. Off-peak rates apply 09:30–16:00 Monday to Friday and all day at weekends.",
    category: "PARKING",
    photos: [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    ],
    capacity: 2,
    amenities: ["CCTV", "24/7 Access", "Disabled Access"],
    location: {
      lat: 53.7960,
      lng: -1.5478,
      address: "2 Wellington Street",
      city: "Leeds",
      postcode: "LS1 4LT",
    },
    status: "ACTIVE",
    isVerified: false,
    rating: 3.8,
    reviewCount: 5,
    instantBook: true,
    biddingEnabled: false,
    createdAt: "2025-03-10T10:00:00Z",
  },
]

// ---------------------------------------------------------------------------
// Pricing Rules (one per space)
// ---------------------------------------------------------------------------

export const MOCK_PRICING: PricingRule[] = [
  { id: "price-001", spaceId: "space-001", basePrice: 6,   currency: "GBP", offPeakDiscount: 25, occupancyThreshold: 70, occupancyDiscount: 10, autoApply: true,  minPrice: 3   },
  { id: "price-002", spaceId: "space-002", basePrice: 18,  currency: "GBP", offPeakDiscount: 25, occupancyThreshold: 60, occupancyDiscount: 10, autoApply: true,  minPrice: 9   },
  { id: "price-003", spaceId: "space-003", basePrice: 35,  currency: "GBP", offPeakDiscount: 35, occupancyThreshold: 50, occupancyDiscount: 15, autoApply: false, minPrice: 18  },
  { id: "price-004", spaceId: "space-004", basePrice: 50,  currency: "GBP", offPeakDiscount: 30, occupancyThreshold: 50, occupancyDiscount: 10, autoApply: false, minPrice: 25  },
  { id: "price-005", spaceId: "space-005", basePrice: 14,  currency: "GBP", offPeakDiscount: 30, occupancyThreshold: 60, occupancyDiscount: 10, autoApply: true,  minPrice: 7   },
  { id: "price-006", spaceId: "space-006", basePrice: 150, currency: "GBP", offPeakDiscount: 40, occupancyThreshold: 40, occupancyDiscount: 15, autoApply: true,  minPrice: 75  },
  { id: "price-007", spaceId: "space-007", basePrice: 4,   currency: "GBP", offPeakDiscount: 20, occupancyThreshold: 70, occupancyDiscount: 10, autoApply: true,  minPrice: 2   },
  { id: "price-008", spaceId: "space-008", basePrice: 100, currency: "GBP", offPeakDiscount: 35, occupancyThreshold: 40, occupancyDiscount: 15, autoApply: false, minPrice: 50  },
  { id: "price-009", spaceId: "space-009", basePrice: 28,  currency: "GBP", offPeakDiscount: 30, occupancyThreshold: 50, occupancyDiscount: 10, autoApply: false, minPrice: 14  },
  { id: "price-010", spaceId: "space-010", basePrice: 15,  currency: "GBP", offPeakDiscount: 25, occupancyThreshold: 60, occupancyDiscount: 10, autoApply: true,  minPrice: 8   },
  { id: "price-011", spaceId: "space-011", basePrice: 65,  currency: "GBP", offPeakDiscount: 35, occupancyThreshold: 50, occupancyDiscount: 10, autoApply: true,  minPrice: 32  },
  { id: "price-012", spaceId: "space-012", basePrice: 175, currency: "GBP", offPeakDiscount: 45, occupancyThreshold: 40, occupancyDiscount: 15, autoApply: false, minPrice: 90  },
  { id: "price-013", spaceId: "space-013", basePrice: 5,   currency: "GBP", offPeakDiscount: 20, occupancyThreshold: 70, occupancyDiscount: 10, autoApply: true,  minPrice: 2.5 },
  { id: "price-014", spaceId: "space-014", basePrice: 10,  currency: "GBP", offPeakDiscount: 30, occupancyThreshold: 60, occupancyDiscount: 10, autoApply: true,  minPrice: 5   },
  { id: "price-015", spaceId: "space-015", basePrice: 40,  currency: "GBP", offPeakDiscount: 25, occupancyThreshold: 50, occupancyDiscount: 10, autoApply: false, minPrice: 20  },
  { id: "price-016", spaceId: "space-016", basePrice: 40,  currency: "GBP", offPeakDiscount: 30, occupancyThreshold: 50, occupancyDiscount: 10, autoApply: false, minPrice: 20  },
  { id: "price-017", spaceId: "space-017", basePrice: 22,  currency: "GBP", offPeakDiscount: 25, occupancyThreshold: 60, occupancyDiscount: 10, autoApply: true,  minPrice: 11  },
  { id: "price-018", spaceId: "space-018", basePrice: 3,   currency: "GBP", offPeakDiscount: 20, occupancyThreshold: 70, occupancyDiscount: 10, autoApply: true,  minPrice: 1.5 },
]

// ---------------------------------------------------------------------------
// Availability (7 days per space — day 0 = Sunday … 6 = Saturday)
// ---------------------------------------------------------------------------

function makeAvailability(
  spaceId: string,
  idPrefix: string,
  weekdayConfig: { start: string; end: string; offPeakStart: string; offPeakEnd: string },
  weekendConfig: { available: boolean; start: string; end: string }
): Availability[] {
  const entries: Availability[] = []

  // Weekdays Mon–Fri (dayOfWeek 1–5): two slots (peak then off-peak window)
  for (let day = 1; day <= 5; day++) {
    // Full available slot
    entries.push({
      id: `${idPrefix}-d${day}-a`,
      spaceId,
      dayOfWeek: day,
      startTime: weekdayConfig.start,
      endTime: weekdayConfig.offPeakStart,
      isOffPeak: false,
      isAvailable: true,
      blackoutDates: [],
    })
    // Off-peak window
    entries.push({
      id: `${idPrefix}-d${day}-b`,
      spaceId,
      dayOfWeek: day,
      startTime: weekdayConfig.offPeakStart,
      endTime: weekdayConfig.offPeakEnd,
      isOffPeak: true,
      isAvailable: true,
      blackoutDates: [],
    })
    // Remaining peak after off-peak
    entries.push({
      id: `${idPrefix}-d${day}-c`,
      spaceId,
      dayOfWeek: day,
      startTime: weekdayConfig.offPeakEnd,
      endTime: weekdayConfig.end,
      isOffPeak: false,
      isAvailable: true,
      blackoutDates: [],
    })
  }

  // Saturday (6) and Sunday (0)
  for (const day of [6, 0]) {
    entries.push({
      id: `${idPrefix}-d${day}`,
      spaceId,
      dayOfWeek: day,
      startTime: weekendConfig.available ? weekendConfig.start : "00:00",
      endTime: weekendConfig.available ? weekendConfig.end : "00:00",
      isOffPeak: weekendConfig.available,
      isAvailable: weekendConfig.available,
      blackoutDates: [],
    })
  }

  return entries
}

// Parking: all day, off-peak 09:30-16:00
// Restaurants: 08:00-22:00, off-peak 14:00-18:00 weekdays, weekends evenings 17:00-23:00
// Co-working: 08:00-20:00, off-peak 10:00-16:00, no weekends
// Coffee shops: 07:30-17:00, off-peak 10:00-14:00, weekends 08:00-15:00
// Bars: 12:00-23:00, off-peak 12:00-18:00 weekdays, all day weekends
// Function/Event: 08:00-22:00, off-peak 10:00-16:00, weekends available
// Hotel: 24/7, off-peak 10:00-16:00

export const MOCK_AVAILABILITY: Availability[] = [
  ...makeAvailability("space-001", "avl-001", { start: "00:00", end: "23:59", offPeakStart: "09:30", offPeakEnd: "16:00" }, { available: true, start: "00:00", end: "23:59" }),
  ...makeAvailability("space-002", "avl-002", { start: "08:00", end: "20:00", offPeakStart: "10:00", offPeakEnd: "16:00" }, { available: false, start: "", end: "" }),
  ...makeAvailability("space-003", "avl-003", { start: "08:00", end: "22:00", offPeakStart: "14:00", offPeakEnd: "18:00" }, { available: true, start: "17:00", end: "23:00" }),
  ...makeAvailability("space-004", "avl-004", { start: "12:00", end: "23:00", offPeakStart: "12:00", offPeakEnd: "18:00" }, { available: true, start: "12:00", end: "23:59" }),
  ...makeAvailability("space-005", "avl-005", { start: "07:30", end: "17:00", offPeakStart: "10:00", offPeakEnd: "14:00" }, { available: true, start: "08:00", end: "15:00" }),
  ...makeAvailability("space-006", "avl-006", { start: "08:00", end: "22:00", offPeakStart: "10:00", offPeakEnd: "16:00" }, { available: true, start: "10:00", end: "20:00" }),
  ...makeAvailability("space-007", "avl-007", { start: "00:00", end: "23:59", offPeakStart: "09:30", offPeakEnd: "16:00" }, { available: true, start: "00:00", end: "23:59" }),
  ...makeAvailability("space-008", "avl-008", { start: "08:00", end: "22:00", offPeakStart: "10:00", offPeakEnd: "16:00" }, { available: true, start: "10:00", end: "20:00" }),
  ...makeAvailability("space-009", "avl-009", { start: "08:00", end: "22:00", offPeakStart: "14:00", offPeakEnd: "18:00" }, { available: true, start: "17:00", end: "23:00" }),
  ...makeAvailability("space-010", "avl-010", { start: "08:00", end: "20:00", offPeakStart: "10:00", offPeakEnd: "16:00" }, { available: false, start: "", end: "" }),
  ...makeAvailability("space-011", "avl-011", { start: "00:00", end: "23:59", offPeakStart: "10:00", offPeakEnd: "16:00" }, { available: true, start: "00:00", end: "23:59" }),
  ...makeAvailability("space-012", "avl-012", { start: "08:00", end: "22:00", offPeakStart: "10:00", offPeakEnd: "16:00" }, { available: true, start: "10:00", end: "22:00" }),
  ...makeAvailability("space-013", "avl-013", { start: "00:00", end: "23:59", offPeakStart: "09:30", offPeakEnd: "16:00" }, { available: true, start: "00:00", end: "23:59" }),
  ...makeAvailability("space-014", "avl-014", { start: "07:30", end: "17:00", offPeakStart: "10:00", offPeakEnd: "14:00" }, { available: true, start: "08:00", end: "15:00" }),
  ...makeAvailability("space-015", "avl-015", { start: "12:00", end: "23:00", offPeakStart: "12:00", offPeakEnd: "18:00" }, { available: true, start: "12:00", end: "23:59" }),
  ...makeAvailability("space-016", "avl-016", { start: "08:00", end: "22:00", offPeakStart: "14:00", offPeakEnd: "18:00" }, { available: true, start: "17:00", end: "23:00" }),
  ...makeAvailability("space-017", "avl-017", { start: "08:00", end: "20:00", offPeakStart: "10:00", offPeakEnd: "16:00" }, { available: false, start: "", end: "" }),
  ...makeAvailability("space-018", "avl-018", { start: "00:00", end: "23:59", offPeakStart: "09:30", offPeakEnd: "16:00" }, { available: true, start: "00:00", end: "23:59" }),
]

// ---------------------------------------------------------------------------
// Mock Bookings (for MOCK_USER "seeker-001")
// ---------------------------------------------------------------------------

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "booking-001",
    spaceId: "space-002", // Clerkenwell co-working
    seekerId: "seeker-001",
    startTime: "2026-04-10T10:00:00Z",
    endTime: "2026-04-10T16:00:00Z",
    status: "CONFIRMED",
    totalPrice: 72,
    currency: "GBP",
    qrCode: "QR-booking-001-CONF",
    createdAt: "2026-03-15T09:00:00Z",
  },
  {
    id: "booking-002",
    spaceId: "space-009", // Manchester Ancoats restaurant
    seekerId: "seeker-001",
    startTime: "2026-02-14T14:00:00Z",
    endTime: "2026-02-14T17:00:00Z",
    status: "COMPLETED",
    totalPrice: 56,
    currency: "GBP",
    createdAt: "2026-02-01T11:00:00Z",
  },
  {
    id: "booking-003",
    spaceId: "space-004", // Camden bar
    seekerId: "seeker-001",
    startTime: "2026-01-20T13:00:00Z",
    endTime: "2026-01-20T18:00:00Z",
    status: "CANCELLED",
    totalPrice: 175,
    currency: "GBP",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "booking-004",
    spaceId: "space-012", // Birmingham event venue
    seekerId: "seeker-001",
    startTime: "2026-04-18T10:00:00Z",
    endTime: "2026-04-18T18:00:00Z",
    status: "PENDING",
    totalPrice: 96.25,
    currency: "GBP",
    createdAt: "2026-03-20T14:00:00Z",
  },
]

// ---------------------------------------------------------------------------
// Promotions (6)
// ---------------------------------------------------------------------------

const now = new Date()
const sixHoursFromNow = new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString()
const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: "promo-001",
    spaceId: "space-002", // Clerkenwell co-working
    type: "DISCOUNT",
    title: "50% Off Afternoon Co-Working",
    terms: "Valid for bookings starting between 13:00 and 16:00 Monday to Friday. Cannot be combined with other offers. One redemption per user per month.",
    discountPercent: 50,
    validFrom: "2026-01-01T00:00:00Z",
    validTo: thirtyDaysFromNow,
    redemptionLimit: 100,
    redemptionCount: 34,
    isActive: true,
  },
  {
    id: "promo-002",
    spaceId: "space-001", // Shoreditch parking
    type: "FREEBIE",
    title: "Free Coffee with Every Parking Session",
    terms: "Book any parking session at this location and receive a complimentary coffee voucher redeemable at the adjacent café. Voucher valid for 48 hours after parking session end time.",
    validFrom: "2026-02-01T00:00:00Z",
    validTo: thirtyDaysFromNow,
    redemptionLimit: 200,
    redemptionCount: 81,
    isActive: true,
  },
  {
    id: "promo-003",
    spaceId: "space-003", // Soho restaurant
    type: "FLASH_DEAL",
    title: "Flash: Restaurant Table Tonight — 40% Off",
    terms: "Exclusive flash deal for a private table booking tonight only. Discount applied automatically at checkout. Limited to 1 table booking. Must start before 21:00.",
    discountPercent: 40,
    validFrom: now.toISOString(),
    validTo: sixHoursFromNow,
    redemptionLimit: 1,
    redemptionCount: 0,
    isActive: true,
  },
  {
    id: "promo-004",
    spaceId: "space-004", // Camden bar
    type: "FLASH_DEAL",
    title: "Flash: Camden Bar Private Room This Weekend",
    terms: "Book the full bar for a private event this weekend and receive a significant discount. Minimum 3-hour booking required. Available Saturday and Sunday only.",
    discountPercent: 30,
    validFrom: now.toISOString(),
    validTo: threeDaysFromNow,
    redemptionLimit: 2,
    redemptionCount: 0,
    isActive: true,
  },
  {
    id: "promo-005",
    spaceId: "space-001", // applies to any space via promo code; anchored to space-001 as representative
    type: "PROMO_CODE",
    title: "Use Code OFFPEAK25 for 25% Off",
    terms: "Enter code OFFPEAK25 at checkout for 25% off your total booking price. Valid on any space across the OffPeak platform. One use per account. Cannot be combined with flash deals.",
    discountPercent: 25,
    promoCode: "OFFPEAK25",
    validFrom: "2026-01-01T00:00:00Z",
    validTo: thirtyDaysFromNow,
    redemptionLimit: 500,
    redemptionCount: 127,
    isActive: true,
  },
  {
    id: "promo-006",
    spaceId: "space-006", // Canary Wharf function room
    type: "FREEBIE",
    title: "Free Meeting Room (Owner-Sponsored Session)",
    terms: "The space owner is sponsoring one free 2-hour meeting room session per week for new users. Zero cost to the booker — the owner covers the full fee as a promotional trial. Subject to availability; book early to secure your slot.",
    validFrom: "2026-03-01T00:00:00Z",
    validTo: thirtyDaysFromNow,
    redemptionLimit: 4,
    redemptionCount: 2,
    isActive: true,
  },
]

// ---------------------------------------------------------------------------
// Reviews (2-5 per space)
// ---------------------------------------------------------------------------

// Reviewer users — not seeker-001 or the owners
const REVIEWER_IDS = [
  "reviewer-001",
  "reviewer-002",
  "reviewer-003",
  "reviewer-004",
  "reviewer-005",
  "reviewer-006",
  "reviewer-007",
  "reviewer-008",
]

export const MOCK_REVIEWS: Review[] = [
  // space-001 Shoreditch Parking
  {
    id: "rev-001",
    bookingId: "bk-ext-001",
    spaceId: "space-001",
    reviewerId: "reviewer-001",
    rating: 5,
    comment: "Exactly what it says on the tin — safe, easy to find, and the EV charger worked perfectly. Will definitely rebook.",
    photos: [],
    createdAt: "2025-12-10T14:00:00Z",
  },
  {
    id: "rev-002",
    bookingId: "bk-ext-002",
    spaceId: "space-001",
    reviewerId: "reviewer-002",
    rating: 4,
    comment: "Great location and secure. Entry code was a bit fiddly but the owner responded quickly to sort it out.",
    photos: [],
    ownerResponse: "Thanks for the feedback — we've updated the keypad instructions in the booking confirmation email.",
    createdAt: "2025-11-22T09:30:00Z",
  },
  {
    id: "rev-003",
    bookingId: "bk-ext-003",
    spaceId: "space-001",
    reviewerId: "reviewer-003",
    rating: 5,
    comment: "Off-peak price was unbeatable for Shoreditch. Saved at least £12 versus the NCP down the road.",
    photos: [],
    createdAt: "2026-01-05T16:00:00Z",
  },

  // space-002 Clerkenwell Co-working
  {
    id: "rev-004",
    bookingId: "bk-ext-004",
    spaceId: "space-002",
    reviewerId: "reviewer-004",
    rating: 5,
    comment: "Best off-peak desk I've found in London. Fast Wi-Fi, great coffee nearby, and a quiet atmosphere all afternoon.",
    photos: [],
    createdAt: "2026-01-15T17:00:00Z",
  },
  {
    id: "rev-005",
    bookingId: "bk-ext-005",
    spaceId: "space-002",
    reviewerId: "reviewer-005",
    rating: 5,
    comment: "Stunning space. The converted warehouse feel is genuinely inspiring. Booked three times already this month.",
    photos: [],
    createdAt: "2026-02-03T11:00:00Z",
  },
  {
    id: "rev-006",
    bookingId: "bk-ext-006",
    spaceId: "space-002",
    reviewerId: "reviewer-006",
    rating: 4,
    comment: "Lovely environment, though a couple of the monitors were showing their age. Still a solid 4 stars overall.",
    photos: [],
    ownerResponse: "We're replacing the external monitors next month — thank you for flagging this!",
    createdAt: "2026-02-18T15:30:00Z",
  },
  {
    id: "rev-007",
    bookingId: "bk-ext-007",
    spaceId: "space-002",
    reviewerId: "reviewer-007",
    rating: 5,
    comment: "The off-peak afternoon discount makes this incredible value. Quiet, professional, and genuinely enjoyable to work in.",
    photos: [],
    createdAt: "2026-03-01T18:00:00Z",
  },

  // space-003 Soho Restaurant
  {
    id: "rev-008",
    bookingId: "bk-ext-008",
    spaceId: "space-003",
    reviewerId: "reviewer-001",
    rating: 5,
    comment: "Used this for a team lunch of 20 — the space was stunning and the staff left us completely to ourselves. Excellent food too.",
    photos: [],
    createdAt: "2026-01-20T14:00:00Z",
  },
  {
    id: "rev-009",
    bookingId: "bk-ext-009",
    spaceId: "space-003",
    reviewerId: "reviewer-003",
    rating: 4,
    comment: "Gorgeous room in the heart of Soho. The only downside was parking nearby — but that's hardly the venue's fault!",
    photos: [],
    createdAt: "2026-02-10T13:00:00Z",
  },
  {
    id: "rev-010",
    bookingId: "bk-ext-010",
    spaceId: "space-003",
    reviewerId: "reviewer-008",
    rating: 4,
    comment: "Good value for a private Soho dining room. Off-peak afternoon rate made the per-head cost very reasonable.",
    photos: [],
    createdAt: "2026-02-25T17:00:00Z",
  },

  // space-004 Camden Bar
  {
    id: "rev-011",
    bookingId: "bk-ext-011",
    spaceId: "space-004",
    reviewerId: "reviewer-002",
    rating: 4,
    comment: "Hosted my sister's birthday here on a Saturday afternoon. The sound system is excellent and the outdoor yard was a big hit.",
    photos: [],
    createdAt: "2025-12-05T20:00:00Z",
  },
  {
    id: "rev-012",
    bookingId: "bk-ext-012",
    spaceId: "space-004",
    reviewerId: "reviewer-006",
    rating: 5,
    comment: "Amazing venue for a product launch. The bar team were brilliant and everything ran smoothly from start to finish.",
    photos: [],
    ownerResponse: "Thank you — it was a pleasure hosting you. Come back anytime!",
    createdAt: "2026-01-30T22:00:00Z",
  },
  {
    id: "rev-013",
    bookingId: "bk-ext-013",
    spaceId: "space-004",
    reviewerId: "reviewer-004",
    rating: 3,
    comment: "Great venue but the booking process was a bit confusing and we had to wait 20 minutes for the keys. Nice space once inside though.",
    photos: [],
    flaggedIssue: "Access delay on arrival",
    ownerResponse: "We're sorry for the wait — we've now added a lockbox so you can self-check-in without waiting for the keyholder.",
    createdAt: "2026-02-14T19:00:00Z",
  },

  // space-005 Notting Hill Coffee Shop
  {
    id: "rev-014",
    bookingId: "bk-ext-014",
    spaceId: "space-005",
    reviewerId: "reviewer-005",
    rating: 5,
    comment: "Hidden gem on Portobello Road. The coffee is outstanding and the space is genuinely peaceful during mid-morning hours.",
    photos: [],
    createdAt: "2026-01-12T12:00:00Z",
  },
  {
    id: "rev-015",
    bookingId: "bk-ext-015",
    spaceId: "space-005",
    reviewerId: "reviewer-007",
    rating: 5,
    comment: "Perfect for a focused half-day of work. Very reasonable price and the owner is extremely welcoming.",
    photos: [],
    createdAt: "2026-02-08T14:00:00Z",
  },
  {
    id: "rev-016",
    bookingId: "bk-ext-016",
    spaceId: "space-005",
    reviewerId: "reviewer-001",
    rating: 5,
    comment: "I come here almost every week now. The off-peak slot is the perfect time — quiet, sunny, and productive.",
    photos: [],
    createdAt: "2026-03-02T11:00:00Z",
  },

  // space-006 Canary Wharf Function Room
  {
    id: "rev-017",
    bookingId: "bk-ext-017",
    spaceId: "space-006",
    reviewerId: "reviewer-003",
    rating: 5,
    comment: "The Thames view alone is worth the booking. Used it for a senior leadership away-day and the team was genuinely impressed.",
    photos: [],
    createdAt: "2026-02-20T18:00:00Z",
  },
  {
    id: "rev-018",
    bookingId: "bk-ext-018",
    spaceId: "space-006",
    reviewerId: "reviewer-008",
    rating: 4,
    comment: "Very professional setup. AV equipment worked perfectly and the catering was excellent. Off-peak pricing made it accessible for a small charity.",
    photos: [],
    createdAt: "2026-03-10T17:00:00Z",
  },

  // space-007 Manchester Parking
  {
    id: "rev-019",
    bookingId: "bk-ext-019",
    spaceId: "space-007",
    reviewerId: "reviewer-002",
    rating: 4,
    comment: "Solid city-centre parking. Easy to find, well-lit at night, and the off-peak rate is very competitive.",
    photos: [],
    createdAt: "2026-01-08T20:00:00Z",
  },
  {
    id: "rev-020",
    bookingId: "bk-ext-020",
    spaceId: "space-007",
    reviewerId: "reviewer-005",
    rating: 5,
    comment: "Used this multiple times for Northern Quarter visits. Reliable and always available when I need it.",
    photos: [],
    createdAt: "2026-02-16T19:00:00Z",
  },
  {
    id: "rev-021",
    bookingId: "bk-ext-021",
    spaceId: "space-007",
    reviewerId: "reviewer-006",
    rating: 4,
    comment: "Good value and secure. Would be 5 stars if there was EV charging but still a great option.",
    photos: [],
    createdAt: "2026-03-01T10:00:00Z",
  },

  // space-008 Manchester Function Room
  {
    id: "rev-022",
    bookingId: "bk-ext-022",
    spaceId: "space-008",
    reviewerId: "reviewer-001",
    rating: 4,
    comment: "Great central location for a Manchester conference. The AV setup was straightforward and the catering team were helpful.",
    photos: [],
    createdAt: "2026-01-25T17:00:00Z",
  },
  {
    id: "rev-023",
    bookingId: "bk-ext-023",
    spaceId: "space-008",
    reviewerId: "reviewer-004",
    rating: 4,
    comment: "Professional space, well-maintained. The off-peak discount made it much more affordable for our small team away-day.",
    photos: [],
    createdAt: "2026-02-22T16:00:00Z",
  },

  // space-009 Manchester Restaurant
  {
    id: "rev-024",
    bookingId: "bk-ext-024",
    spaceId: "space-009",
    reviewerId: "reviewer-007",
    rating: 4,
    comment: "Lovely intimate restaurant in Ancoats. The afternoon hire slot worked perfectly for our team lunch.",
    photos: [],
    createdAt: "2026-01-18T15:00:00Z",
  },
  {
    id: "rev-025",
    bookingId: "bk-ext-025",
    spaceId: "space-009",
    reviewerId: "reviewer-003",
    rating: 4,
    comment: "Good food and a relaxed atmosphere. Very reasonable off-peak price for exclusive use.",
    photos: [],
    createdAt: "2026-02-05T14:00:00Z",
  },

  // space-010 Spinningfields Co-working
  {
    id: "rev-026",
    bookingId: "bk-ext-026",
    spaceId: "space-010",
    reviewerId: "reviewer-008",
    rating: 5,
    comment: "Polished, professional environment. The Spinningfields location is ideal for client meetings and the Wi-Fi is excellent.",
    photos: [],
    createdAt: "2026-02-12T17:00:00Z",
  },
  {
    id: "rev-027",
    bookingId: "bk-ext-027",
    spaceId: "space-010",
    reviewerId: "reviewer-002",
    rating: 4,
    comment: "Clean, quiet, and well-equipped. Would be perfect if the kitchen coffee machine wasn't always broken, but overall a great space.",
    photos: [],
    ownerResponse: "Good news — the coffee machine has now been replaced! Hope to see you back soon.",
    createdAt: "2026-03-05T12:00:00Z",
  },

  // space-011 Birmingham Hotel Room
  {
    id: "rev-028",
    bookingId: "bk-ext-028",
    spaceId: "space-011",
    reviewerId: "reviewer-001",
    rating: 5,
    comment: "Perfect day-use room for when I needed a quiet base in Birmingham. Clean, comfortable, and the hotel team were very welcoming.",
    photos: [],
    createdAt: "2026-01-22T16:00:00Z",
  },
  {
    id: "rev-029",
    bookingId: "bk-ext-029",
    spaceId: "space-011",
    reviewerId: "reviewer-006",
    rating: 4,
    comment: "Good value for a central Birmingham hotel room. Used it as a quiet workspace for the afternoon — much better than a coffee shop.",
    photos: [],
    createdAt: "2026-02-28T15:00:00Z",
  },

  // space-012 Birmingham Event Venue
  {
    id: "rev-030",
    bookingId: "bk-ext-030",
    spaceId: "space-012",
    reviewerId: "reviewer-005",
    rating: 5,
    comment: "Incredible blank canvas venue. Hosted a pop-up art exhibition here and the loading bay made set-up a breeze. Will definitely return.",
    photos: [],
    createdAt: "2026-01-30T20:00:00Z",
  },
  {
    id: "rev-031",
    bookingId: "bk-ext-031",
    spaceId: "space-012",
    reviewerId: "reviewer-004",
    rating: 5,
    comment: "Digbeth is the perfect backdrop for a creative event. The space has great bones and the lighting rig is superb.",
    photos: [],
    createdAt: "2026-02-18T19:00:00Z",
  },
  {
    id: "rev-032",
    bookingId: "bk-ext-032",
    spaceId: "space-012",
    reviewerId: "reviewer-003",
    rating: 4,
    comment: "Big, flexible, and well-priced at off-peak rates. The outdoor area is a bonus in summer.",
    photos: [],
    createdAt: "2026-03-08T17:00:00Z",
  },

  // space-013 Birmingham Parking
  {
    id: "rev-033",
    bookingId: "bk-ext-033",
    spaceId: "space-013",
    reviewerId: "reviewer-007",
    rating: 4,
    comment: "Very handy for New Street. Easy to book and the price was fair for city-centre parking.",
    photos: [],
    createdAt: "2026-02-10T11:00:00Z",
  },
  {
    id: "rev-034",
    bookingId: "bk-ext-034",
    spaceId: "space-013",
    reviewerId: "reviewer-002",
    rating: 4,
    comment: "Simple, no-fuss parking. The CCTV gave me peace of mind leaving my car for a full day.",
    photos: [],
    createdAt: "2026-03-12T10:00:00Z",
  },

  // space-014 Bristol Coffee Shop
  {
    id: "rev-035",
    bookingId: "bk-ext-035",
    spaceId: "space-014",
    reviewerId: "reviewer-008",
    rating: 5,
    comment: "Stunning little coffee shop in Clifton. The morning light is beautiful and the flat whites are some of the best I've had.",
    photos: [],
    createdAt: "2026-01-14T11:00:00Z",
  },
  {
    id: "rev-036",
    bookingId: "bk-ext-036",
    spaceId: "space-014",
    reviewerId: "reviewer-001",
    rating: 5,
    comment: "Used this for a quiet morning writing session — absolutely perfect. Great atmosphere and friendly staff.",
    photos: [],
    createdAt: "2026-02-06T10:00:00Z",
  },
  {
    id: "rev-037",
    bookingId: "bk-ext-037",
    spaceId: "space-014",
    reviewerId: "reviewer-006",
    rating: 5,
    comment: "My go-to Bristol workspace now. The off-peak booking means I always get a table and it's wonderfully quiet.",
    photos: [],
    createdAt: "2026-03-03T09:30:00Z",
  },

  // space-015 Bristol Bar
  {
    id: "rev-038",
    bookingId: "bk-ext-038",
    spaceId: "space-015",
    reviewerId: "reviewer-003",
    rating: 4,
    comment: "Stokes Croft has amazing energy and this bar captures it perfectly. The terrace is ideal for summer events.",
    photos: [],
    createdAt: "2026-01-28T21:00:00Z",
  },
  {
    id: "rev-039",
    bookingId: "bk-ext-039",
    spaceId: "space-015",
    reviewerId: "reviewer-007",
    rating: 4,
    comment: "Great space for a private birthday. A bit loud from the street but the sound system more than compensated.",
    photos: [],
    createdAt: "2026-02-22T20:00:00Z",
  },

  // space-016 Edinburgh Restaurant
  {
    id: "rev-040",
    bookingId: "bk-ext-040",
    spaceId: "space-016",
    reviewerId: "reviewer-005",
    rating: 5,
    comment: "A truly special space for a private dinner. The Georgian townhouse setting and the Scottish tasting menu were outstanding.",
    photos: [],
    createdAt: "2026-01-16T21:00:00Z",
  },
  {
    id: "rev-041",
    bookingId: "bk-ext-041",
    spaceId: "space-016",
    reviewerId: "reviewer-004",
    rating: 4,
    comment: "Wonderful intimate venue steps from the Royal Mile. The off-peak afternoon hire gave us several hours of privacy at a very fair rate.",
    photos: [],
    createdAt: "2026-02-20T16:00:00Z",
  },
  {
    id: "rev-042",
    bookingId: "bk-ext-042",
    spaceId: "space-016",
    reviewerId: "reviewer-008",
    rating: 5,
    comment: "Faultless. The chef's attention to detail and the quality of the space made it one of the best work events we've hosted.",
    photos: [],
    ownerResponse: "It was a pleasure to host you — looking forward to welcoming you back to Edinburgh!",
    createdAt: "2026-03-07T18:00:00Z",
  },

  // space-017 Edinburgh Co-working
  {
    id: "rev-043",
    bookingId: "bk-ext-043",
    spaceId: "space-017",
    reviewerId: "reviewer-002",
    rating: 5,
    comment: "Gorgeous restored Georgian building. The co-working desks are well-spaced and the phone booth is a great touch for calls.",
    photos: [],
    createdAt: "2026-01-20T16:00:00Z",
  },
  {
    id: "rev-044",
    bookingId: "bk-ext-044",
    spaceId: "space-017",
    reviewerId: "reviewer-006",
    rating: 4,
    comment: "Lovely New Town location. The off-peak rate makes it one of the best value co-working options in Edinburgh.",
    photos: [],
    createdAt: "2026-02-15T15:00:00Z",
  },

  // space-018 Leeds Parking
  {
    id: "rev-045",
    bookingId: "bk-ext-045",
    spaceId: "space-018",
    reviewerId: "reviewer-001",
    rating: 4,
    comment: "Convenient spot right by the station. Simple to book and straightforward to use. Good off-peak rate.",
    photos: [],
    createdAt: "2026-02-08T12:00:00Z",
  },
  {
    id: "rev-046",
    bookingId: "bk-ext-046",
    spaceId: "space-018",
    reviewerId: "reviewer-005",
    rating: 4,
    comment: "Does exactly what it promises. Secure, easy to access, and a noticeably cheaper than the multi-storey nearby.",
    photos: [],
    createdAt: "2026-03-15T11:00:00Z",
  },
]

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function getSpaceById(id: string): Space | undefined {
  return MOCK_SPACES.find((s) => s.id === id)
}

export function getSpacesByCategory(category: Category): Space[] {
  return MOCK_SPACES.filter((s) => s.category === category)
}

export function getSpacesInCity(city: string): Space[] {
  return MOCK_SPACES.filter(
    (s) => s.location.city.toLowerCase() === city.toLowerCase()
  )
}

export function getAllSpaces(): Space[] {
  return MOCK_SPACES
}

export function getBookingsForUser(userId: string): Booking[] {
  return MOCK_BOOKINGS.filter((b) => b.seekerId === userId)
}

export function getReviewsForSpace(spaceId: string): Review[] {
  return MOCK_REVIEWS.filter((r) => r.spaceId === spaceId)
}

export function getPromotionsForSpace(spaceId: string): Promotion[] {
  return MOCK_PROMOTIONS.filter((p) => p.spaceId === spaceId && p.isActive)
}

export function getActiveDeals(): Promotion[] {
  const now = new Date()
  return MOCK_PROMOTIONS.filter(
    (p) => p.isActive && new Date(p.validFrom) <= now && new Date(p.validTo) >= now
  )
}

export function getOwnerForSpace(spaceId: string): User {
  const space = MOCK_SPACES.find((s) => s.id === spaceId)
  const owner = MOCK_OWNERS.find((o) => o.id === space?.ownerId)
  if (!owner) {
    throw new Error(`No owner found for space ${spaceId}`)
  }
  return owner
}

export function getPricingForSpace(spaceId: string): PricingRule | undefined {
  return MOCK_PRICING.find((p) => p.spaceId === spaceId)
}

export function getAvailabilityForSpace(spaceId: string): Availability[] {
  return MOCK_AVAILABILITY.filter((a) => a.spaceId === spaceId)
}

export function validatePromoCode(code: string): { valid: boolean; promotion?: Promotion } {
  const promotion = MOCK_PROMOTIONS.find(
    (p) =>
      p.promoCode?.toUpperCase() === code.toUpperCase() &&
      p.isActive &&
      new Date(p.validFrom) <= new Date() &&
      new Date(p.validTo) >= new Date() &&
      (p.redemptionLimit === undefined || p.redemptionCount < p.redemptionLimit)
  )
  if (promotion) {
    return { valid: true, promotion }
  }
  return { valid: false }
}
