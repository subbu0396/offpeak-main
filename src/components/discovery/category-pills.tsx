'use client'

import { useExploreStore } from '@/store/explore-store'
import { CATEGORIES } from '@/lib/constants'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

export function CategoryPills() {
  const selectedCategory = useExploreStore((state) => state.selectedCategory)
  const setCategory = useExploreStore((state) => state.setCategory)

  function handleClick(value: Category) {
    if (selectedCategory === value) {
      setCategory(null)
    } else {
      setCategory(value)
    }
  }

  return (
    <ScrollArea className="w-full">
      <div
        role="radiogroup"
        aria-label="Filter by category"
        className="flex gap-2 pb-2 px-1"
      >
        {CATEGORIES.map(({ value, label, icon: Icon }) => {
          const isActive = selectedCategory === value
          return (
            <button
              key={value}
              role="radio"
              aria-checked={isActive}
              onClick={() => handleClick(value)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
                isActive
                  ? 'border-teal-500 bg-teal-500 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
