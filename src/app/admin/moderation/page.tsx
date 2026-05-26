'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ModerationQueue } from '@/components/admin/moderation-queue'
import { useAdminStore } from '@/store/admin-store'
import { getAllFlagReports } from '@/lib/mock-data-admin'
import type { FlagReportStatus } from '@/types'

type FilterTab = FlagReportStatus | 'ALL'

const TABS: { value: FilterTab; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'OPEN', label: 'Open' },
  { value: 'INVESTIGATING', label: 'Investigating' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'DISMISSED', label: 'Dismissed' },
]

const EMPTY_MESSAGES: Record<FilterTab, string> = {
  ALL: 'No flag reports found.',
  OPEN: 'No open reports. All clear!',
  INVESTIGATING: 'No reports currently under investigation.',
  RESOLVED: 'No resolved reports yet.',
  DISMISSED: 'No dismissed reports.',
}

export default function ModerationQueuePage() {
  const { moderationFilter, setFilter } = useAdminStore()
  const allReports = getAllFlagReports()

  const filteredReports =
    moderationFilter === 'ALL'
      ? allReports
      : allReports.filter(r => r.status === moderationFilter)

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Moderation Queue</h1>

      <Tabs
        value={moderationFilter}
        onValueChange={(v) => setFilter(v as FilterTab)}
      >
        <TabsList variant="line" className="w-full justify-start gap-0">
          {TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            {filteredReports.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-slate-500">{EMPTY_MESSAGES[tab.value]}</p>
              </div>
            ) : (
              <ModerationQueue reports={filteredReports} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
