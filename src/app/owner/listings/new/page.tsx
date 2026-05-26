import { ListingWizard } from '@/components/owner/listing-wizard'

export default function NewListingPage() {
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">
        Create New Listing
      </h1>
      <ListingWizard />
    </div>
  )
}
