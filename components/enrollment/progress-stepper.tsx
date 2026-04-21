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
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="w-full">
      <div className="hidden md:block">
        <div className="flex w-full min-w-0 items-start overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
          {STEPS.map((step, index) => {
            const Icon = step.Icon
            const pastComplete =
              completedSteps.includes(step.id) && step.id < currentStep
            const activeHere = step.id === currentStep
            const clickable =
              completedSteps.includes(step.id) || step.id <= currentStep

            return (
              <Fragment key={step.id}>
                {index > 0 && (
                  <div
                    className="mx-2 mt-[20px] min-h-[1px] min-w-[12px] flex-1 bg-[var(--border-soft)]"
                    aria-hidden
                  />
                )}
                <button
                  type="button"
                  onClick={() => clickable && onStepClick?.(step.id)}
                  disabled={!clickable}
                  className="flex w-[92px] shrink-0 touch-manipulation flex-col items-center disabled:pointer-events-none disabled:opacity-40"
                  title={step.label}
                >
                  <div
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-md border-2 text-sm font-bold transition-colors",
                      pastComplete || activeHere
                        ? "border-[var(--gold)] bg-[var(--gold)] text-white" + (activeHere && !pastComplete ? " shadow-md shadow-amber-900/15" : "")
                        : "border-[#d6d3cd] bg-white text-[#a8a29e]",
                    ].join(" ")}
                  >
                    {pastComplete ? (
                      <Check className="h-5 w-5" strokeWidth={2.5} />
                    ) : activeHere ? (
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <span
                    className="mt-2.5 max-w-[7.5rem] text-center text-[11px] font-semibold leading-snug sm:text-xs"
                    style={{
                      color:
                        pastComplete || activeHere ? "var(--text-primary)" : "var(--text-muted)",
                    }}
                  >
                    {step.label}
                  </span>
                </button>
              </Fragment>
            )
          })}
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--border-soft)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-1 pb-2 [-webkit-overflow-scrolling:touch] md:hidden">
        {STEPS.map((step) => {
          const isActive = step.id === currentStep
          const isCompleted = completedSteps.includes(step.id)
          const clickable = completedSteps.includes(step.id) || step.id <= currentStep
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => clickable && onStepClick?.(step.id)}
              disabled={!clickable}
              className="snap-start flex min-h-11 shrink-0 touch-manipulation items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold disabled:pointer-events-none disabled:opacity-45"
              style={{
                borderColor: isActive || isCompleted ? "var(--gold)" : "var(--border-soft)",
                background: isActive ? "var(--gold)" : isCompleted ? "rgba(200,162,77,.12)" : "#fff",
                color: isActive ? "#fff" : isCompleted ? "var(--gold-dark)" : "var(--text-muted)",
              }}
            >
              {isCompleted && !isActive ? <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} /> : <span>{step.id}.</span>}
              {step.shortLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}
