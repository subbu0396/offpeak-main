import { VerificationWizard } from '@/components/owner/verification-wizard'

export default function VerificationPage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">
        Verification
      </h1>
      <VerificationWizard />
    </div>
  )
}
