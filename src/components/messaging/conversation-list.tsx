'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { MockConversation } from '@/app/messages/page'

interface ConversationListProps {
  conversations: MockConversation[]
  selectedId: string | null
  onSelect: (id: string) => void
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {conversations.map((conv) => {
        const lastMsg = conv.messages[conv.messages.length - 1]
        const initials = conv.participantName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
        const isSelected = conv.id === selectedId

        return (
          <li key={conv.id}>
            <button
              onClick={() => onSelect(conv.id)}
              className={cn(
                'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
                isSelected && 'bg-muted'
              )}
              aria-current={isSelected ? 'true' : undefined}
            >
              <Avatar size="default" className="mt-0.5 shrink-0">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold truncate text-foreground">
                    {conv.participantName}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                    {lastMsg ? timeAgo(lastMsg.createdAt) : ''}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{conv.spaceTitle}</p>
                {lastMsg && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {lastMsg.text}
                  </p>
                )}
              </div>

              {conv.unread > 0 && (
                <Badge className="shrink-0 mt-0.5 bg-teal-600 text-white border-0 text-[10px] h-4 min-w-4 px-1">
                  {conv.unread}
                </Badge>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
