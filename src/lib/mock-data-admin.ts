import type { FlagReport, ModerationLog } from "@/types"

export const MOCK_FLAG_REPORTS: FlagReport[] = [
  { id: "flag-001", reporterId: "seeker-001", spaceId: "space-005", reason: "Inaccurate Photos", description: "The listing shows a modern renovated space but the actual location looks completely different.", status: "OPEN", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "flag-002", reporterId: "seeker-001", spaceId: "space-008", reason: "Misleading Description", description: "Listed as 'private room' but it's actually a shared open area with no door.", status: "OPEN", photos: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"], createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "flag-003", reporterId: "organizer-001", spaceId: "space-012", reason: "Safety Concern", description: "Fire exits were blocked during my visit. This is a serious safety issue.", status: "INVESTIGATING", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "flag-004", reporterId: "seeker-001", spaceId: "space-003", reason: "Cleanliness", description: "The space was left in a dirty state — food waste on tables.", status: "RESOLVED", resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), adminAction: "REQUEST_CHANGES", adminNotes: "Owner notified and agreed to improve cleaning schedule.", createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "flag-005", reporterId: "organizer-001", spaceId: "space-015", reason: "Fake Listing", description: "This listing appears to be a duplicate of another space with different photos.", status: "DISMISSED", resolvedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), adminAction: "DISMISS", adminNotes: "Investigated — spaces are in different locations. Same owner, legitimate listings.", createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
]

export const MOCK_MODERATION_LOG: ModerationLog[] = [
  { id: "mod-001", adminId: "admin-001", spaceId: "space-003", reportId: "flag-004", action: "REQUEST_CHANGES", notes: "Requested improved cleaning process. Owner acknowledged.", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "mod-002", adminId: "admin-001", spaceId: "space-015", reportId: "flag-005", action: "DISMISS", notes: "False positive. Listings verified as separate locations.", createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "mod-003", adminId: "admin-001", spaceId: "space-010", action: "SUSPEND", notes: "Multiple complaints about access issues. Suspended pending owner resolution.", createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "mod-004", adminId: "admin-001", spaceId: "space-010", action: "APPROVE", notes: "Owner resolved access issues. Re-approved after verification.", createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
]

export function getFlaggedListings(): FlagReport[] {
  return MOCK_FLAG_REPORTS.filter(r => r.status === "OPEN" || r.status === "INVESTIGATING")
}

export function getAllFlagReports(): FlagReport[] {
  return MOCK_FLAG_REPORTS
}

export function getFlagReportById(id: string): FlagReport | undefined {
  return MOCK_FLAG_REPORTS.find(r => r.id === id)
}

export function getModerationHistory(spaceId: string): ModerationLog[] {
  return MOCK_MODERATION_LOG.filter(l => l.spaceId === spaceId)
}

export function getAllModerationLogs(): ModerationLog[] {
  return MOCK_MODERATION_LOG
}
