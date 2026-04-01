"use client"

import { useState } from "react"
import { Plus, Trash2, GraduationCap, User, Globe, BookOpen } from "lucide-react"
import {
  FormField,
  StyledInput,
  StyledSelect,
  SectionHeader,
  RadioGroupField,
  FormGrid,
} from "@/components/enrollment/form-components"
import { PhotoUpload } from "@/components/enrollment/photo-upload"
import type { StudentData, Sibling } from "@/lib/enrollment-types"
import {
  NATIONALITIES,
  LANGUAGES,
  ENGLISH_LEVELS,
  ENROLLMENT_YEARS,
  GRADE_OPTIONS,
} from "@/lib/enrollment-types"

interface Step1Props {
  data: StudentData
  onChange: (data: StudentData) => void
  errors: Partial<Record<keyof StudentData, string>>
}

export function Step1StudentData({ data, onChange, errors }: Step1Props) {
  const update = <K extends keyof StudentData>(key: K, value: StudentData[K]) => {
    onChange({ ...data, [key]: value })
  }

  const addSibling = () => {
    const newSibling: Sibling = {
      id: Date.now().toString(),
      familyName: "",
      givenNames: "",
      age: "",
    }
    update("siblings", [...data.siblings, newSibling])
  }

  const removeSibling = (id: string) => {
    update("siblings", data.siblings.filter((s) => s.id !== id))
  }

  const updateSibling = (id: string, key: keyof Sibling, value: string) => {
    update(
      "siblings",
      data.siblings.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    )
  }

  return (
    <div className="space-y-8">
      {/* Notice Banner */}
      <div className="bg-[#C9A84C]/8 border border-[#C9A84C]/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">Application for Enrolment</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A place will be offered whenever it is possible to best meet the perceived needs of the child. Parents will
          be notified when a place is available. Acceptance of the child is dependent upon successful fulfillment of
          our admission requirements. By accepting a registration form, the school does not guarantee a student
          admission.
        </p>
      </div>

      {/* Student Photo */}
      <div>
        <SectionHeader
          title="Student Data"
          description="Please fill in all required information about the student."
          icon={<User className="w-5 h-5" />}
        />
        <div className="space-y-6">
          <FormField label="Student Photo" required hint="Please upload a recent passport-size photo.">
            <PhotoUpload value={data.photoUrl} onChange={(url) => update("photoUrl", url)} />
          </FormField>
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-border/60" />
          <span>Personal Information</span>
          <div className="h-px flex-1 bg-border/60" />
        </h3>
        <FormGrid cols={2}>
          <FormField label="Family Name" required error={errors.familyName}>
            <StyledInput
              placeholder="Enter family / surname"
              value={data.familyName}
              onChange={(e) => update("familyName", e.target.value)}
              error={!!errors.familyName}
            />
          </FormField>

          <FormField label="Given Names" required error={errors.givenNames}>
            <StyledInput
              placeholder="Enter given / first names"
              value={data.givenNames}
              onChange={(e) => update("givenNames", e.target.value)}
              error={!!errors.givenNames}
            />
          </FormField>

          <FormField label="Middle Name">
            <StyledInput
              placeholder="Enter middle name (optional)"
              value={data.middleName}
              onChange={(e) => update("middleName", e.target.value)}
            />
          </FormField>

          <FormField label="To Be Known As" required error={errors.toBeKnownAs} hint="Preferred name used by staff and peers.">
            <StyledInput
              placeholder="Preferred name"
              value={data.toBeKnownAs}
              onChange={(e) => update("toBeKnownAs", e.target.value)}
              error={!!errors.toBeKnownAs}
            />
          </FormField>

          <FormField label="Date of Birth" required error={errors.dateOfBirth}>
            <StyledInput
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
              error={!!errors.dateOfBirth}
            />
          </FormField>

          <FormField label="Nationality" required error={errors.nationality}>
            <StyledSelect
              value={data.nationality}
              onValueChange={(v) => update("nationality", v)}
              options={NATIONALITIES}
              error={!!errors.nationality}
            />
          </FormField>

          <FormField label="Oman Resident Card Number">
            <StyledInput
              placeholder="Enter resident card number"
              value={data.omanResidentCardNumber}
              onChange={(e) => update("omanResidentCardNumber", e.target.value)}
            />
          </FormField>

          <div className="col-span-full">
            <RadioGroupField
              label="Gender"
              required
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
              value={data.gender}
              onChange={(v) => update("gender", v as "Male" | "Female")}
              error={errors.gender}
            />
          </div>
        </FormGrid>
      </div>

      {/* Language Information */}
      <div>
        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-border/60" />
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Language & Communication
          </span>
          <div className="h-px flex-1 bg-border/60" />
        </h3>
        <FormGrid cols={2}>
          <FormField label="First Language Spoken" required error={errors.firstLanguageSpoken}>
            <StyledSelect
              value={data.firstLanguageSpoken}
              onValueChange={(v) => update("firstLanguageSpoken", v)}
              options={LANGUAGES}
              error={!!errors.firstLanguageSpoken}
            />
          </FormField>

          <FormField label="Other Language Spoken">
            <StyledSelect
              value={data.otherLanguageSpoken}
              onValueChange={(v) => update("otherLanguageSpoken", v)}
              options={["None", ...LANGUAGES]}
            />
          </FormField>

          <FormField label="Level of English Spoken" required error={errors.levelOfEnglishSpoken}>
            <StyledSelect
              value={data.levelOfEnglishSpoken}
              onValueChange={(v) => update("levelOfEnglishSpoken", v)}
              options={ENGLISH_LEVELS}
              error={!!errors.levelOfEnglishSpoken}
            />
          </FormField>
        </FormGrid>
      </div>

      {/* Enrollment Information */}
      <div>
        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-border/60" />
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Enrollment Details
          </span>
          <div className="h-px flex-1 bg-border/60" />
        </h3>
        <FormGrid cols={2}>
          <FormField label="Enrollment Year" required error={errors.enrollmentYear}>
            <StyledSelect
              value={data.enrollmentYear}
              onValueChange={(v) => update("enrollmentYear", v)}
              options={ENROLLMENT_YEARS}
              error={!!errors.enrollmentYear}
            />
          </FormField>

          <FormField
            label="Anticipated Grade of Entry"
            required
            error={errors.anticipatedGradeOfEntry}
            hint="Students must have reached the expected age by 1st September for admission to each grade as defined in the Schedule of Fees."
          >
            <StyledSelect
              value={data.anticipatedGradeOfEntry}
              onValueChange={(v) => update("anticipatedGradeOfEntry", v)}
              options={GRADE_OPTIONS}
              error={!!errors.anticipatedGradeOfEntry}
            />
          </FormField>
        </FormGrid>
      </div>

      {/* Siblings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5" /> Siblings (Currently Enrolled)
          </h3>
        </div>

        {data.siblings.length > 0 && (
          <div className="space-y-4 mb-4">
            {data.siblings.map((sibling, index) => (
              <div
                key={sibling.id}
                className="p-5 rounded-xl border border-border/60 bg-muted/20 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Sibling {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeSibling(sibling.id)}
                    className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
                <FormGrid cols={3}>
                  <FormField label="Family Name">
                    <StyledInput
                      placeholder="Family name"
                      value={sibling.familyName}
                      onChange={(e) => updateSibling(sibling.id, "familyName", e.target.value)}
                    />
                  </FormField>
                  <FormField label="Given Names">
                    <StyledInput
                      placeholder="Given names"
                      value={sibling.givenNames}
                      onChange={(e) => updateSibling(sibling.id, "givenNames", e.target.value)}
                    />
                  </FormField>
                  <FormField label="Age">
                    <StyledInput
                      type="number"
                      placeholder="Age"
                      min="1"
                      max="25"
                      value={sibling.age}
                      onChange={(e) => updateSibling(sibling.id, "age", e.target.value)}
                    />
                  </FormField>
                </FormGrid>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addSibling}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#A07830] border border-[#C9A84C]/40 rounded-lg hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Sibling
        </button>
      </div>
    </div>
  )
}
