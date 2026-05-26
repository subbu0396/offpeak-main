'use client'

import { cn } from '@/lib/utils'

export function QRCodeDisplay({ value }: { value: string }) {
  // Generate a deterministic pattern from the value string
  const cells = Array.from({ length: 121 }, (_, i) => {
    const charCode = value.charCodeAt(i % value.length) || 0
    return (charCode + i) % 3 !== 0
  })

  return (
    <div className="inline-block p-4 bg-white rounded-lg border">
      <div className="grid grid-cols-11 gap-0.5 w-[132px] h-[132px]">
        {cells.map((filled, i) => (
          <div
            key={i}
            className={cn(
              'w-3 h-3 rounded-sm',
              filled ? 'bg-slate-900' : 'bg-white'
            )}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500 text-center mt-2 font-mono">{value}</p>
    </div>
  )
}
