'use client'

import { use } from 'react'
import { ContractWizard } from '@/components/events/contract-wizard'

interface NewContractPageProps {
  searchParams: Promise<{ spaceId?: string }>
}

export default function NewContractPage({ searchParams }: NewContractPageProps) {
  const { spaceId } = use(searchParams)
  return <ContractWizard preSelectedSpaceId={spaceId} />
}
