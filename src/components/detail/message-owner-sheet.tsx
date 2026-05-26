'use client'

import { useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { SuccessState } from "@/components/common/success-state"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// Default seeker details (mock user)
const DEFAULT_NAME = "Alex Chen"
const DEFAULT_EMAIL = "alex.chen@example.com"

interface MessageOwnerSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ownerName: string
}

export function MessageOwnerSheet({ open, onOpenChange, ownerName }: MessageOwnerSheetProps) {
  const [name, setName] = useState(DEFAULT_NAME)
  const [email, setEmail] = useState(DEFAULT_EMAIL)
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Mock send — no real network request
    setSubmitted(true)
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      // Reset form when closing
      setMessage("")
      setSubmitted(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Message {ownerName}</SheetTitle>
          <SheetDescription>
            Send a message to the space owner about availability, amenities, or anything else.
          </SheetDescription>
        </SheetHeader>

        {submitted ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <SuccessState
              icon={CheckCircle}
              title="Message sent!"
              message="The owner typically responds within 24 hours."
            >
              <Link href="/messages" className="text-teal-600 hover:underline text-sm inline-block">
                View in your inbox →
              </Link>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
            </SuccessState>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="msg-name" className="text-sm font-medium text-slate-700">
                Your name
              </label>
              <Input
                id="msg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="msg-email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                id="msg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <label htmlFor="msg-body" className="text-sm font-medium text-slate-700">
                Message
              </label>
              <Textarea
                id="msg-body"
                className="flex-1 resize-none"
                rows={6}
                placeholder="Ask about availability, amenities, or anything else..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <SheetFooter>
              <Button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                disabled={!name || !email || !message}
              >
                Send Message
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
