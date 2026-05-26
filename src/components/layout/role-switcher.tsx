'use client'

import { User, Store, Building2, Shield, CalendarHeart, Check } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore, MOCK_PERSONAS } from "@/store/auth-store"
import type { UserRole } from "@/types"

interface RoleMeta {
  icon: LucideIcon
  label: string
  badgeClass: string
}

const ROLE_META: Record<UserRole, RoleMeta> = {
  SEEKER: {
    icon: User,
    label: "Seeker",
    badgeClass: "bg-teal-100 text-teal-700",
  },
  OWNER: {
    icon: Store,
    label: "Owner",
    badgeClass: "bg-amber-100 text-amber-700",
  },
  MANAGER: {
    icon: Building2,
    label: "Manager",
    badgeClass: "bg-purple-100 text-purple-700",
  },
  ADMIN: {
    icon: Shield,
    label: "Admin",
    badgeClass: "bg-red-100 text-red-700",
  },
  EVENT_ORGANIZER: {
    icon: CalendarHeart,
    label: "Organizer",
    badgeClass: "bg-blue-100 text-blue-700",
  },
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function RoleSwitcher() {
  const { currentRole, availableRoles, switchRole } = useAuthStore()
  const meta = ROLE_META[currentRole]
  const RoleIcon = meta.icon

  return (
    <div className="fixed bottom-20 right-4 lg:bottom-4 z-50">
      <div className="bg-white/90 backdrop-blur border-2 border-dashed border-slate-300 rounded-xl shadow-lg p-1">
        <p className="text-[10px] text-center text-slate-500 font-medium leading-none mb-1 px-1">DEV</p>
        <Popover>
          <PopoverTrigger
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors hover:opacity-80 ${meta.badgeClass}`}
            aria-label="Switch role"
          >
            <RoleIcon className="size-3.5 shrink-0" />
            {meta.label}
          </PopoverTrigger>
          <PopoverContent side="top" align="end" className="w-56 p-1.5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-2 py-1">
              Switch Role
            </p>
            <div className="flex flex-col gap-0.5">
              {availableRoles.map((role) => {
                const roleMeta = ROLE_META[role]
                const RIcon = roleMeta.icon
                const persona = MOCK_PERSONAS[role]
                const isActive = role === currentRole

                return (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
                      isActive ? "bg-accent" : ""
                    }`}
                  >
                    <Avatar size="sm">
                      {persona.avatarUrl && (
                        <AvatarImage src={persona.avatarUrl} alt={persona.name} />
                      )}
                      <AvatarFallback>{getInitials(persona.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs truncate">{persona.name}</p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${roleMeta.badgeClass}`}
                      >
                        <RIcon className="size-2.5" />
                        {roleMeta.label}
                      </span>
                    </div>
                    {isActive && (
                      <Check className="size-3.5 shrink-0 text-teal-600" />
                    )}
                  </button>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
