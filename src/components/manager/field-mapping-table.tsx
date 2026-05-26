'use client'

import { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const SYSTEM_FIELDS = [
  { value: 'title', label: 'Title' },
  { value: 'category', label: 'Category' },
  { value: 'address', label: 'Address' },
  { value: 'city', label: 'City' },
  { value: 'postcode', label: 'Postcode' },
  { value: 'capacity', label: 'Capacity' },
  { value: 'amenities', label: 'Amenities' },
  { value: 'basePrice', label: 'Base Price' },
  { value: 'offPeakDiscount', label: 'Off-Peak Discount' },
]

interface FieldMappingTableProps {
  headers: string[]
  onMappingComplete: (mapping: Record<string, string>) => void
}

export function FieldMappingTable({ headers, onMappingComplete }: FieldMappingTableProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({})

  // Auto-map on mount: if a CSV column name matches a system field value exactly, pre-select it
  useEffect(() => {
    const initial: Record<string, string> = {}
    headers.forEach(header => {
      const match = SYSTEM_FIELDS.find(f => f.value === header)
      if (match) initial[header] = match.value
    })
    setMapping(initial)
  }, [headers])

  const allMapped = headers.every(h => !!mapping[h])
  const mappedCount = Object.values(mapping).filter(Boolean).length

  function handleChange(csvHeader: string, systemField: string) {
    setMapping(prev => ({ ...prev, [csvHeader]: systemField }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Map CSV Columns</h2>
        <p className="text-sm text-slate-500">
          Match each column from your CSV to the corresponding system field.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Column Mapping</CardTitle>
              <CardDescription>{mappedCount} of {headers.length} columns mapped</CardDescription>
            </div>
            {allMapped && (
              <Badge className="bg-green-100 text-green-700 border-transparent">
                <CheckCircle className="h-3 w-3 mr-1" />
                All mapped
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-2 pr-4 text-left font-semibold text-slate-600">CSV Column</th>
                  <th className="pb-2 text-left font-semibold text-slate-600">System Field</th>
                </tr>
              </thead>
              <tbody>
                {headers.map(header => (
                  <tr key={header} className="border-b border-slate-100 last:border-0">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700">
                        {header}
                      </code>
                    </td>
                    <td className="py-2">
                      <Select
                        value={mapping[header] ?? ''}
                        onValueChange={val => val !== null && handleChange(header, val)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select field…" />
                        </SelectTrigger>
                        <SelectContent>
                          {SYSTEM_FIELDS.map(f => (
                            <SelectItem key={f.value} value={f.value}>
                              {f.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Button
        disabled={!allMapped}
        onClick={() => onMappingComplete(mapping)}
        className="bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
        size="lg"
      >
        Confirm Mapping
      </Button>
    </div>
  )
}
