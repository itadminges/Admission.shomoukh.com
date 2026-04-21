"use client"

import { Plus, Trash2, GraduationCap, User, Globe, BookOpen, Info } from "lucide-react"
import {
  FormField,
  StyledInput,
  StyledSelect,
  SectionHeader,
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
      {/* Student Photo */}
      <div>
        <SectionHeader
          title="Photo"
          description="Plain background, face visible — same idea as a passport photo."
          icon={<User className="w-5 h-5" />}
        />
        <div className="space-y-6">
          <FormField label="Upload" required hint="JPG or PNG, up to 5 MB. Drag in or click to browse.">
            <PhotoUpload value={data.photoUrl} onChange={(url) => update("photoUrl", url)} />
          </FormField>
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <div className="section-divider">
          <span>Child&apos;s details</span>
        </div>
        <FormGrid cols={2}>
          <FormField label="Family Name" required error={errors.familyName}>
            <StyledInput
              placeholder="Family name"
              value={data.familyName}
              onChange={(e) => update("familyName", e.target.value)}
              error={!!errors.familyName}
            />
          </FormField>

          <FormField label="Given Names" required error={errors.givenNames}>
            <StyledInput
              placeholder="First names as on birth certificate"
              value={data.givenNames}
              onChange={(e) => update("givenNames", e.target.value)}
              error={!!errors.givenNames}
            />
          </FormField>

          <FormField label="Middle Name">
            <StyledInput
              placeholder="Middle name if applicable"
              value={data.middleName}
              onChange={(e) => update("middleName", e.target.value)}
            />
          </FormField>

          <FormField label="Known as" required error={errors.toBeKnownAs} hint="What teachers and classmates should call them.">
            <StyledInput
              placeholder="e.g. Ali, Mimi"
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
            <FormField label="Gender" required error={errors.gender}>
              <div className="flex flex-wrap gap-10 pt-1">
                {(["Male", "Female"] as const).map((opt) => (
                  <label key={opt} className="flex cursor-pointer items-center gap-2.5">
                    <input
                      type="radio"
                      className="sr-only"
                      checked={data.gender === opt}
                      onChange={() => update("gender", opt)}
                    />
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors"
                      style={{
                        borderColor: data.gender === opt ? "var(--gold)" : "var(--border-mid)",
                      }}
                    >
                      {data.gender === opt && (
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--gold)" }} />
                      )}
                    </span>
                    <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </FormField>
          </div>
        </FormGrid>
      </div>

      {/* Language Information */}
      <div>
        <div className="section-divider">
          <Globe className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
          <span>Languages</span>
        </div>
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
        <div className="section-divider">
          <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
          <span>Year &amp; class</span>
        </div>
        <FormGrid cols={2}>
          <FormField label="School year starting" required error={errors.enrollmentYear}>
            <StyledSelect
              value={data.enrollmentYear}
              onValueChange={(v) => update("enrollmentYear", v)}
              options={ENROLLMENT_YEARS}
              error={!!errors.enrollmentYear}
            />
          </FormField>

          <FormField
            label="Grade or class applying for"
            required
            error={errors.anticipatedGradeOfEntry}
            hint="Age cut-offs follow our fee schedule — 1 September each year."
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
        <div className="section-divider">
          <GraduationCap className="w-3.5 h-3.5" style={{ color: "var(--gold)" }} />
          <span>Siblings already at Shomoukh</span>
        </div>

        {data.siblings.length > 0 && (
          <div className="space-y-4 mb-4">
            {data.siblings.map((sibling, index) => (
              <div
                key={sibling.id}
                className="space-y-4 rounded-md p-4"
                style={{ background: "rgba(200,162,77,.04)", border: "1px solid var(--border-soft)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>Sibling {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeSibling(sibling.id)}
                    className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                    style={{ color: "var(--destructive-color)" }}
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
          className="btn-ghost text-sm"
          style={{ color: "var(--gold-dark)" }}
        >
          <Plus className="w-4 h-4" />
          Add Sibling
        </button>
      </div>

      {/* Age requirements — mockup info strip */}
      <div className="flex items-start gap-3 rounded-md border border-[#e5e7eb] bg-[#f3f4f6] px-4 py-3.5">
        <Info className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--gold)" }} strokeWidth={2} />
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Age cut-off: </span>
          For each class we use the child&apos;s age on 1 September — details sit with the fee schedule your admissions
          contact can share.
        </p>
      </div>
    </div>
  )
}
