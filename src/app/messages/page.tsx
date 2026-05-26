'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConversationList } from '@/components/messaging/conversation-list'
import { MessageThread } from '@/components/messaging/message-thread'
import { useAuthStore } from '@/store/auth-store'
import { MOCK_CONVERSATIONS } from '@/lib/mock-data-messages'
export type { MockMessage, MockConversation } from '@/lib/mock-data-messages'

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><MessageSquare className="size-8 text-muted-foreground/40 animate-pulse" /></div>}>
      <MessagesContent />
    </Suspense>
  )
}

function MessagesContent() {
  const { currentUser } = useAuthStore()
  const searchParams = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_CONVERSATIONS[0].id)
  const [showThread, setShowThread] = useState(false)

  // Auto-select conversation when ?to= query param is present
  useEffect(() => {
    const toParam = searchParams.get('to')
    if (!toParam) return
    const match = MOCK_CONVERSATIONS.find((c) => c.participantId === toParam)
    if (match) {
      setSelectedId(match.id)
      setShowThread(true)
    }
  }, [searchParams])

  const selectedConv = MOCK_CONVERSATIONS.find((c) => c.id === selectedId) ?? null

  function handleSelect(id: string) {
    setSelectedId(id)
    setShowThread(true)
  }

  const totalUnread = MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0)

  return (
    <main className="mx-auto max-w-5xl h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Page title row */}
      <div className="px-4 py-4 border-b flex items-center gap-2 shrink-0">
        <MessageSquare className="size-5 text-teal-600" />
        <h1 className="font-semibold text-base text-foreground">
          Messages
          {totalUnread > 0 && (
            <span className="ml-2 inline-flex items-center justify-center size-5 rounded-full bg-teal-600 text-white text-[10px] font-bold">
              {totalUnread}
            </span>
          )}
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversation list — always visible on desktop, hidden on mobile when thread is shown */}
        <aside
          className={[
            'flex flex-col shrink-0 border-r overflow-y-auto',
            'w-full lg:w-80',
            showThread ? 'hidden lg:flex' : 'flex',
          ].join(' ')}
        >
          <ConversationList
            conversations={MOCK_CONVERSATIONS}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </aside>

        {/* Thread panel */}
        <section
          className={[
            'flex-1 flex flex-col overflow-hidden',
            showThread ? 'flex' : 'hidden lg:flex',
          ].join(' ')}
        >
          {selectedConv ? (
            <>
              {/* Mobile back button */}
              <div className="lg:hidden px-4 py-2 border-b shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowThread(false)}
                  className="gap-1.5 -ml-2"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
              </div>
              <MessageThread
                conversation={selectedConv}
                currentUserId={currentUser.id}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center p-8">
              <MessageSquare className="size-12 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Select a conversation to start messaging</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
