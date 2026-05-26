'use client'

import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { VerifiedBadge } from '@/components/common/verified-badge'
import { MessageOwnerSheet } from './message-owner-sheet'
import type { User } from '@/types'

interface OwnerInfoProps {
  owner: User
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function OwnerInfo({ owner }: OwnerInfoProps) {
  const memberYear = new Date(owner.createdAt).getFullYear()
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          {owner.avatarUrl && (
            <AvatarImage src={owner.avatarUrl} alt={owner.name} />
          )}
          <AvatarFallback>{getInitials(owner.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900">{owner.name}</span>
            {owner.verificationStatus === 'VERIFIED' && <VerifiedBadge />}
          </div>
          <p className="text-sm text-slate-500">Member since {memberYear}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm text-slate-600">
        <p>Response rate: 95%</p>
      </div>

      <Button
        variant="outline"
        className="self-start border-teal-500 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
        onClick={() => setSheetOpen(true)}
      >
        Message Owner
      </Button>

      <MessageOwnerSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        ownerName={owner.name}
      />
    </div>
  )
}
