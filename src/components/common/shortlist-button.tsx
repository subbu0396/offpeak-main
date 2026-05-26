"use client"

import { Heart } from "lucide-react"
import { useSpaceStore } from "@/store/space-store"
import { cn } from "@/lib/utils"

export function ShortlistButton({ spaceId, className }: { spaceId: string; className?: string }) {
  const toggleShortlist = useSpaceStore((state) => state.toggleShortlist)
  const isShortlisted = useSpaceStore((state) => state.isShortlisted(spaceId))

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleShortlist(spaceId)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isShortlisted ? "Remove from shortlist" : "Save to shortlist"}
      className={cn("p-2 rounded-full transition-colors hover:bg-slate-100", className)}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          isShortlisted ? "fill-red-500 text-red-500" : "text-slate-500"
        )}
      />
    </button>
  )
}
