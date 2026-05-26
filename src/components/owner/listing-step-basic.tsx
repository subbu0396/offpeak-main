'use client'

import { useOwnerStore } from '@/store/owner-store'
import { CATEGORIES } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Category } from '@/types'

interface ValidationErrors {
  title?: string
  description?: string
  category?: string
  capacity?: string
}

export function getBasicStepValid(draft: {
  title?: string
  description?: string
  category?: Category
  capacity?: number
}): boolean {
  return (
    !!draft.title &&
    draft.title.length >= 10 &&
    !!draft.description &&
    draft.description.length >= 30 &&
    !!draft.category &&
    !!draft.capacity &&
    draft.capacity >= 1
  )
}

interface ListingStepBasicProps {
  showErrors?: boolean
}

export function ListingStepBasic({ showErrors = false }: ListingStepBasicProps) {
  const { draftListing, updateDraft } = useOwnerStore()

  const errors: ValidationErrors = {}
  if (showErrors) {
    if (!draftListing.title || draftListing.title.length < 10) {
      errors.title = 'Title must be at least 10 characters'
    }
    if (!draftListing.description || draftListing.description.length < 30) {
      errors.description = 'Description must be at least 30 characters'
    }
    if (!draftListing.category) {
      errors.category = 'Please select a category'
    }
    if (!draftListing.capacity || draftListing.capacity < 1) {
      errors.capacity = 'Capacity must be at least 1'
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>
        <p className="text-sm text-slate-500 mt-1">
          Tell us about your space so seekers can find and book it.
        </p>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Listing Title <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="e.g., Cozy Corner Cafe - Off-Peak Meeting Space"
          value={draftListing.title ?? ''}
          onChange={(e) => updateDraft({ title: e.target.value })}
          className="w-full"
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title}</p>
        )}
        <p className="text-xs text-slate-500">
          {(draftListing.title ?? '').length} / 10 min chars
        </p>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          placeholder="Describe your space, ideal uses, and what makes it special..."
          value={draftListing.description ?? ''}
          onChange={(e) => updateDraft({ description: e.target.value })}
          className="min-h-[120px] w-full"
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
        <p className="text-xs text-slate-500">
          {(draftListing.description ?? '').length} / 30 min chars
        </p>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Category <span className="text-red-500">*</span>
        </label>
        <Select
          value={draftListing.category ?? ''}
          onValueChange={(val) => updateDraft({ category: val as Category })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category..." />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-red-500">{errors.category}</p>
        )}
      </div>

      {/* Capacity */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Capacity <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          min={1}
          max={500}
          placeholder="e.g., 20"
          value={draftListing.capacity ?? ''}
          onChange={(e) => updateDraft({ capacity: Number(e.target.value) })}
          className="w-full"
        />
        {errors.capacity && (
          <p className="text-xs text-red-500">{errors.capacity}</p>
        )}
        <p className="text-xs text-slate-500">Maximum number of guests (1–500)</p>
      </div>
    </div>
  )
}
