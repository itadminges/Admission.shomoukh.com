"use client"

import { cn } from "@/lib/utils"
import { AlertCircle, Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, required, error, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className={cn("text-sm font-medium text-foreground/90", required && "after:content-['*'] after:ml-0.5 after:text-[#C9A84C]")}>
        {label}
      </Label>
      {children}
      {hint && !error && (
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#C9A84C]" />
          <span>{hint}</span>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-1.5 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function StyledInput({ className, error, ...props }: StyledInputProps) {
  return (
    <Input
      {...props}
      className={cn(
        "h-11 bg-background border-border/80 rounded-lg text-sm transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50 focus-visible:border-[#C9A84C]",
        "placeholder:text-muted-foreground/50",
        error && "border-destructive focus-visible:ring-destructive/30",
        className
      )}
    />
  )
}

interface StyledTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function StyledTextarea({ className, error, ...props }: StyledTextareaProps) {
  return (
    <Textarea
      {...props}
      className={cn(
        "bg-background border-border/80 rounded-lg text-sm transition-all duration-200 resize-none",
        "focus-visible:ring-2 focus-visible:ring-[#C9A84C]/50 focus-visible:border-[#C9A84C]",
        "placeholder:text-muted-foreground/50",
        error && "border-destructive focus-visible:ring-destructive/30",
        className
      )}
    />
  )
}

interface StyledSelectProps {
  value: string
  onValueChange: (val: string) => void
  options: string[]
  placeholder?: string
  error?: boolean
  className?: string
  disabled?: boolean
}

export function StyledSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  error,
  className,
  disabled,
}: StyledSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "h-11 bg-background border-border/80 rounded-lg text-sm transition-all duration-200",
          "focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C]",
          !value && "text-muted-foreground/50",
          error && "border-destructive",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        {options.map((opt) => (
          <SelectItem key={opt} value={opt} className="text-sm">
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface SectionHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export function SectionHeader({ title, description, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-border/60 mb-6">
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center shrink-0 mt-0.5">
          <div className="text-[#C9A84C]">{icon}</div>
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold text-foreground font-serif">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  )
}

interface RadioGroupFieldProps {
  label: string
  required?: boolean
  options: { value: string; label: string }[]
  value: string
  onChange: (val: string) => void
  error?: string
}

export function RadioGroupField({ label, required, options, value, onChange, error }: RadioGroupFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className={cn("text-sm font-medium text-foreground/90", required && "after:content-['*'] after:ml-0.5 after:text-[#C9A84C]")}>
        {label}
      </Label>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "flex items-center gap-2.5 px-4 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 text-sm font-medium",
              value === opt.value
                ? "border-[#C9A84C] bg-[#C9A84C]/10 text-[#A07830]"
                : "border-border/80 bg-background text-foreground hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                value === opt.value ? "border-[#C9A84C]" : "border-border"
              )}
            >
              {value === opt.value && (
                <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
              )}
            </div>
            <input
              type="radio"
              className="sr-only"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
      {error && (
        <div className="flex items-start gap-1.5 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

interface CheckboxFieldProps {
  label: string | React.ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
  description?: string
}

export function CheckboxField({ label, checked, onChange, error, description }: CheckboxFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className={cn(
          "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200",
          checked
            ? "border-[#C9A84C] bg-[#C9A84C]/5"
            : "border-border/80 bg-background hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5"
        )}
      >
        <div
          className={cn(
            "w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 mt-0.5 transition-all",
            checked ? "border-[#C9A84C] bg-[#C9A84C]" : "border-border"
          )}
        >
          {checked && (
            <svg className="w-3 h-3 text-[#1E1E2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div>
          <div className="text-sm font-medium text-foreground">{label}</div>
          {description && <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</div>}
        </div>
      </label>
      {error && (
        <div className="flex items-start gap-1.5 text-xs text-destructive ml-1">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

interface FormGridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3
}

export function FormGrid({ children, cols = 2 }: FormGridProps) {
  return (
    <div
      className={cn(
        "grid gap-5",
        cols === 1 && "grid-cols-1",
        cols === 2 && "grid-cols-1 md:grid-cols-2",
        cols === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {children}
    </div>
  )
}

interface FormNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onSaveDraft?: () => void
  isSubmitting?: boolean
  nextLabel?: string
}

export function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSaveDraft,
  isSubmitting,
  nextLabel,
}: FormNavigationProps) {
  const isLastStep = currentStep === totalSteps

  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-border/60">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          <span className="text-[#C9A84C] font-semibold">*</span> denotes Required Fields
        </span>
      </div>
      <div className="flex items-center gap-3">
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border/80 rounded-lg hover:bg-muted/50 transition-all duration-200"
          >
            Save Draft
          </button>
        )}
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onPrevious}
            className="px-5 py-2.5 text-sm font-medium text-foreground border border-border/80 rounded-lg hover:bg-muted/50 transition-all duration-200"
          >
            Previous
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className={cn(
            "px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
            "bg-[#C9A84C] hover:bg-[#A07830] text-[#1E1E2E]",
            "shadow-md shadow-[#C9A84C]/20 hover:shadow-lg hover:shadow-[#C9A84C]/30",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {isSubmitting ? "Submitting..." : (nextLabel || (isLastStep ? "Submit Application" : "Save & Next"))}
        </button>
      </div>
    </div>
  )
}
