import { PromotionWizard } from '@/components/owner/promotion-wizard'

export default function NewPromotionPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Promotion</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set up a new promotion to attract more bookings.
        </p>
      </div>
      <PromotionWizard />
    </div>
  )
}
