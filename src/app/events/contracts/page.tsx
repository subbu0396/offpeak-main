'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { ContractCard } from '@/components/events/contract-card'
import { useAuthStore } from '@/store/auth-store'
import { getContractsForUser } from '@/lib/mock-data-events'
import type { ContractStatus, EventContract } from '@/types'

type TabValue = 'all' | 'draft' | 'active' | 'completed' | 'cancelled'

function filterContracts(contracts: EventContract[], tab: TabValue): EventContract[] {
  switch (tab) {
    case 'draft':
      return contracts.filter((c) => c.contractStatus === 'DRAFT')
    case 'active':
      return contracts.filter((c) =>
        (['SENT', 'SIGNED', 'DEPOSIT_PAID'] as ContractStatus[]).includes(c.contractStatus)
      )
    case 'completed':
      return contracts.filter((c) => c.contractStatus === 'FINALIZED')
    case 'cancelled':
      return contracts.filter((c) => c.contractStatus === 'CANCELLED')
    default:
      return contracts
  }
}

export default function ContractsPage() {
  const { currentUser } = useAuthStore()
  const contracts = getContractsForUser(currentUser.id)
  const [activeTab, setActiveTab] = useState<TabValue>('all')

  const filtered = filterContracts(contracts, activeTab)

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Contracts</h1>
        <Button
          render={<Link href="/events/contracts/new" />}
          className="bg-teal-500 hover:bg-teal-600 text-white gap-1.5"
        >
          <PlusCircle className="h-4 w-4" />
          Create Contract
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabValue)}
      >
        <TabsList>
          <TabsTrigger value="all">All ({contracts.length})</TabsTrigger>
          <TabsTrigger value="draft">
            Draft ({contracts.filter((c) => c.contractStatus === 'DRAFT').length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({contracts.filter((c) => (['SENT', 'SIGNED', 'DEPOSIT_PAID'] as ContractStatus[]).includes(c.contractStatus)).length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({contracts.filter((c) => c.contractStatus === 'FINALIZED').length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({contracts.filter((c) => c.contractStatus === 'CANCELLED').length})
          </TabsTrigger>
        </TabsList>

        {(['all', 'draft', 'active', 'completed', 'cancelled'] as TabValue[]).map((tab) => (
          <TabsContent key={tab} value={tab}>
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
                <p className="text-slate-500 text-sm">
                  {tab === 'all'
                    ? 'No contracts yet.'
                    : `No ${tab} contracts.`}
                </p>
                {tab === 'all' && (
                  <Link
                    href="/events/contracts/new"
                    className="mt-2 inline-block text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Create your first contract
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((contract) => (
                  <ContractCard key={contract.id} contract={contract} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
