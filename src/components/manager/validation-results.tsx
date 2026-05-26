'use client'

import { useRef } from 'react'
import { CheckCircle, XCircle, AlertTriangle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CSVImportRow, ImportValidationResult } from '@/types'

const VALID_CATEGORIES = [
  'PARKING', 'RESTAURANT', 'HOTEL_ROOM', 'BAR',
  'COFFEE_SHOP', 'CO_WORKING', 'EVENT_VENUE', 'FUNCTION_ROOM',
]

function validateRow(row: CSVImportRow, index: number): ImportValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!row.title || row.title.trim() === '') errors.push('Title is required')
  if (!row.category || !VALID_CATEGORIES.includes(row.category.toUpperCase())) {
    errors.push(`Invalid category "${row.category}" — must be one of ${VALID_CATEGORIES.join(', ')}`)
  }
  if (!row.basePrice || row.basePrice <= 0) errors.push('Base price must be greater than 0')
  if (!row.capacity || row.capacity <= 0) errors.push('Capacity must be greater than 0')

  if (!row.amenities || row.amenities.trim() === '') warnings.push('No amenities listed')
  if (row.basePrice > 500) warnings.push(`Very high price (£${row.basePrice}/hr)`)
  if (row.offPeakDiscount > 70) warnings.push(`Very high off-peak discount (${row.offPeakDiscount}%)`)

  return {
    rowIndex: index,
    data: row,
    errors,
    warnings,
    isValid: errors.length === 0,
  }
}

interface ValidationResultsProps {
  data: CSVImportRow[]
  mapping: Record<string, string>
}

export function ValidationResults({ data }: ValidationResultsProps) {
  const results: ImportValidationResult[] = data.map((row, i) => validateRow(row, i))
  const validCount = results.filter(r => r.isValid).length
  const errorCount = results.filter(r => !r.isValid).length
  const warningCount = results.filter(r => r.warnings.length > 0).length
  const firstErrorRef = useRef<HTMLDivElement>(null)

  function scrollToFirstError() {
    firstErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  let firstErrorSet = false

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Validation Results</h2>
        <p className="text-sm text-slate-500">Review any errors or warnings before publishing.</p>
      </div>

      {/* Summary card */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-slate-700">
                <span className="font-semibold">{validCount}</span> rows valid
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-slate-700">
                <span className="font-semibold">{errorCount}</span> with errors
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-slate-700">
                <span className="font-semibold">{warningCount}</span> warnings
              </span>
            </div>
          </div>

          {errorCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-red-600 border-red-200 hover:bg-red-50"
              onClick={scrollToFirstError}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Fix &amp; Retry
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Per-row results */}
      <div className="space-y-3">
        {results.map(result => {
          const isFirstError = !result.isValid && !firstErrorSet
          if (isFirstError) firstErrorSet = true

          return (
            <div
              key={result.rowIndex}
              ref={isFirstError ? firstErrorRef : undefined}
              className={[
                'rounded-xl border p-4',
                result.isValid
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {result.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                  <span className="text-sm font-medium text-slate-900 truncate">
                    Row {result.rowIndex + 1}: {result.data.title || '(no title)'}
                  </span>
                </div>
                <div className="flex gap-1 shrink-0">
                  {result.errors.length > 0 && (
                    <Badge className="bg-red-100 text-red-700 border-transparent text-xs">
                      {result.errors.length} error{result.errors.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {result.warnings.length > 0 && (
                    <Badge className="bg-amber-100 text-amber-700 border-transparent text-xs">
                      {result.warnings.length} warning{result.warnings.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>

              {result.errors.length > 0 && (
                <ul className="mt-2 space-y-0.5 pl-6">
                  {result.errors.map((err, i) => (
                    <li key={i} className="text-xs text-red-700 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {err}
                    </li>
                  ))}
                </ul>
              )}

              {result.warnings.length > 0 && (
                <ul className="mt-2 space-y-0.5 pl-6">
                  {result.warnings.map((warn, i) => (
                    <li key={i} className="text-xs text-amber-700 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      {warn}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
