'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CsvTemplateDownload } from '@/components/manager/csv-template-download'
import { CsvUploadZone } from '@/components/manager/csv-upload-zone'
import { FieldMappingTable } from '@/components/manager/field-mapping-table'
import { ValidationResults } from '@/components/manager/validation-results'
import { CalendarSyncConfig } from '@/components/manager/calendar-sync-config'
import { BulkPublishDialog } from '@/components/manager/bulk-publish-dialog'
import { CSV_TEMPLATE_HEADERS } from '@/lib/mock-data-events'
import type { CSVImportRow } from '@/types'

const STEPS = [
  { number: 1, label: 'Download Template' },
  { number: 2, label: 'Upload CSV' },
  { number: 3, label: 'Review & Publish' },
]

export default function BulkImportPage() {
  const [step, setStep] = useState(1)
  const [csvData, setCsvData] = useState<CSVImportRow[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [mappingConfirmed, setMappingConfirmed] = useState(false)
  const [syncCount, setSyncCount] = useState(0)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)

  function handleUpload(data: CSVImportRow[]) {
    setCsvData(data)
  }

  function handleMappingComplete(m: Record<string, string>) {
    setMapping(m)
    setMappingConfirmed(true)
  }

  function reset() {
    setStep(1)
    setCsvData([])
    setMapping({})
    setMappingConfirmed(false)
    setSyncCount(0)
    setPublishDialogOpen(false)
  }

  return (
    <div className="p-6 max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Bulk CSV Import</h1>
        <p className="text-sm text-slate-500 mt-1">Import multiple spaces at once using a CSV file.</p>
      </div>

      {/* Step indicator */}
      <nav aria-label="Import steps" className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const isActive = step === s.number
          const isComplete = step > s.number
          return (
            <div key={s.number} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    isComplete
                      ? 'bg-teal-500 text-white'
                      : isActive
                      ? 'bg-teal-500 text-white ring-4 ring-teal-100'
                      : 'bg-slate-200 text-slate-500'
                  )}
                >
                  {isComplete ? '✓' : s.number}
                </div>
                <span
                  className={cn(
                    'text-sm font-medium hidden sm:block',
                    isActive ? 'text-teal-600' : isComplete ? 'text-slate-600' : 'text-slate-500'
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-px flex-1 min-w-6',
                    isComplete ? 'bg-teal-400' : 'bg-slate-200'
                  )}
                />
              )}
            </div>
          )
        })}
      </nav>

      {/* Step content */}
      <div>
        {step === 1 && (
          <CsvTemplateDownload onReady={() => setStep(2)} />
        )}

        {step === 2 && (
          <CsvUploadZone onUpload={handleUpload} />
        )}

        {step === 3 && (
          <div className="space-y-10">
            <FieldMappingTable
              headers={CSV_TEMPLATE_HEADERS}
              onMappingComplete={handleMappingComplete}
            />

            {mappingConfirmed && csvData.length > 0 && (
              <>
                <ValidationResults data={csvData} mapping={mapping} />
                <CalendarSyncConfig
                  rows={csvData}
                  onSyncCountChange={setSyncCount}
                />
                <Button
                  className="bg-teal-500 text-white hover:bg-teal-600"
                  size="lg"
                  onClick={() => setPublishDialogOpen(true)}
                >
                  Review &amp; Publish {csvData.length} Spaces
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button
          variant="outline"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        {step < 3 && (
          <Button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 2 && csvData.length === 0}
            className="bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Publish dialog */}
      <BulkPublishDialog
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        count={csvData.length}
        syncCount={syncCount}
        rows={csvData}
        onConfirm={() => {}}
        onImportMore={reset}
      />
    </div>
  )
}
