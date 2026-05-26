'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search,
  Map,
  Tag,
  Calendar,
  User,
  LayoutDashboard,
  List,
  DollarSign,
  Megaphone,
  BarChart3,
  Building2,
  Upload,
  Shield,
  FileText,
  MapPin,
  CalendarHeart,
  FileSignature,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  matchPath: string | null
  exactMatch: boolean
  excludeQuery?: string
  queryMatch?: string
}

const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  SEEKER: [
    {
      label: 'Explore',
      href: '/explore',
      icon: Search,
      matchPath: '/explore',
      exactMatch: false,
      excludeQuery: 'view=map',
    },
    {
      label: 'Map',
      href: '/explore?view=map',
      icon: Map,
      matchPath: '/explore',
      exactMatch: false,
      queryMatch: 'view=map',
    },
    {
      label: 'Deals',
      href: '/deals',
      icon: Tag,
      matchPath: '/deals',
      exactMatch: false,
    },
    {
      label: 'Bookings',
      href: '/bookings',
      icon: Calendar,
      matchPath: '/bookings',
      exactMatch: false,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: User,
      matchPath: '/profile',
      exactMatch: false,
    },
  ],
  OWNER: [
    {
      label: 'Dashboard',
      href: '/owner',
      icon: LayoutDashboard,
      matchPath: '/owner',
      exactMatch: true,
    },
    {
      label: 'Listings',
      href: '/owner/listings',
      icon: List,
      matchPath: '/owner/listings',
      exactMatch: false,
    },
    {
      label: 'Pricing',
      href: '/owner/pricing',
      icon: DollarSign,
      matchPath: '/owner/pricing',
      exactMatch: false,
    },
    {
      label: 'Promotions',
      href: '/owner/promotions',
      icon: Megaphone,
      matchPath: '/owner/promotions',
      exactMatch: false,
    },
    {
      label: 'Analytics',
      href: '/owner/analytics',
      icon: BarChart3,
      matchPath: '/owner/analytics',
      exactMatch: false,
    },
  ],
  MANAGER: [
    {
      label: 'Dashboard',
      href: '/manager',
      icon: LayoutDashboard,
      matchPath: '/manager',
      exactMatch: true,
    },
    {
      label: 'Spaces',
      href: '/manager/spaces',
      icon: Building2,
      matchPath: '/manager/spaces',
      exactMatch: false,
    },
    {
      label: 'Import',
      href: '/manager/import',
      icon: Upload,
      matchPath: '/manager/import',
      exactMatch: false,
    },
  ],
  ADMIN: [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      matchPath: '/admin',
      exactMatch: true,
    },
    {
      label: 'Moderation',
      href: '/admin/moderation',
      icon: Shield,
      matchPath: '/admin/moderation',
      exactMatch: false,
    },
    {
      label: 'Audit',
      href: '/admin/audit',
      icon: FileText,
      matchPath: '/admin/audit',
      exactMatch: false,
    },
  ],
  EVENT_ORGANIZER: [
    {
      label: 'Explore',
      href: '/explore',
      icon: Search,
      matchPath: '/explore',
      exactMatch: false,
    },
    {
      label: 'Venues',
      href: '/venues',
      icon: MapPin,
      matchPath: '/venues',
      exactMatch: false,
    },
    {
      label: 'Events',
      href: '/events',
      icon: CalendarHeart,
      matchPath: '/events',
      exactMatch: true,
    },
    {
      label: 'Contracts',
      href: '/events/contracts',
      icon: FileSignature,
      matchPath: '/events/contracts',
      exactMatch: false,
    },
  ],
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const { currentRole } = useAuthStore()
  const tabs = NAV_CONFIG[currentRole]

  // Detect if we have a view=map query param (only available client-side)
  const isMapView =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('view') === 'map'

  function isTabActive(tab: NavItem): boolean {
    if (tab.matchPath === null) return false

    const pathMatches =
      tab.exactMatch
        ? pathname === tab.matchPath
        : pathname === tab.matchPath || pathname.startsWith(tab.matchPath + '/')

    if (!pathMatches) return false

    // Map tab: only active when view=map
    if (tab.queryMatch === 'view=map') {
      return isMapView
    }

    // Explore tab: active only when NOT view=map
    if (tab.excludeQuery === 'view=map') {
      return !isMapView
    }

    return true
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 inset-x-0 z-40 flex lg:hidden border-t border-slate-200 bg-white"
      role="tablist"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = isTabActive(tab)

        return (
          <Link
            key={tab.label}
            href={tab.href}
            role="tab"
            aria-selected={active}
            aria-label={tab.label}
            className={[
              'flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 text-xs font-medium transition-colors',
              active
                ? 'text-teal-600'
                : 'text-slate-500 hover:text-slate-600',
            ].join(' ')}
          >
            <Icon
              className="size-5 shrink-0"
              aria-hidden="true"
            />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
