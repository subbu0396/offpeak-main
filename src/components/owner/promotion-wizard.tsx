'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useOwnerStore } from '@/store/owner-store'
import { getSpacesForOwner } from '@/lib/mock-data-owner'
import type { PromotionType } from '@/types'

const OWNER_ID = 'owner-001'

const PROMOTION_TYPES: { value: PromotionType; label: string }[] = [
  { value: 'DISCOUNT', label: 'Discount' },
  { value: 'FREEBIE', label: 'Freebie' },
  { value: 'FLASH_DEAL', label: 'Flash Deal' },
  { value: 'PROMO_CODE', label: 'Promo Code' },
]

export function PromotionWizard() {
  const router = useRouter()
  const { promotionWizardStep, setPromotionWizardStep, promotionDraft, updatePromotionDraft, resetPromotion } =
    useOwnerStore()

  const spaces = getSpacesForOwner(OWNER_ID)
  const [successOpen, setSuccessOpen] = useState(false)

  const type = (promotionDraft.type as PromotionType) ?? 'DISCOUNT'
  const hasDiscount = type === 'DISCOUNT' || type === 'PROMO_CODE'
  const hasPromoCode = type === 'PROMO_CODE'

  function goNext() {
    setPromotionWizardStep(promotionWizardStep + 1)
  }

  function goBack() {
    setPromotionWizardStep(promotionWizardStep - 1)
  }

  function handlePublish() {
    setSuccessOpen(true)
  }

  function handleSuccessClose() {
    setSuccessOpen(false)
    resetPromotion()
    router.push('/owner/promotions')
  }

  const selectedSpace = spaces.find((s) => s.id === promotionDraft.spaceId)

  return (
    <>
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  promotionWizardStep >= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
              {step < 3 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {promotionWizardStep === 1 && 'Type & Details'}
            {promotionWizardStep === 2 && 'Configuration'}
            {promotionWizardStep === 3 && 'Review & Publish'}
          </span>
        </div>

        {/* Step 1: Type & Details */}
        {promotionWizardStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Type & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Promotion Type</label>
                <Select
                  value={type}
                  onValueChange={(v) => v !== null && updatePromotionDraft({ type: v as PromotionType })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROMOTION_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Title</label>
                <Input
                  placeholder="e.g. 25% off weekday afternoons"
                  value={promotionDraft.title ?? ''}
                  onChange={(e) => updatePromotionDraft({ title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Terms & Conditions</label>
                <Textarea
                  placeholder="Describe the terms of this promotion..."
                  value={promotionDraft.terms ?? ''}
                  onChange={(e) => updatePromotionDraft({ terms: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={goNext} disabled={!promotionDraft.title}>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Configuration */}
        {promotionWizardStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasDiscount && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <label className="font-medium text-slate-700">Discount</label>
                    <span className="font-medium text-slate-700">
                      {promotionDraft.discountPercent ?? 20}%
                    </span>
                  </div>
                  <Slider
                    value={[promotionDraft.discountPercent ?? 20]}
                    min={5}
                    max={80}
                    onValueChange={(v) => {
                      const val = Array.isArray(v) ? v[0] : v
                      updatePromotionDraft({ discountPercent: val as number })
                    }}
                    aria-label="Discount percentage"
                  />
                </div>
              )}

              {hasPromoCode && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Promo Code</label>
                  <Input
                    placeholder="e.g. SUMMER25"
                    value={promotionDraft.promoCode ?? ''}
                    onChange={(e) =>
                      updatePromotionDraft({ promoCode: e.target.value.toUpperCase() })
                    }
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Target Space</label>
                <Select
                  value={promotionDraft.spaceId ?? ''}
                  onValueChange={(v) => v !== null && updatePromotionDraft({ spaceId: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select space" />
                  </SelectTrigger>
                  <SelectContent>
                    {spaces.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Valid From</label>
                  <Popover>
                    <PopoverTrigger className="h-10 w-full flex items-center rounded-md border border-input bg-background px-3 text-sm text-left transition-colors hover:bg-accent hover:text-accent-foreground">
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-500 shrink-0" />
                      {promotionDraft.validFrom
                        ? format(new Date(promotionDraft.validFrom), "d MMM yyyy")
                        : <span className="text-slate-500">Pick a date</span>}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={promotionDraft.validFrom ? new Date(promotionDraft.validFrom) : undefined}
                        onSelect={(date) => updatePromotionDraft({ validFrom: date?.toISOString() ?? "" })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Valid To</label>
                  <Popover>
                    <PopoverTrigger className="h-10 w-full flex items-center rounded-md border border-input bg-background px-3 text-sm text-left transition-colors hover:bg-accent hover:text-accent-foreground">
                      <CalendarIcon className="mr-2 h-4 w-4 text-slate-500 shrink-0" />
                      {promotionDraft.validTo
                        ? format(new Date(promotionDraft.validTo), "d MMM yyyy")
                        : <span className="text-slate-500">Pick a date</span>}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={promotionDraft.validTo ? new Date(promotionDraft.validTo) : undefined}
                        onSelect={(date) => updatePromotionDraft({ validTo: date?.toISOString() ?? "" })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Redemption Limit (optional)
                </label>
                <Input
                  type="number"
                  min={1}
                  placeholder="Leave blank for unlimited"
                  value={promotionDraft.redemptionLimit ?? ''}
                  onChange={(e) =>
                    updatePromotionDraft({
                      redemptionLimit: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>

              <div className="flex justify-between pt-1">
                <Button variant="outline" onClick={goBack}>
                  Back
                </Button>
                <Button onClick={goNext} disabled={!promotionDraft.spaceId || !promotionDraft.validFrom || !promotionDraft.validTo}>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Publish */}
        {promotionWizardStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Review & Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs">{type}</Badge>
                  <span className="font-medium text-slate-900">{promotionDraft.title}</span>
                </div>

                {promotionDraft.terms && (
                  <p className="text-muted-foreground text-xs">{promotionDraft.terms}</p>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedSpace && (
                    <>
                      <span className="text-muted-foreground">Space</span>
                      <span className="font-medium text-slate-900">{selectedSpace.title}</span>
                    </>
                  )}
                  {hasDiscount && promotionDraft.discountPercent && (
                    <>
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-medium text-slate-900">
                        {promotionDraft.discountPercent}%
                      </span>
                    </>
                  )}
                  {hasPromoCode && promotionDraft.promoCode && (
                    <>
                      <span className="text-muted-foreground">Promo Code</span>
                      <span className="font-medium text-slate-900">{promotionDraft.promoCode}</span>
                    </>
                  )}
                  {promotionDraft.validFrom && (
                    <>
                      <span className="text-muted-foreground">Valid From</span>
                      <span className="font-medium text-slate-900">
                        {new Date(promotionDraft.validFrom).toLocaleDateString('en-GB')}
                      </span>
                    </>
                  )}
                  {promotionDraft.validTo && (
                    <>
                      <span className="text-muted-foreground">Valid To</span>
                      <span className="font-medium text-slate-900">
                        {new Date(promotionDraft.validTo).toLocaleDateString('en-GB')}
                      </span>
                    </>
                  )}
                  {promotionDraft.redemptionLimit && (
                    <>
                      <span className="text-muted-foreground">Redemption Limit</span>
                      <span className="font-medium text-slate-900">
                        {promotionDraft.redemptionLimit}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-1">
                <Button variant="outline" onClick={goBack}>
                  Back
                </Button>
                <Button onClick={handlePublish}>Publish</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Success dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promotion Published!</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Your promotion <strong>{promotionDraft.title}</strong> has been published successfully
            and is now live.
          </p>
          <DialogFooter>
            <Button onClick={handleSuccessClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
