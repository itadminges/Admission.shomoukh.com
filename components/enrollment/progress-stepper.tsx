"use client"

import { Fragment } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Check,
  User,
  Users,
  Phone,
  GraduationCap,
  FileText,
  ClipboardCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

export const STEPS: {
  id: number
  label: string
  shortLabel: string
  Icon: LucideIcon
}[] = [
  { id: 1, label: "Your child", shortLabel: "Child", Icon: User },
  { id: 2, label: "Family", shortLabel: "Family", Icon: Users },
  { id: 3, label: "Health & emergencies", shortLabel: "Health", Icon: Phone },
  { id: 4, label: "School history", shortLabel: "School", Icon: GraduationCap },
  { id: 5, label: "Policies & consent", shortLabel: "Policies", Icon: FileText },
  { id: 6, label: "Review & send", shortLabel: "Review", Icon: ClipboardCheck },
]

interface ProgressStepperProps {
  currentStep: number
  completedSteps: number[]
  onStepClick?: (step: number) => void
}

export function ProgressStepper({ currentStep, completedSteps, onStepClick }: ProgressStepperProps) {
  return (
    <div className="w-full">
      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <div className="relative flex justify-between">
          {/* Background Line */}
          <div className="absolute top-[22px] left-0 w-full h-1 bg-cream rounded-full" aria-hidden />
          
          {/* Animated Progress Line */}
          <div 
            className="absolute top-[22px] left-0 h-1 bg-gold transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(200,162,77,0.3)]"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            aria-hidden
          />

          {STEPS.map((step, index) => {
            const Icon = step.Icon
            const isCompleted = completedSteps.includes(step.id) || step.id < currentStep
            const isActive = step.id === currentStep
            const isUpcoming = step.id > currentStep
            const isClickable = isCompleted || isActive

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={cn(
                  "relative flex flex-col items-center group transition-all duration-300",
                  !isClickable && "opacity-40 cursor-not-allowed"
                )}
                title={step.label}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-4 transition-all duration-500",
                    isCompleted 
                      ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200" 
                      : isActive 
                        ? "bg-white border-gold text-gold shadow-lg shadow-gold/20 scale-110" 
                        : "bg-white border-cream text-text-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 animate-in zoom-in duration-300" strokeWidth={3} />
                  ) : (
                    <Icon className={cn("h-5 w-5", isActive ? "animate-pulse" : "")} strokeWidth={2.5} />
                  )}
                  
                  {/* Glow effect for active step */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-gold/10 animate-ping -z-10" />
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-3 flex flex-col items-center gap-0.5">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider transition-colors duration-300",
                      isActive ? "text-gold" : isCompleted ? "text-green-600" : "text-text-muted/60"
                    )}
                  >
                    Step {step.id}
                  </span>
                  <span
                    className={cn(
                      "max-w-[7rem] text-center text-[12px] font-bold leading-tight transition-colors duration-300",
                      isActive ? "text-navy" : isCompleted ? "text-navy/80" : "text-text-muted"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile Stepper */}
      <div className="md:hidden">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Step {currentStep} of {STEPS.length}</span>
              <h3 className="text-lg font-bold text-navy">{STEPS[currentStep - 1].label}</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
              {(() => {
                const ActiveIcon = STEPS[currentStep - 1].Icon
                return <ActiveIcon className="h-5 w-5 text-gold" />
              })()}
            </div>
          </div>
          
          <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {STEPS.map((step) => {
              const isCompleted = completedSteps.includes(step.id) || step.id < currentStep
              const isActive = step.id === currentStep
              const isClickable = isCompleted || isActive

              return (
                <button
                  key={step.id}
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  className={cn(
                    "flex-1 min-w-[3.5rem] h-1.5 rounded-full transition-all duration-500",
                    isActive ? "bg-gold scale-y-125 shadow-[0_0_8px_rgba(200,162,77,0.4)]" : isCompleted ? "bg-green-500" : "bg-cream"
                  )}
                  aria-label={`Step ${step.id}`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
