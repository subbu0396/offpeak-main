"use client"

import { useState, useEffect } from "react"

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "Expired"
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`)
  parts.push(`${seconds}s`)
  return parts.join(" ")
}

export function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeRemaining, setTimeRemaining] = useState<number>(() =>
    new Date(expiresAt).getTime() - Date.now()
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = new Date(expiresAt).getTime() - Date.now()
      setTimeRemaining(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  const isExpired = timeRemaining <= 0

  if (isExpired) {
    return <span className="text-red-500 font-medium">Expired</span>
  }

  return <span className="font-medium tabular-nums">{formatTimeRemaining(timeRemaining)}</span>
}
