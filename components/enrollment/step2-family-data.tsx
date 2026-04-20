"use client"

import { Plus, Trash2, Users } from "lucide-react"
import {
  FormField,
  StyledInput,
  StyledSelect,
  StyledTextarea,
  SectionHeader,
  RadioGroupField,
  FormGrid,
  CheckboxField,
} from "@/components/enrollment/form-components"
import type { FamilyData, ParentGuardian } from "@/lib/enrollment-types"
import {
  NATIONALITIES,
  LANGUAGES,
  RELATIONSHIPS,
  TITLES,
  MARITAL_STATUSES,
  defaultFamilyData,
} from "@/lib/enrollment-types"

interface Step2Props {
  data: FamilyData
  onChange: (data: FamilyData) => void
  errors: Record<string, string>
}

interface ParentCardProps {
  parent: ParentGuardian
  index: number
  onChange: (updated: ParentGuardian) => void
  onRemove?: () => void
  errors: Record<string, string>
  prefix: string
}

function ParentCard({ parent, index, onChange, onRemove, errors, prefix }: ParentCardProps) {
  const update = <K extends keyof ParentGuardian>(key: K, value: ParentGuardian[K]) => {
    onChange({ ...parent, [key]: value })
  }

  return (
    <div className="border rounded-none overflow-hidden" style={{ borderColor: "var(--border-soft)" }}>
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ background: "rgba(200,162,77,.04)", borderColor: "var(--border-soft)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-none flex items-center justify-center" style={{ background: "rgba(200,162,77,.15)" }}>
            <span className="text-sm font-bold" style={{ color: "var(--gold-dark)" }}>{index + 1}</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              {parent.relationship || `Parent / Guardian ${index + 1}`}
            </h4>
            {parent.givenNames && (
              <p className="text-xs text-muted-foreground">{parent.givenNames} {parent.familyName}</p>
            )}
          </div>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
            style={{ color: "var(--destructive-color)" }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 space-y-5">
        <FormGrid cols={2}>
          <FormField label="Relationship to Student" required error={errors[`${prefix}.relationship`]}>
            <StyledSelect
              value={parent.relationship}
              onValueChange={(v) => update("relationship", v)}
              options={RELATIONSHIPS}
              error={!!errors[`${prefix}.relationship`]}
            />
          </FormField>

          <FormField label="Title">
            <StyledSelect
              value={parent.title}
              onValueChange={(v) => update("title", v)}
              options={TITLES}
            />
          </FormField>

          <FormField label="Family Name" required error={errors[`${prefix}.familyName`]}>
            <StyledInput
              placeholder="Family / surname"
              value={parent.familyName}
              onChange={(e) => update("familyName", e.target.value)}
              error={!!errors[`${prefix}.familyName`]}
            />
          </FormField>

          <FormField label="Given Names" required error={errors[`${prefix}.givenNames`]}>
            <StyledInput
              placeholder="First / given names"
              value={parent.givenNames}
              onChange={(e) => update("givenNames", e.target.value)}
              error={!!errors[`${prefix}.givenNames`]}
            />
          </FormField>

          <FormField label="Nationality" required error={errors[`${prefix}.nationality`]}>
            <StyledSelect
              value={parent.nationality}
              onValueChange={(v) => update("nationality", v)}
              options={NATIONALITIES}
              error={!!errors[`${prefix}.nationality`]}
            />
          </FormField>

          <FormField label="Occupation">
            <StyledInput
              placeholder="Current occupation"
              value={parent.occupation}
              onChange={(e) => update("occupation", e.target.value)}
            />
          </FormField>

          <FormField label="Employer / Company">
            <StyledInput
              placeholder="Employer or company name"
              value={parent.employer}
              onChange={(e) => update("employer", e.target.value)}
            />
          </FormField>
        </FormGrid>

        {/* Contact details divider */}
        <div className="h-px bg-border/40 my-1" />
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Details</h5>

        <FormGrid cols={2}>
          <FormField label="Mobile Phone" required error={errors[`${prefix}.mobilePhone`]}>
            <StyledInput
              type="tel"
              placeholder="+968 XXXX XXXX"
              value={parent.mobilePhone}
              onChange={(e) => update("mobilePhone", e.target.value)}
              error={!!errors[`${prefix}.mobilePhone`]}
            />
          </FormField>

          <FormField label="Home Phone">
            <StyledInput
              type="tel"
              placeholder="+968 XXXX XXXX"
              value={parent.homePhone}
              onChange={(e) => update("homePhone", e.target.value)}
            />
          </FormField>

          <FormField label="Work Phone">
            <StyledInput
              type="tel"
              placeholder="+968 XXXX XXXX"
              value={parent.workPhone}
              onChange={(e) => update("workPhone", e.target.value)}
            />
          </FormField>

          <FormField label="Email Address" required error={errors[`${prefix}.email`]}>
            <StyledInput
              type="email"
              placeholder="email@example.com"
              value={parent.email}
              onChange={(e) => update("email", e.target.value)}
              error={!!errors[`${prefix}.email`]}
            />
          </FormField>
        </FormGrid>

        <FormField label="Residential Address">
          <StyledTextarea
            placeholder="Full residential address"
            value={parent.residentialAddress}
            onChange={(e) => update("residentialAddress", e.target.value)}
            rows={2}
          />
        </FormField>

        <FormField label="Postal Address">
          <StyledTextarea
            placeholder="Postal / mailing address (if different)"
            value={parent.postalAddress}
            onChange={(e) => update("postalAddress", e.target.value)}
            rows={2}
          />
        </FormField>

        {/* Permissions */}
        <div className="flex flex-col gap-2">
          <CheckboxField
            label="Authorize to pick up student"
            description="This person is authorized to collect the student from school."
            checked={parent.authorizedToPickup}
            onChange={(v) => update("authorizedToPickup", v)}
          />
          <CheckboxField
            label="Add as emergency contact"
            description="This person will be contacted in case of an emergency at school."
            checked={parent.isEmergencyContact}
            onChange={(v) => update("isEmergencyContact", v)}
          />
        </div>
      </div>
    </div>
  )
}

export function Step2FamilyData({ data, onChange, errors }: Step2Props) {
  const update = <K extends keyof FamilyData>(key: K, value: FamilyData[K]) => {
    onChange({ ...data, [key]: value })
  }

  const updateParent = (index: number, updated: ParentGuardian) => {
    const parents = [...data.parents]
    parents[index] = updated
    update("parents", parents)
  }

  const addParent = () => {
    const newParent: ParentGuardian = {
      ...defaultFamilyData.parents[0],
      id: Date.now().toString(),
      relationship: "",
    }
    update("parents", [...data.parents, newParent])
  }

  const removeParent = (index: number) => {
    update("parents", data.parents.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8">
      {/* Parents / Guardians */}
      <div>
        <SectionHeader
          title="Family Data"
          description="Please provide information about the student's parents or legal guardians."
          icon={<Users className="w-5 h-5" />}
        />

        <div className="space-y-5">
          {data.parents.map((parent, index) => (
            <ParentCard
              key={parent.id}
              parent={parent}
              index={index}
              onChange={(updated) => updateParent(index, updated)}
              onRemove={data.parents.length > 1 ? () => removeParent(index) : undefined}
              errors={errors}
              prefix={`parents.${index}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addParent}
          className="mt-4 btn-ghost text-sm"
          style={{ color: "var(--gold-dark)" }}
        >
          <Plus className="w-4 h-4" />
          Add Another Parent / Guardian
        </button>
      </div>

      {/* Family Circumstances */}
      <div>
        <div className="section-divider">
          <span>Family Circumstances</span>
        </div>
        <FormGrid cols={2}>
          <FormField label="Marital Status" required error={errors.maritalStatus}>
            <StyledSelect
              value={data.maritalStatus}
              onValueChange={(v) => update("maritalStatus", v)}
              options={MARITAL_STATUSES}
              error={!!errors.maritalStatus}
            />
          </FormField>

          <FormField label="Language Spoken at Home" required error={errors.languageSpokenAtHome}>
            <StyledSelect
              value={data.languageSpokenAtHome}
              onValueChange={(v) => update("languageSpokenAtHome", v)}
              options={LANGUAGES}
              error={!!errors.languageSpokenAtHome}
            />
          </FormField>

          <div className="col-span-full">
            <FormField label="Custody Arrangement" hint="Only required if custody is shared or legally defined.">
              <StyledTextarea
                placeholder="Describe any custody arrangement relevant to the school (e.g. joint custody, sole custody, court orders...)"
                value={data.custodyArrangement}
                onChange={(e) => update("custodyArrangement", e.target.value)}
                rows={3}
              />
            </FormField>
          </div>
        </FormGrid>
      </div>
    </div>
  )
}
