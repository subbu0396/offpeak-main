'use client'

import { Upload, FileCheck, Camera } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface DocumentUploadCardProps {
  label: string
  description: string
  icon: LucideIcon
  onUpload: () => void
  isUploaded: boolean
  fileName?: string
}

export function DocumentUploadCard({
  label,
  description,
  icon: Icon,
  onUpload,
  isUploaded,
  fileName,
}: DocumentUploadCardProps) {
  if (isUploaded) {
    return (
      <div className="rounded-lg border-2 border-green-400 bg-green-50 p-4 flex items-start gap-4">
        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <FileCheck className="h-5 w-5 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900">{label}</p>
          <p className="text-sm text-slate-500 truncate">{fileName}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onUpload} className="shrink-0">
          Replace
        </Button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onUpload}
      className={cn(
        'w-full rounded-lg border-2 border-dashed border-slate-300 bg-white p-6',
        'flex flex-col items-center gap-3 text-center',
        'hover:border-teal-400 hover:bg-teal-50/50 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2'
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-6 w-6 text-slate-500" />
      </div>
      <div>
        <p className="font-medium text-slate-900">{label}</p>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
        <p className="text-xs text-teal-600 font-medium mt-2 flex items-center justify-center gap-1">
          <Upload className="h-3 w-3" />
          Click to upload
        </p>
      </div>
    </button>
  )
}
