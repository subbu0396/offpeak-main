'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { MockConversation, MockMessage } from '@/app/messages/page'

interface MessageThreadProps {
  conversation: MockConversation
  currentUserId: string
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MessageThread({ conversation, currentUserId }: MessageThreadProps) {
  const [messages, setMessages] = useState<MockMessage[]>(conversation.messages)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Reset when conversation changes
  useEffect(() => {
    setMessages(conversation.messages)
    setDraft('')
  }, [conversation.id, conversation.messages])

  function handleSend() {
    const text = draft.trim()
    if (!text) return
    const newMsg: MockMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      text,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMsg])
    setDraft('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b flex flex-col gap-0.5 shrink-0">
        <p className="font-semibold text-sm text-foreground">{conversation.participantName}</p>
        <p className="text-xs text-muted-foreground">
          {conversation.participantRole} · {conversation.spaceTitle}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 shrink-0">
        <p className="text-xs text-amber-700">
          Messages are mock only — no data is sent or stored.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId
          return (
            <div
              key={msg.id}
              className={cn('flex flex-col gap-1 max-w-[80%]', isMine ? 'self-end items-end' : 'self-start items-start')}
            >
              <div
                className={cn(
                  'rounded-xl px-3 py-2 text-sm leading-relaxed',
                  isMine
                    ? 'bg-teal-600 text-white rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                )}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {formatTime(msg.createdAt)}
              </span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 border-t flex items-end gap-2 shrink-0">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send)"
          className="resize-none min-h-[40px] max-h-28 flex-1 text-sm"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!draft.trim()}
          size="icon"
          className="bg-teal-600 hover:bg-teal-700 text-white shrink-0"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  )
}
