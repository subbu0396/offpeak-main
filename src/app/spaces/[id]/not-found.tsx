import Link from 'next/link'
import { MapPinOff } from 'lucide-react'

export default function SpaceNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[400px] px-4 text-center">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <MapPinOff className="size-8 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-foreground">
            Space not found
          </h1>
          <p className="text-sm text-muted-foreground">
            This space may have been removed or the link is incorrect.
          </p>
        </div>
        <Link
          href="/explore"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-teal-600 px-6 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/50"
        >
          Browse spaces
        </Link>
      </div>
    </div>
  )
}
