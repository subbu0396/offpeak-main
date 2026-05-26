'use client'

import { Download, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CSV_TEMPLATE_HEADERS, MOCK_CSV_IMPORT_DATA } from '@/lib/mock-data-events'

const COLUMN_DESCRIPTIONS: Record<string, string> = {
  title: 'Space display name',
  category: 'One of: PARKING, RESTAURANT, HOTEL_ROOM, BAR, COFFEE_SHOP, CO_WORKING, EVENT_VENUE, FUNCTION_ROOM',
  address: 'Street address',
  city: 'City name',
  postcode: 'Postal / ZIP code',
  capacity: 'Max number of guests (integer)',
  amenities: 'Comma-separated list of amenities',
  basePrice: 'Hourly base price in GBP (number)',
  offPeakDiscount: 'Off-peak discount percentage 0–100 (number)',
}

interface CsvTemplateDownloadProps {
  onReady: () => void
}

export function CsvTemplateDownload({ onReady }: CsvTemplateDownloadProps) {
  function handleDownload() {
    const previewRows = MOCK_CSV_IMPORT_DATA.slice(0, 2)
    const rows = [
      CSV_TEMPLATE_HEADERS.join(','),
      ...previewRows.map(row =>
        CSV_TEMPLATE_HEADERS.map(h => {
          const val = row[h as keyof typeof row]
          const str = String(val)
          return str.includes(',') ? `"${str}"` : str
        }).join(',')
      ),
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'offpeak-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const previewRows = MOCK_CSV_IMPORT_DATA.slice(0, 2)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Download CSV Template</h2>
        <p className="text-sm text-slate-500">
          Use the template below to prepare your space data. Each column is described — fill in as many rows as needed.
        </p>
      </div>

      {/* Column descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Column Reference</CardTitle>
          <CardDescription>Required fields and their expected formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {CSV_TEMPLATE_HEADERS.map(header => (
              <div key={header} className="py-2 flex items-start gap-4">
                <code className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-teal-700 w-36">
                  {header}
                </code>
                <span className="text-xs text-slate-500">{COLUMN_DESCRIPTIONS[header]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview table */}
      <Card>
        <CardHeader>
          <CardTitle>Preview (2 example rows)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  {CSV_TEMPLATE_HEADERS.map(h => (
                    <th key={h} className="pb-2 pr-4 text-left font-semibold text-slate-600 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    {CSV_TEMPLATE_HEADERS.map(h => (
                      <td key={h} className="py-2 pr-4 text-slate-700 whitespace-nowrap">
                        {String(row[h as keyof typeof row])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleDownload}
          className="bg-teal-500 text-white hover:bg-teal-600"
          size="lg"
        >
          <Download className="h-4 w-4 mr-2" />
          Download CSV Template
        </Button>
        <Button variant="outline" size="lg" onClick={onReady}>
          I have my file ready
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
