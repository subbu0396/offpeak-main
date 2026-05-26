import { create } from "zustand"
import type { FlagReportStatus } from "@/types"

type ModerationFilter = FlagReportStatus | "ALL"

interface AdminState {
  selectedReportId: string | null
  moderationFilter: ModerationFilter
  selectReport: (id: string | null) => void
  setFilter: (filter: ModerationFilter) => void
}

export const useAdminStore = create<AdminState>()((set) => ({
  selectedReportId: null,
  moderationFilter: "ALL",
  selectReport: (id) => set({ selectedReportId: id }),
  setFilter: (filter) => set({ moderationFilter: filter }),
}))
