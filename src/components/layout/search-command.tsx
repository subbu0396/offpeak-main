'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Tag, FileText, Plus } from 'lucide-react'
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { getAllSpaces } from '@/lib/mock-data'
import { CATEGORIES } from '@/lib/constants'
import { useAuthStore } from '@/store/auth-store'

const PAGES = [
  { name: 'Explore Spaces', href: '/explore' },
  { name: 'Deals & Offers', href: '/deals' },
  { name: 'My Bookings', href: '/bookings' },
  { name: 'Profile', href: '/profile' },
  { name: 'Messages', href: '/messages' },
  { name: 'Help & FAQ', href: '/help' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Notification Preferences', href: '/deals/preferences' },
]

type PageEntry = { name: string; href: string }

const ROLE_PAGES: Record<string, PageEntry[]> = {
  SEEKER: [],
  OWNER: [
    { name: 'Owner Dashboard', href: '/owner' },
    { name: 'My Listings', href: '/owner/listings' },
    { name: 'Create Listing', href: '/owner/listings/new' },
    { name: 'Pricing Settings', href: '/owner/pricing' },
    { name: 'Promotions', href: '/owner/promotions' },
    { name: 'Analytics', href: '/owner/analytics' },
    { name: 'Verification', href: '/owner/verification' },
  ],
  MANAGER: [
    { name: 'Manager Dashboard', href: '/manager' },
    { name: 'Bulk Import', href: '/manager/import' },
  ],
  ADMIN: [
    { name: 'Admin Dashboard', href: '/admin' },
    { name: 'Moderation Queue', href: '/admin/moderation' },
    { name: 'Audit Log', href: '/admin/audit' },
  ],
  EVENT_ORGANIZER: [
    { name: 'Event Dashboard', href: '/events' },
    { name: 'Discover Venues', href: '/events/discover' },
    { name: 'My Contracts', href: '/events/contracts' },
    { name: 'New Contract', href: '/events/contracts/new' },
  ],
}

export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const { currentRole } = useAuthStore()

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [])

  // Custom event from navbar search button
  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener('open-search', handleOpen)
    return () => window.removeEventListener('open-search', handleOpen)
  }, [])

  function navigate(href: string) {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  const lowerQuery = query.toLowerCase()

  const allSpaces = getAllSpaces()
  const filteredSpaces = lowerQuery
    ? allSpaces.filter(
        (s) =>
          s.title.toLowerCase().includes(lowerQuery) ||
          s.category.toLowerCase().includes(lowerQuery) ||
          s.location.city.toLowerCase().includes(lowerQuery)
      )
    : allSpaces.slice(0, 5)

  const filteredCategories = lowerQuery
    ? CATEGORIES.filter((c) => c.label.toLowerCase().includes(lowerQuery))
    : CATEGORIES

  const allPages = [...PAGES, ...(ROLE_PAGES[currentRole] ?? [])]
  const filteredPages = lowerQuery
    ? allPages.filter((p) => p.name.toLowerCase().includes(lowerQuery))
    : allPages

  const actions: { label: string; href: string; roles: string[] }[] = [
    { label: 'Create Listing', href: '/owner/listings/new', roles: ['OWNER'] },
    { label: 'New Contract', href: '/events/contracts/new', roles: ['EVENT_ORGANIZER'] },
  ]
  const filteredActions = actions.filter(
    (a) =>
      a.roles.includes(currentRole) &&
      (!lowerQuery || a.label.toLowerCase().includes(lowerQuery))
  )

  const hasResults =
    filteredSpaces.length > 0 ||
    filteredCategories.length > 0 ||
    filteredPages.length > 0 ||
    filteredActions.length > 0

  return (
    <CommandDialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) setQuery('')
      }}
      title="Global Search"
      description="Search spaces, categories, pages and actions"
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search spaces, categories, pages…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!hasResults && <CommandEmpty>No results found.</CommandEmpty>}

          {filteredSpaces.length > 0 && (
            <CommandGroup heading="Spaces">
              {filteredSpaces.map((space) => {
                const cat = CATEGORIES.find((c) => c.value === space.category)
                return (
                  <CommandItem
                    key={space.id}
                    value={space.id}
                    onSelect={() => navigate(`/spaces/${space.id}`)}
                    className="gap-3"
                  >
                    <Building2 className="size-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 truncate">{space.title}</span>
                    {cat && (
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {cat.label}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground shrink-0">
                      {space.location.city}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )}

          {filteredSpaces.length > 0 && filteredCategories.length > 0 && (
            <CommandSeparator />
          )}

          {filteredCategories.length > 0 && (
            <CommandGroup heading="Categories">
              {filteredCategories.map((cat) => (
                <CommandItem
                  key={cat.value}
                  value={cat.value}
                  onSelect={() => navigate(`/explore?category=${cat.value}`)}
                  className="gap-3"
                >
                  <Tag className="size-4 text-muted-foreground shrink-0" />
                  {cat.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredCategories.length > 0 && filteredPages.length > 0 && (
            <CommandSeparator />
          )}

          {filteredPages.length > 0 && (
            <CommandGroup heading="Pages">
              {filteredPages.map((page) => (
                <CommandItem
                  key={page.href}
                  value={page.href}
                  onSelect={() => navigate(page.href)}
                  className="gap-3"
                >
                  <FileText className="size-4 text-muted-foreground shrink-0" />
                  {page.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {filteredPages.length > 0 && filteredActions.length > 0 && (
            <CommandSeparator />
          )}

          {filteredActions.length > 0 && (
            <CommandGroup heading="Actions">
              {filteredActions.map((action) => (
                <CommandItem
                  key={action.href}
                  value={action.href}
                  onSelect={() => navigate(action.href)}
                  className="gap-3"
                >
                  <Plus className="size-4 text-muted-foreground shrink-0" />
                  {action.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
