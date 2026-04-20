"use client"

import { Fragment } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Check,
  User,
  Users,
  Phone,
  GraduationCap,
  FolderOpen,
  ClipboardCheck,
} from "lucide-react"

export const STEPS: {
  id: number
  label: string
  shortLabel: string
  Icon: LucideIcon
}[] = [
  { id: 1, label: "Student Profile", shortLabel: "Profile", Icon: User },
  { id: 2, label: "Family Details", shortLabel: "Family", Icon: Users },
  { id: 3, label: "Emergency Contact", shortLabel: "Emergency", Icon: Phone },
  { id: 4, label: "Learning Background", shortLabel: "Learning", Icon: GraduationCap },
  { id: 5, label: "Documents", shortLabel: "Docs", Icon: FolderOpen },
  { id: 6, label: "Review & Submit", shortLabel: "Review", Icon: ClipboardCheck },
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
        <div className="flex w-full items-start">
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
                  className="flex w-[92px] shrink-0 flex-col items-center disabled:opacity-40"
                  title={step.label}
                >
                  <div
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
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

      <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
        {STEPS.map((step) => {
          const isActive = step.id === currentStep
          const isCompleted = completedSteps.includes(step.id)
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick?.(step.id)}
              disabled={!isCompleted && !isActive && step.id > currentStep}
              className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
              style={{
                borderColor: isActive || isCompleted ? "var(--gold)" : "var(--border-soft)",
                background: isActive ? "var(--gold)" : isCompleted ? "rgba(200,162,77,.12)" : "#fff",
                color: isActive ? "#fff" : isCompleted ? "var(--gold-dark)" : "var(--text-muted)",
              }}
            >
              {isCompleted && !isActive ? <Check className="h-3 w-3" /> : <span>{step.id}.</span>}
              {step.shortLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}
