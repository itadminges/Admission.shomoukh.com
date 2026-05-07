"use client"

import { AlertCircle, Info, ChevronLeft, ChevronRight, Loader2, Save } from "lucide-react"
import { cn } from "@/lib/utils"
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

/* ────────────────────────────────── FormField ── */
interface FormFieldProps {
  label:     string
  arabicLabel?: string
  required?: boolean
  error?:    string
  hint?:     string
  children:  React.ReactNode
  className?: string
}

export function FormField({ label, arabicLabel, required, error, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn("group flex flex-col gap-2 transition-all duration-300", className)}>
      <Label
        className="flex items-center justify-between px-1"
      >
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-navy/70 transition-colors group-focus-within:text-gold">
          {label}
          {required && <span className="text-destructive">*</span>}
        </span>
        {arabicLabel && (
          <span className="font-arabic text-sm font-medium text-navy/60 transition-colors group-focus-within:text-gold" dir="rtl">
            {arabicLabel}
            {required && <span className="text-destructive">*</span>}
          </span>
        )}
      </Label>
      <div className="relative">
        {children}
      </div>
      {hint && !error && (
        <div className="flex items-start gap-1.5 px-1 pt-0.5 animate-fade-slide-up">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gold/60" />
          <span className="text-[11px] leading-relaxed text-text-muted">{hint}</span>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-1.5 px-1 pt-0.5 animate-fade-slide-up text-destructive">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span className="text-[11px] font-medium leading-relaxed">{error}</span>
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────── StyledInput ── */
interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function StyledInput({ className, error, ...props }: StyledInputProps) {
  return (
    <Input
      {...props}
      className={cn(
        "h-12 md:h-11 input-premium",
        error ? "border-destructive focus:ring-destructive/10" : "",
        className
      )}
    />
  )
}

/* ────────────────────────────────── StyledTextarea ── */
interface StyledTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function StyledTextarea({ className, error, ...props }: StyledTextareaProps) {
  return (
    <Textarea
      {...props}
      className={cn(
        "input-premium min-h-[100px] py-3",
        error ? "border-destructive focus:ring-destructive/10" : "",
        className
      )}
    />
  )
}

/* ────────────────────────────────── StyledSelect ── */
interface StyledSelectProps {
  value:          string
  onValueChange:  (val: string) => void
  options:        string[]
  placeholder?:   string
  error?:         boolean
  className?:     string
  disabled?:      boolean
}

export function StyledSelect({
  value, onValueChange, options, placeholder = "Choose…", error, className, disabled,
}: StyledSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={cn(
          "h-12 md:h-11 w-full input-premium",
          error ? "border-destructive focus:ring-destructive/10" : "",
          !value && "text-text-muted/60",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-xl shadow-hover border-border-soft overflow-hidden">
        {options.map((opt) => (
          <SelectItem key={opt} value={opt} className="py-2.5 text-sm focus:bg-gold/5 focus:text-gold transition-colors">
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/* ────────────────────────────────── SectionHeader ── */
interface SectionHeaderProps {
  title:        string
  arabicTitle?: string
  description?: string
  icon?:        React.ReactNode
}

export function SectionHeader({ title, arabicTitle, description, icon }: SectionHeaderProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl shadow-sm border border-border-soft bg-white">
      <div 
        className="flex items-center justify-between px-6 py-4.5 bg-navy text-white"
      >
        <div className="flex items-center gap-3.5">
          {icon && <div className="p-2 rounded-lg bg-white/10 text-gold-light">{icon}</div>}
          <h2 className="text-xs font-bold uppercase tracking-[0.2em]">{title}</h2>
        </div>
        {arabicTitle && (
          <h2 className="font-arabic text-lg font-bold" dir="rtl">{arabicTitle}</h2>
        )}
      </div>
      {description && (
        <div className="px-6 py-4 bg-cream/30 border-t border-border-soft">
          <p className="text-[13px] leading-relaxed text-text-secondary">{description}</p>
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────── RadioGroupField ── */
interface RadioGroupFieldProps {
  label:    string
  required?: boolean
  options:  { value: string; label: string }[]
  value:    string
  onChange: (val: string) => void
  error?:   string
}

export function RadioGroupField({ label, required, options, value, onChange, error }: RadioGroupFieldProps) {
  return (
    <div className="flex flex-col gap-3 group">
      <Label className="flex items-center justify-between px-1">
        <span className="text-[11px] font-bold uppercase tracking-widest text-navy/70 transition-colors group-focus-within:text-gold">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </span>
      </Label>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const isActive = value === opt.value
          return (
            <label
              key={opt.value}
              className={cn(
                "relative flex items-center gap-3 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all duration-300",
                isActive 
                  ? "border-gold bg-gold/5 shadow-sm" 
                  : "border-border-mid bg-white hover:border-gold/30 hover:bg-cream/50"
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isActive ? "border-gold bg-gold" : "border-border-mid bg-white"
                )}
              >
                {isActive && (
                  <div className="h-2 w-2 rounded-full bg-white animate-in zoom-in duration-300" />
                )}
              </div>
              <input
                type="radio"
                className="sr-only"
                value={opt.value}
                checked={isActive}
                onChange={() => onChange(opt.value)}
              />
              <span className={cn(
                "text-sm font-semibold transition-colors duration-300",
                isActive ? "text-navy" : "text-text-secondary"
              )}>
                {opt.label}
              </span>
            </label>
          )
        })}
      </div>
      {error && (
        <div className="flex items-start gap-1.5 px-1 animate-fade-slide-up text-destructive">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span className="text-[11px] font-medium">{error}</span>
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────── CheckboxField ── */
interface CheckboxFieldProps {
  label:        string | React.ReactNode
  checked:      boolean
  onChange:     (checked: boolean) => void
  error?:       string
  description?: string
}

export function CheckboxField({ label, checked, onChange, error, description }: CheckboxFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className={cn(
        "group flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
        checked ? "border-gold bg-gold/5 shadow-sm" : "border-border-soft bg-white hover:border-gold/20 hover:bg-cream/30"
      )}>
        <div className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 mt-0.5",
          checked ? "border-gold bg-gold" : "border-border-mid bg-white group-hover:border-gold/40"
        )}>
          {checked && (
            <svg className="w-4 h-4 text-white animate-in zoom-in duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
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
        <div className="flex flex-col gap-1">
          <div className={cn(
            "text-sm font-bold transition-colors duration-300",
            checked ? "text-navy" : "text-text-primary"
          )}>{label}</div>
          {description && (
            <div className="text-xs leading-relaxed text-text-muted">{description}</div>
          )}
        </div>
      </label>
      {error && (
        <div className="flex items-start gap-1.5 px-1 pt-1 animate-fade-slide-up text-destructive">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span className="text-[11px] font-medium">{error}</span>
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────── FormGrid ── */
interface FormGridProps {
  children: React.ReactNode
  cols?:    1 | 2 | 3
}

export function FormGrid({ children, cols = 2 }: FormGridProps) {
  return (
    <div
      className="grid gap-6 md:gap-8"
      style={{
        gridTemplateColumns:
          cols === 1 ? "1fr" :
          cols === 3 ? "repeat(auto-fit, minmax(min(100%, 200px), 1fr))" :
          "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
      }}
    >
      {children}
    </div>
  )
}

/* ────────────────────────────────── FormNavigation ── */
interface FormNavigationProps {
  currentStep:   number
  totalSteps:    number
  onPrevious:    () => void
  onNext:        () => void
  onSaveDraft?:  () => void
  isSubmitting?: boolean
  nextLabel?:    string
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
  const progressPercent = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="mt-12 pt-10 border-t border-border-soft">
      <div className="flex flex-col gap-8">
        {/* Progress indicator */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <span className="text-[11px] font-bold uppercase tracking-widest text-navy/40">Application Progress</span>
            <span className="text-sm font-bold text-gold">{progressPercent}% Completed</span>
          </div>
          <div className="h-2 w-full bg-cream rounded-full overflow-hidden shadow-inner-soft">
            <div 
              className="h-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 order-2 lg:order-1">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={onPrevious} 
                className="btn-ghost px-6 h-12 flex items-center gap-2 group"
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={onSaveDraft}
              className="btn-ghost px-6 h-12 flex items-center gap-2 text-gold-dark border-gold/20 hover:bg-gold/5"
            >
              <Save className="w-4 h-4" />
              Save draft
            </button>
          </div>

          <div className="order-1 lg:order-2">
            <button
              type="button"
              onClick={onNext}
              disabled={isSubmitting}
              className="btn-gold w-full lg:w-auto px-10 h-12 flex items-center justify-center gap-3 group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <span className="text-sm font-bold">{nextLabel || (isLastStep ? "Submit Application" : "Save & Continue")}</span>
                  {!isLastStep && <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                </>
              )}
            </button>
          </div>
        </div>
        
        <p className="text-center text-[11px] text-text-muted leading-relaxed max-w-md mx-auto">
          Your progress is automatically saved as you go. You can leave and return to this page anytime within the next 30 days to complete your application.
        </p>
      </div>
    </div>
  )
}
