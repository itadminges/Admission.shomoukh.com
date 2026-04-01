"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const STEPS = [
  { id: 1, label: "Student Data", shortLabel: "Student" },
  { id: 2, label: "Family Data", shortLabel: "Family" },
  { id: 3, label: "Emergency Data", shortLabel: "Emergency" },
  { id: 4, label: "Educational Background", shortLabel: "Education" },
  { id: 5, label: "Conditions & Waiver", shortLabel: "Conditions" },
  { id: 6, label: "Submit", shortLabel: "Submit" },
]

interface ProgressStepperProps {
  currentStep: number
  onStepClick?: (step: number) => void
  completedSteps: number[]
}

export function ProgressStepper({ currentStep, onStepClick, completedSteps }: ProgressStepperProps) {
  return (
    <div className="w-full">
      {/* Desktop stepper */}
      <div className="hidden md:flex items-center w-full">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isActive = currentStep === step.id
          const isPast = step.id < currentStep

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => onStepClick?.(step.id)}
                disabled={!isPast && !isCompleted && !isActive}
                className={cn(
                  "flex items-center gap-2.5 group transition-all duration-200",
                  (isPast || isCompleted) && "cursor-pointer",
                  isActive && "cursor-default",
                  !isPast && !isCompleted && !isActive && "cursor-not-allowed opacity-50"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-200 shrink-0",
                    isActive && "bg-[#C9A84C] border-[#C9A84C] text-[#1E1E2E] shadow-lg shadow-[#C9A84C]/30",
                    isCompleted && "bg-[#C9A84C] border-[#C9A84C] text-[#1E1E2E]",
                    isPast && !isCompleted && "bg-[#C9A84C]/20 border-[#C9A84C] text-[#C9A84C]",
                    !isActive && !isCompleted && !isPast && "bg-background border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <div className="flex flex-col items-start">
                  <span
                    className={cn(
                      "text-xs font-medium leading-tight",
                      isActive && "text-[#C9A84C]",
                      isCompleted && "text-[#C9A84C]",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}
                  >
                    Step {step.id}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold leading-tight whitespace-nowrap",
                      isActive && "text-foreground",
                      isCompleted && "text-foreground",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </button>

              {index < STEPS.length - 1 && (
                <div className="flex-1 mx-3">
                  <div
                    className={cn(
                      "h-0.5 w-full rounded-full transition-all duration-300",
                      (isCompleted || isPast) ? "bg-[#C9A84C]" : "bg-border"
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile stepper */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {STEPS.map((step) => {
          const isCompleted = completedSteps.includes(step.id)
          const isActive = currentStep === step.id

          return (
            <button
              key={step.id}
              onClick={() => onStepClick?.(step.id)}
              disabled={!isCompleted && !isActive && step.id > currentStep}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 border",
                isActive && "bg-[#C9A84C] border-[#C9A84C] text-[#1E1E2E]",
                isCompleted && !isActive && "bg-[#C9A84C]/10 border-[#C9A84C] text-[#C9A84C]",
                !isActive && !isCompleted && "bg-background border-border text-muted-foreground"
              )}
            >
              {isCompleted && !isActive ? (
                <Check className="w-3 h-3" strokeWidth={2.5} />
              ) : (
                <span>{step.id}.</span>
              )}
              {step.shortLabel}
            </button>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-[#C9A84C] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}
