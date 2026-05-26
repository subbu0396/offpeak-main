import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, UserRole } from "@/types"

export const MOCK_PERSONAS: Record<UserRole, User> = {
  SEEKER: {
    id: "seeker-001", name: "Alex Morgan", email: "alex@example.com",
    role: "SEEKER", avatarUrl: "/images/avatar-placeholder.jpg",
    phone: "+44 7700 900123", verificationStatus: "VERIFIED", createdAt: "2025-09-15T10:00:00Z"
  },
  OWNER: {
    id: "owner-001", name: "Sarah Okafor", email: "sarah@example.com",
    role: "OWNER", phone: "+44 7700 900456", verificationStatus: "VERIFIED", createdAt: "2025-06-01T10:00:00Z"
  },
  MANAGER: {
    id: "manager-001", name: "Rachel Torres", email: "rachel@example.com",
    role: "MANAGER", phone: "+44 7700 900789", verificationStatus: "VERIFIED", createdAt: "2025-03-15T10:00:00Z"
  },
  ADMIN: {
    id: "admin-001", name: "System Admin", email: "admin@offpeak.com",
    role: "ADMIN", verificationStatus: "VERIFIED", createdAt: "2025-01-01T10:00:00Z"
  },
  EVENT_ORGANIZER: {
    id: "organizer-001", name: "Liam Grant", email: "liam@events.co",
    role: "EVENT_ORGANIZER", phone: "+44 7700 901234", verificationStatus: "VERIFIED", createdAt: "2025-08-10T10:00:00Z"
  },
}

interface AuthState {
  currentUser: User
  currentRole: UserRole
  switchRole: (role: UserRole) => void
  availableRoles: UserRole[]
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: MOCK_PERSONAS.SEEKER,
      currentRole: "SEEKER" as UserRole,
      availableRoles: ["SEEKER", "OWNER", "MANAGER", "ADMIN", "EVENT_ORGANIZER"] as UserRole[],
      switchRole: (role) => set({
        currentRole: role,
        currentUser: MOCK_PERSONAS[role],
      }),
    }),
    {
      name: "offpeak-auth-store",
      partialize: (state) => ({ currentRole: state.currentRole }),
      // On rehydrate, restore the full user from the role
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.currentUser = MOCK_PERSONAS[state.currentRole]
        }
      },
    }
  )
)
