'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/manager', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/manager/spaces', label: 'Spaces', icon: Building2 },
  { href: '/manager/import', label: 'Bulk Import', icon: Upload },
]

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="px-4 py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Manager Portal
          </p>
          <nav className="flex flex-col gap-1" aria-label="Manager navigation">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === '/manager'
                  ? pathname === '/manager'
                  : pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-teal-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Mobile tab bar — scrollable top bar, not fixed */}
        <div className="lg:hidden border-b bg-white overflow-x-auto shrink-0">
          <nav
            className="flex min-w-max px-2 py-2 gap-1"
            aria-label="Manager navigation"
          >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === '/manager'
                  ? pathname === '/manager'
                  : pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-teal-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
        {children}
      </main>
    </div>
  )
}
