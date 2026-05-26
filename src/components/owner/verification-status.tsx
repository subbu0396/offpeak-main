'use client'

import { IdCard, Camera, MapPin } from 'lucide-react'
import { getVerificationDocsForUser } from '@/lib/mock-data-owner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { VerificationStatus as VerificationStatusType } from '@/types'

const DOC_TYPES = [
  { type: 'ID', label: 'Identity Document', icon: IdCard },
  { type: 'PHOTO', label: 'Space Photos', icon: Camera },
  { type: 'GEO_EVIDENCE', label: 'Location Proof', icon: MapPin },
] as const

function StatusBadge({ status }: { status: VerificationStatusType }) {
  if (status === 'VERIFIED') {
    return (
      <Badge className="bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/10">
        Verified
      </Badge>
    )
  }
  if (status === 'PENDING') {
    return (
      <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/10">
        Pending Review
      </Badge>
    )
  }
  return (
    <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100">
      Unverified
    </Badge>
  )
}

interface VerificationStatusProps {
  userId: string
}

export function VerificationStatus({ userId }: VerificationStatusProps) {
  const docs = getVerificationDocsForUser(userId)

  const docsByType = Object.fromEntries(
    docs.map((d) => [d.type, d])
  )

  const verifiedCount = DOC_TYPES.filter(
    (dt) => docsByType[dt.type]?.status === 'VERIFIED'
  ).length

  const progressPercent = Math.round((verifiedCount / DOC_TYPES.length) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-900">
          Verification Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress summary */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{verifiedCount} of {DOC_TYPES.length} documents verified</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={verifiedCount}
              aria-valuemin={0}
              aria-valuemax={DOC_TYPES.length}
              aria-label="Verification progress"
            />
          </div>
        </div>

        {/* Document list */}
        <ul className="space-y-2">
          {DOC_TYPES.map(({ type, label, icon: Icon }) => {
            const doc = docsByType[type]
            const status: VerificationStatusType = doc?.status ?? 'UNVERIFIED'
            return (
              <li key={type} className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="flex-1 text-sm text-slate-700">{label}</span>
                <StatusBadge status={status} />
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
