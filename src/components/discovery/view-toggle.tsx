'use client'

import { Map, List, Columns } from 'lucide-react'
import { useExploreStore } from '@/store/explore-store'
import { cn } from '@/lib/utils'

type ViewMode = 'map' | 'list' | 'split'

const VIEW_OPTIONS: { value: ViewMode; label: string; icon: React.ElementType; hideOnMobile?: boolean }[] = [
  { value: 'map', label: 'Map view', icon: Map },
  { value: 'list', label: 'List view', icon: List },
  { value: 'split', label: 'Split view', icon: Columns, hideOnMobile: true },
]

export function ViewToggle() {
  const viewMode = useExploreStore((state) => state.viewMode)
  const setViewMode = useExploreStore((state) => state.setViewMode)

  return (
    <div
      className="flex items-center rounded-lg border border-slate-200 overflow-hidden"
      role="group"
      aria-label="View mode"
    >
      {VIEW_OPTIONS.map(({ value, label, icon: Icon, hideOnMobile }) => {
        const isActive = viewMode === value
        return (
          <button
            key={value}
            onClick={() => setViewMode(value)}
            aria-label={label}
            aria-pressed={isActive}
            className={cn(
              'flex items-center justify-center px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-inset',
              hideOnMobile && 'hidden sm:flex',
              isActive
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
