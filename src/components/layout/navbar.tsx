'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, CalendarHeart, FileSignature, Heart, MessageSquare, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useSpaceStore } from '@/store/space-store'
import { useAuthStore } from '@/store/auth-store'
import { getUnreadAlertCount } from '@/lib/mock-data-events'
import { getUnreadMessageCount } from '@/lib/mock-data-messages'
import { SearchCommand } from '@/components/layout/search-command'
import type { UserRole } from '@/types'

interface NavLink {
  href: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

const NAV_LINKS: Record<UserRole, NavLink[]> = {
  SEEKER: [
    { href: '/explore', label: 'Explore' },
    { href: '/deals', label: 'Deals' },
    { href: '/bookings', label: 'Bookings' },
  ],
  OWNER: [
    { href: '/owner', label: 'Dashboard' },
    { href: '/owner/listings', label: 'Listings' },
    { href: '/owner/analytics', label: 'Analytics' },
  ],
  MANAGER: [
    { href: '/manager', label: 'Dashboard' },
    { href: '/manager/import', label: 'Import' },
  ],
  ADMIN: [
    { href: '/admin/moderation', label: 'Moderation' },
    { href: '/admin/audit', label: 'Audit Log' },
  ],
  EVENT_ORGANIZER: [
    { href: '/explore', label: 'Explore', icon: Search },
    { href: '/events', label: 'Events', icon: CalendarHeart },
    { href: '/events/contracts', label: 'Contracts', icon: FileSignature },
  ],
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { shortlistedIds, toggleShortlist } = useSpaceStore()
  const { currentUser, currentRole } = useAuthStore()
  const shortlistCount = shortlistedIds.length

  const navLinks = NAV_LINKS[currentRole]
  const unreadAlertCount = getUnreadAlertCount(currentUser.id)
  const unreadMessageCount = getUnreadMessageCount()

  const userInitials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <>
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl text-teal-600 shrink-0"
          aria-label="OffPeak home"
        >
          OffPeak
        </Link>

        {/* Desktop center nav links */}
        <div className="hidden lg:flex items-center gap-1" role="menubar">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                role="menuitem"
                className={[
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  'hover:text-teal-600 hover:bg-teal-50',
                  isActive
                    ? 'text-teal-600 border-b-2 border-teal-600 rounded-none'
                    : 'text-slate-600',
                ].join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Desktop right actions */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Shortlist popover */}
          <Popover>
            <PopoverTrigger
              className="relative flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label={`Saved spaces${shortlistCount > 0 ? `, ${shortlistCount} saved` : ''}`}
            >
              <Heart
                className={[
                  'size-5',
                  shortlistCount > 0
                    ? 'fill-teal-600 text-teal-600'
                    : 'text-slate-600',
                ].join(' ')}
              />
              {shortlistCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white"
                  aria-hidden="true"
                >
                  {shortlistCount > 9 ? '9+' : shortlistCount}
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" className="w-80">
              <div className="font-semibold text-sm text-foreground mb-2">
                Saved Spaces ({shortlistCount})
              </div>
              {shortlistCount === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No saved spaces yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {shortlistedIds.map((id) => (
                    <li
                      key={id}
                      className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
                    >
                      <span className="text-sm truncate text-foreground">
                        Space {id}
                      </span>
                      <button
                        onClick={() => toggleShortlist(id)}
                        className="shrink-0 text-slate-500 hover:text-destructive transition-colors"
                        aria-label={`Remove space ${id} from saved`}
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </PopoverContent>
          </Popover>

          {/* Search icon — opens command palette */}
          <button
            onClick={() => window.dispatchEvent(new Event('open-search'))}
            className="relative flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label="Open search (Cmd+K)"
          >
            <Search className="size-5 text-slate-600" />
          </button>

          {/* Messages icon — all roles */}
          <Link
            href="/messages"
            className="relative flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label={`Messages${unreadMessageCount > 0 ? `, ${unreadMessageCount} unread` : ''}`}
          >
            <MessageSquare className="size-5 text-slate-600" />
            {unreadMessageCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white"
                aria-hidden="true"
              >
                {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
              </span>
            )}
          </Link>

          {/* Bell icon — all roles */}
          <Link
            href="/deals/preferences"
            className="relative flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label={`Notifications${unreadAlertCount > 0 ? `, ${unreadAlertCount} unread` : ''}`}
          >
            <Bell className="size-5 text-slate-600" />
            {unreadAlertCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white"
                aria-hidden="true"
              >
                {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
              </span>
            )}
          </Link>

          {/* User avatar */}
          <button
            onClick={() => router.push('/profile')}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            aria-label={`User menu for ${currentUser.name}`}
          >
            <Avatar size="default">
              {currentUser.avatarUrl && (
                <AvatarImage
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                />
              )}
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </button>
        </div>

        {/* Mobile right actions */}
        <div className="flex lg:hidden items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-11"
            aria-label="Search (Cmd+K)"
            onClick={() => window.dispatchEvent(new Event('open-search'))}
          >
            <Search className="size-5 text-slate-600" />
          </Button>
          <button
            onClick={() => router.push('/profile')}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            aria-label={`User menu for ${currentUser.name}`}
          >
            <Avatar size="default">
              {currentUser.avatarUrl && (
                <AvatarImage
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                />
              )}
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </button>
        </div>
      </nav>
    </header>
    <SearchCommand />
    </>
  )
}
