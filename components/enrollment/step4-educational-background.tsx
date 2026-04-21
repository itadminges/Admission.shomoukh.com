"use client"

import { Plus, Trash2, School, Brain } from "lucide-react"
import {
  FormField,
  StyledInput,
  StyledTextarea,
  StyledSelect,
  SectionHeader,
  RadioGroupField,
  FormGrid,
} from "@/components/enrollment/form-components"
import type { EducationalBackground, PreviousSchool } from "@/lib/enrollment-types"
import { COUNTRIES, GRADE_OPTIONS, ENROLLMENT_YEARS } from "@/lib/enrollment-types"

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i))

interface Step4Props {
  data: EducationalBackground
  onChange: (data: EducationalBackground) => void
  errors: Record<string, string>
}

interface SchoolCardProps {
  school: PreviousSchool
  index: number
  onChange: (updated: PreviousSchool) => void
  onRemove: () => void
  errors: Record<string, string>
}

function SchoolCard({ school, index, onChange, onRemove, errors }: SchoolCardProps) {
  const update = <K extends keyof PreviousSchool>(key: K, value: PreviousSchool[K]) => {
    onChange({ ...school, [key]: value })
  }
  const prefix = `schools.${index}`

  return (
    <div className="rounded-md overflow-hidden" style={{ border: "1px solid var(--border-soft)" }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ background: "rgba(200,162,77,.04)", borderColor: "var(--border-soft)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: "rgba(200,162,77,.12)" }}>
            <School className="w-4 h-4" style={{ color: "var(--gold-dark)" }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Previous School {index + 1}
            </h4>
            {school.schoolName && (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{school.schoolName}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: "var(--destructive-color)" }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>
      </div>

      <div className="p-5 space-y-4">
        <FormGrid cols={2}>
          <div className="col-span-full">
            <FormField label="School Name" required error={errors[`${prefix}.schoolName`]}>
              <StyledInput
                placeholder="Full name of the school"
                value={school.schoolName}
                onChange={(e) => update("schoolName", e.target.value)}
                error={!!errors[`${prefix}.schoolName`]}
              />
            </FormField>
          </div>

          <FormField label="Country" required error={errors[`${prefix}.country`]}>
            <StyledSelect
              value={school.country}
              onValueChange={(v) => update("country", v)}
              options={COUNTRIES}
              error={!!errors[`${prefix}.country`]}
            />
          </FormField>

          <FormField label="City / Town">
            <StyledInput
              placeholder="City or town"
              value={school.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </FormField>

          <FormField label="From Year">
            <StyledSelect
              value={school.fromYear}
              onValueChange={(v) => update("fromYear", v)}
              options={YEARS}
              placeholder="Select year"
            />
          </FormField>

          <FormField label="To Year">
            <StyledSelect
              value={school.toYear}
              onValueChange={(v) => update("toYear", v)}
              options={["Present", ...YEARS]}
              placeholder="Select year"
            />
          </FormField>

          <FormField label="Grade / Year Level Attended">
            <StyledSelect
              value={school.gradeAttended}
              onValueChange={(v) => update("gradeAttended", v)}
              options={GRADE_OPTIONS}
            />
          </FormField>

          <FormField label="Reason for Leaving">
            <StyledInput
              placeholder="e.g. Relocation, graduation"
              value={school.reasonForLeaving}
              onChange={(e) => update("reasonForLeaving", e.target.value)}
            />
          </FormField>
        </FormGrid>
      </div>
    </div>
  )
}

export function Step4EducationalBackground({ data, onChange, errors }: Step4Props) {
  const update = <K extends keyof EducationalBackground>(key: K, value: EducationalBackground[K]) => {
    onChange({ ...data, [key]: value })
  }

  const addSchool = () => {
    const newSchool: PreviousSchool = {
      id: Date.now().toString(),
      schoolName: "",
      country: "",
      city: "",
      fromYear: "",
      toYear: "",
      gradeAttended: "",
      reasonForLeaving: "",
    }
    update("previousSchools", [...data.previousSchools, newSchool])
  }

  const removeSchool = (index: number) => {
    update("previousSchools", data.previousSchools.filter((_, i) => i !== index))
  }

  const updateSchool = (index: number, updated: PreviousSchool) => {
    const schools = [...data.previousSchools]
    schools[index] = updated
    update("previousSchools", schools)
  }

  return (
    <div className="space-y-8">
      {/* Previous Schools */}
      <div>
        <SectionHeader
          title="School history"
          description="Most recent first. Skip this block if they have not started school yet."
          icon={<School className="w-5 h-5" />}
        />

        {data.previousSchools.length === 0 && (
          <div
            className="rounded-md p-8 text-center mb-4"
            style={{ border: "1.5px dashed var(--border-mid)", background: "rgba(200,162,77,.03)" }}
          >
            <div
              className="w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-3"
              style={{ background: "rgba(200,162,77,.08)" }}
            >
              <School className="w-6 h-6" style={{ color: "var(--gold)" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>No schools listed yet.</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>First time in a setting? Go straight to the next section.</p>
          </div>
        )}

        {data.previousSchools.length > 0 && (
          <div className="space-y-5 mb-4">
            {data.previousSchools.map((school, index) => (
              <SchoolCard
                key={school.id}
                school={school}
                index={index}
                onChange={(updated) => updateSchool(index, updated)}
                onRemove={() => removeSchool(index)}
                errors={errors}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addSchool}
          className="btn-ghost text-sm"
          style={{ color: "var(--gold-dark)" }}
        >
          <Plus className="w-4 h-4" />
          Add a school
        </button>
      </div>

      {/* Learning & Support Needs */}
      <div>
        <SectionHeader
          title="Learning & extra support"
          description="Helps us line up the right classroom support early. Read only by admissions and learning support."
          icon={<Brain className="w-5 h-5" />}
        />

        <div className="space-y-6">
          <div
            className="p-5 rounded-md space-y-4"
            style={{ background: "rgba(200,162,77,.03)", border: "1px solid var(--border-soft)" }}
          >
            <RadioGroupField
              label="Any diagnosed learning difference or SEND we should plan for?"
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              value={data.hasLearningDifficulties === null ? "" : String(data.hasLearningDifficulties)}
              onChange={(v) => {
                update("hasLearningDifficulties", v === "true")
                if (v === "false") update("learningDifficultiesDetails", "")
              }}
            />

            {data.hasLearningDifficulties === true && (
              <FormField label="Briefly what we should know">
                <StyledTextarea
                  placeholder="Diagnosis, reports, what helps in class…"
                  value={data.learningDifficultiesDetails}
                  onChange={(e) => update("learningDifficultiesDetails", e.target.value)}
                  rows={3}
                />
              </FormField>
            )}
          </div>

          <div
            className="p-5 rounded-md space-y-4"
            style={{ background: "rgba(200,162,77,.03)", border: "1px solid var(--border-soft)" }}
          >
            <RadioGroupField
              label="Speech, OT, learning support outside school before?"
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              value={data.hasReceivedSpecialSupport === null ? "" : String(data.hasReceivedSpecialSupport)}
              onChange={(v) => {
                update("hasReceivedSpecialSupport", v === "true")
                if (v === "false") update("specialSupportDetails", "")
              }}
            />

            {data.hasReceivedSpecialSupport === true && (
              <FormField label="What worked, for how long?">
                <StyledTextarea
                  placeholder="e.g. Weekly speech — 6 months — Starshine Clinic"
                  value={data.specialSupportDetails}
                  onChange={(e) => update("specialSupportDetails", e.target.value)}
                  rows={3}
                />
              </FormField>
            )}
          </div>

          <FormField label="Anything else" hint="Reports, repeating a year, big moves between systems — optional.">
            <StyledTextarea
              placeholder="Short note is fine."
              value={data.additionalInfo}
              onChange={(e) => update("additionalInfo", e.target.value)}
              rows={4}
            />
          </FormField>
        </div>
      </div>
    </div>
  )
}
