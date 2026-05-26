import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Space } from '@/types'

interface ModerationDetailProps {
  space: Space
}

export function ModerationDetail({ space }: ModerationDetailProps) {
  const categoryLabel = space.category.replace(/_/g, ' ')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Space Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {space.photos[0] && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={space.photos[0]}
              alt={space.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        <div className="space-y-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Title</p>
            <p className="text-sm font-medium text-slate-900">{space.title}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</p>
            <p className="text-sm text-slate-700">{categoryLabel}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Location</p>
            <p className="text-sm text-slate-700">
              {space.location.address}, {space.location.city} {space.location.postcode}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Owner ID</p>
            <p className="text-sm text-slate-700 font-mono">{space.ownerId}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verification</p>
            <Badge
              className={
                space.isVerified
                  ? 'bg-green-500/10 text-green-700 border-green-500/20'
                  : 'bg-amber-500/10 text-amber-700 border-amber-500/20'
              }
            >
              {space.isVerified ? 'Verified' : 'Not Verified'}
            </Badge>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
            <Badge
              className={
                space.status === 'ACTIVE'
                  ? 'bg-green-500/10 text-green-700 border-green-500/20'
                  : space.status === 'SUSPENDED'
                  ? 'bg-red-500/10 text-red-700 border-red-500/20'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }
            >
              {space.status}
            </Badge>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Reviews</p>
            <p className="text-sm text-slate-700">
              {space.rating.toFixed(1)} stars &middot; {space.reviewCount} reviews
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Listed On</p>
            <p className="text-sm text-slate-700">
              {new Date(space.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
