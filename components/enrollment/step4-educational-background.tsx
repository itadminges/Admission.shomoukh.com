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
    <div className="border border-border/60 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 bg-muted/30 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C]/15 flex items-center justify-center">
            <School className="w-4 h-4 text-[#A07830]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Previous School {index + 1}
            </h4>
            {school.schoolName && (
              <p className="text-xs text-muted-foreground">{school.schoolName}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors"
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
          title="Educational Background"
          description="List all schools the student has previously attended, starting with the most recent."
          icon={<School className="w-5 h-5" />}
        />

        {data.previousSchools.length === 0 && (
          <div className="border border-dashed border-border/60 rounded-xl p-8 text-center mb-4">
            <School className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No previous schools added yet.</p>
            <p className="text-xs text-muted-foreground mt-0.5">Click the button below to add a school.</p>
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
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#A07830] border border-[#C9A84C]/40 rounded-lg hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Previous School
        </button>
      </div>

      {/* Learning & Support Needs */}
      <div>
        <SectionHeader
          title="Learning & Support Needs"
          description="This information helps us provide the right support for your child from day one. All information is kept confidential."
          icon={<Brain className="w-5 h-5" />}
        />

        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-muted/20 border border-border/40 space-y-4">
            <RadioGroupField
              label="Does the student have any identified learning difficulties or special educational needs?"
              required
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              value={data.hasLearningDifficulties === null ? "" : String(data.hasLearningDifficulties)}
              onChange={(v) => {
                update("hasLearningDifficulties", v === "true")
                if (v === "false") update("learningDifficultiesDetails", "")
              }}
              error={errors.hasLearningDifficulties}
            />

            {data.hasLearningDifficulties === true && (
              <FormField label="Please provide details">
                <StyledTextarea
                  placeholder="Describe the learning difficulties or special educational needs..."
                  value={data.learningDifficultiesDetails}
                  onChange={(e) => update("learningDifficultiesDetails", e.target.value)}
                  rows={3}
                />
              </FormField>
            )}
          </div>

          <div className="p-5 rounded-xl bg-muted/20 border border-border/40 space-y-4">
            <RadioGroupField
              label="Has the student received any specialist support or intervention services?"
              required
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              value={data.hasReceivedSpecialSupport === null ? "" : String(data.hasReceivedSpecialSupport)}
              onChange={(v) => {
                update("hasReceivedSpecialSupport", v === "true")
                if (v === "false") update("specialSupportDetails", "")
              }}
              error={errors.hasReceivedSpecialSupport}
            />

            {data.hasReceivedSpecialSupport === true && (
              <FormField label="Please describe the support received">
                <StyledTextarea
                  placeholder="e.g. Speech therapy, occupational therapy, learning support teacher..."
                  value={data.specialSupportDetails}
                  onChange={(e) => update("specialSupportDetails", e.target.value)}
                  rows={3}
                />
              </FormField>
            )}
          </div>

          <FormField
            label="Additional Information"
            hint="Include any other relevant educational background information that may assist the admissions team."
          >
            <StyledTextarea
              placeholder="Any other information you would like to share about the student's educational history..."
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
