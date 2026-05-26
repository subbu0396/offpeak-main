"use client"

import { useState, useEffect, useRef } from "react"

interface SimulatedQueryResult<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
}

export function useSimulatedQuery<T>(
  key: string,
  queryFn: () => T,
  delay: number = 400
): SimulatedQueryResult<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    setIsLoading(true)
    const timer = setTimeout(() => {
      try {
        const result = queryFn()
        setData(result)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
        setIsLoading(false)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading, error }
}
