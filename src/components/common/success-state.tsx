import { CheckCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuccessStateProps {
  icon?: LucideIcon
  title: string
  message?: string
  children?: React.ReactNode
  className?: string
}

export function SuccessState({ icon: Icon = CheckCircle, title, message, children, className }: SuccessStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-8 px-4 space-y-4", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
        <Icon className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      {message && <p className="text-sm text-slate-500 max-w-sm">{message}</p>}
      {children && <div className="flex flex-col sm:flex-row gap-3 mt-2">{children}</div>}
    </div>
  )
}
