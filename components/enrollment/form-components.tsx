"use client"

import { AlertCircle, Info, ChevronLeft, ChevronRight, Loader2, Save } from "lucide-react"
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
  required?: boolean
  error?:    string
  hint?:     string
  children:  React.ReactNode
  className?: string
}

export function FormField({ label, required, error, hint, children, className }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label
        className="text-sm font-semibold"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
        {required && <span style={{ color: "var(--gold)", marginLeft: 3 }}>*</span>}
      </Label>
      {children}
      {hint && !error && (
        <div
          className="flex items-start gap-1.5 text-xs rounded-lg px-3 py-2"
          style={{ background: "rgba(200,162,77,.07)", color: "var(--text-muted)", border: "1px solid rgba(200,162,77,.15)" }}
        >
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
          <span>{hint}</span>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-1.5 text-xs" style={{ color: "var(--destructive-color)" }}>
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────── StyledInput ── */
interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function StyledInput({ className, error, style, ...props }: StyledInputProps) {
  return (
    <Input
      {...props}
      className={className}
      style={{
        height: "2.75rem",
        borderRadius: "0.625rem",
        border: `1.5px solid ${error ? "var(--destructive-color)" : "var(--border-soft)"}`,
        background: "#fff",
        fontSize: ".875rem",
        color: "var(--text-primary)",
        transition: "border-color .2s, box-shadow .2s",
        boxShadow: error ? "0 0 0 3px rgba(220,38,38,.1)" : "none",
        ...style,
      }}
    />
  )
}

/* ────────────────────────────────── StyledTextarea ── */
interface StyledTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function StyledTextarea({ className, error, style, ...props }: StyledTextareaProps) {
  return (
    <Textarea
      {...props}
      className={`resize-none ${className ?? ""}`}
      style={{
        borderRadius: "0.625rem",
        border: `1.5px solid ${error ? "var(--destructive-color)" : "var(--border-soft)"}`,
        background: "#fff",
        fontSize: ".875rem",
        color: "var(--text-primary)",
        transition: "border-color .2s, box-shadow .2s",
        ...style,
      }}
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
  value, onValueChange, options, placeholder = "Select an option", error, className, disabled,
}: StyledSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        className={className}
        style={{
          height: "2.75rem",
          borderRadius: "0.625rem",
          border: `1.5px solid ${error ? "var(--destructive-color)" : "var(--border-soft)"}`,
          background: "#fff",
          fontSize: ".875rem",
          color: value ? "var(--text-primary)" : "var(--text-muted)",
          transition: "border-color .2s, box-shadow .2s",
        }}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {options.map((opt) => (
          <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/* ────────────────────────────────── SectionHeader ── */
interface SectionHeaderProps {
  title:        string
  description?: string
  icon?:        React.ReactNode
}

export function SectionHeader({ title, description, icon }: SectionHeaderProps) {
  return (
    <div
      className="flex items-start gap-3 pb-4 mb-5"
      style={{ borderBottom: "1px solid var(--border-soft)" }}
    >
      {icon && (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: "rgba(200,162,77,.12)" }}
        >
          <span style={{ color: "var(--gold)" }}>{icon}</span>
        </div>
      )}
      <div>
        <h2 className="text-base font-bold font-serif" style={{ color: "var(--text-primary)" }}>{title}</h2>
        {description && (
          <p className="text-sm mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>{description}</p>
        )}
      </div>
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
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
        {label}
        {required && <span style={{ color: "var(--gold)", marginLeft: 3 }}>*</span>}
      </Label>
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`radio-pill ${value === opt.value ? "active" : ""}`}
          >
            {/* Custom radio dot */}
            <div
              className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
              style={{
                borderColor: value === opt.value ? "var(--gold)" : "var(--border-mid)",
                transition: "border-color .2s",
              }}
            >
              {value === opt.value && (
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--gold)" }} />
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
        <div className="flex items-start gap-1.5 text-xs" style={{ color: "var(--destructive-color)" }}>
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
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
      <label className={`checkbox-tile ${checked ? "active" : ""}`}>
        <div className={`checkbox-box ${checked ? "checked" : ""}`}>
          {checked && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="var(--navy)" strokeWidth={3}>
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
          <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</div>
          {description && (
            <div className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>{description}</div>
          )}
        </div>
      </label>
      {error && (
        <div className="flex items-start gap-1.5 text-xs ml-1" style={{ color: "var(--destructive-color)" }}>
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
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
      className="grid gap-5"
      style={{
        gridTemplateColumns:
          cols === 1 ? "1fr" :
          cols === 3 ? "repeat(auto-fit, minmax(200px, 1fr))" :
          "repeat(auto-fit, minmax(240px, 1fr))",
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

  return (
    <div
      className="mt-8 border-t border-[var(--border-soft)] pt-8"
    >
      <p className="mb-4 text-xs" style={{ color: "var(--text-muted)" }}>
        <span style={{ color: "var(--gold)", fontWeight: 700 }}>*</span> Required fields
      </p>

      <div className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="order-2 flex flex-col justify-start gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:order-1">
          <button
            type="button"
            onClick={onSaveDraft}
            className="btn-ghost w-full justify-center text-sm sm:w-auto"
            style={{ borderColor: "rgba(200,162,77,.45)", color: "var(--gold-dark)" }}
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          {currentStep > 1 && (
            <button type="button" onClick={onPrevious} className="btn-ghost w-full justify-center text-sm sm:w-auto">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
          )}
        </div>

        <p
          className="text-center text-xs order-1 lg:order-2 lg:justify-self-center"
          style={{ color: "var(--text-muted)" }}
        >
          Your progress will be saved automatically.
        </p>

        <div className="order-3 flex justify-end lg:justify-self-end">
          <button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            className="btn-gold w-full justify-center sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Submitting…
              </>
            ) : (
              <>
                {nextLabel || (isLastStep ? "Submit Application" : "Save & Next")}
                {!isLastStep && <ChevronRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
