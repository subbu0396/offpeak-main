'use client'

import { useState, useRef } from 'react'
import { Upload, CheckCircle, FileText, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CSVImportRow } from '@/types'
import { MOCK_CSV_IMPORT_DATA } from '@/lib/mock-data-events'

interface CsvUploadZoneProps {
  onUpload: (data: CSVImportRow[]) => void
}

type UploadState = 'idle' | 'uploading' | 'done'

export function CsvUploadZone({ onUpload }: CsvUploadZoneProps) {
  const [state, setState] = useState<UploadState>('idle')
  const [progress, setProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startUpload() {
    if (state !== 'idle') return
    setState('uploading')
    setProgress(0)

    const start = Date.now()
    const duration = 2000

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(pct)

      if (pct >= 100) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setState('done')
        onUpload(MOCK_CSV_IMPORT_DATA)
      }
    }, 50)
  }

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setState('idle')
    setProgress(0)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    startUpload()
  }

  if (state === 'done') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">File Uploaded</h2>
          <p className="text-sm text-slate-500">Your CSV has been processed and is ready for review.</p>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4">
          <CheckCircle className="h-8 w-8 text-green-500 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-900">import-data.csv</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{MOCK_CSV_IMPORT_DATA.length} rows detected</p>
          </div>
        </div>

        <Button variant="outline" onClick={reset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Upload Another
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Upload Your CSV</h2>
        <p className="text-sm text-slate-500">
          Drop your completed CSV file here or click the zone to browse.
        </p>
      </div>

      {/* Drop zone */}
      <button
        type="button"
        onClick={startUpload}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={state === 'uploading'}
        className={[
          'w-full rounded-xl border-2 border-dashed p-12 flex flex-col items-center gap-3 transition-colors cursor-pointer outline-none',
          isDragging
            ? 'border-teal-400 bg-teal-50'
            : state === 'uploading'
            ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
            : 'border-slate-300 bg-white hover:border-teal-400 hover:bg-teal-50',
        ].join(' ')}
      >
        <Upload className={`h-10 w-10 ${isDragging ? 'text-teal-500' : 'text-slate-500'}`} />
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">
            Drag &amp; drop your CSV file or click to browse
          </p>
          <p className="text-xs text-slate-500 mt-1">Supports .csv files up to 10 MB</p>
        </div>
      </button>

      {/* Progress bar */}
      {state === 'uploading' && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Uploading import-data.csv…</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
