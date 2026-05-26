"use client"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number // 1-based
  variant?: "numbered" | "dots"
}

export function StepIndicator({ steps, currentStep, variant = "numbered" }: StepIndicatorProps) {
  if (variant === "dots") {
    return (
      <div className="flex items-center justify-center gap-2" role="list" aria-label="Progress">
        {steps.map((step, i) => (
          <div
            key={i}
            role="listitem"
            aria-label={`Step ${i + 1}: ${step.label}${i + 1 === currentStep ? ' (current)' : i + 1 < currentStep ? ' (completed)' : ''}`}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-colors",
              i + 1 < currentStep && "bg-teal-500",
              i + 1 === currentStep && "bg-teal-500",
              i + 1 > currentStep && "bg-slate-200"
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center" role="list" aria-label="Progress">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center" role="listitem">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                i + 1 < currentStep && "border-teal-500 bg-teal-500 text-white",
                i + 1 === currentStep && "border-teal-500 bg-teal-500 text-white",
                i + 1 > currentStep && "border-slate-300 bg-white text-slate-500"
              )}
            >
              {i + 1 < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn(
              "mt-1.5 text-xs font-medium max-w-[72px] text-center leading-tight",
              i + 1 <= currentStep ? "text-teal-700" : "text-slate-500"
            )}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              "h-0.5 w-8 sm:w-12 mx-1 mb-5",
              i + 1 < currentStep ? "bg-teal-500" : "bg-slate-200"
            )} />
          )}
        </div>
      ))}
    </div>
  )
}
