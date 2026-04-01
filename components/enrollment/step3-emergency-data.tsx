"use client"

import { Plus, Trash2, ShieldAlert, Stethoscope } from "lucide-react"
import {
  FormField,
  StyledInput,
  StyledTextarea,
  StyledSelect,
  SectionHeader,
  FormGrid,
  CheckboxField,
} from "@/components/enrollment/form-components"
import type { EmergencyData, EmergencyContact } from "@/lib/enrollment-types"
import { RELATIONSHIPS } from "@/lib/enrollment-types"

interface Step3Props {
  data: EmergencyData
  onChange: (data: EmergencyData) => void
  errors: Record<string, string>
}

interface EmergencyContactCardProps {
  contact: EmergencyContact
  index: number
  onChange: (updated: EmergencyContact) => void
  onRemove?: () => void
  errors: Record<string, string>
}

function EmergencyContactCard({ contact, index, onChange, onRemove, errors }: EmergencyContactCardProps) {
  const update = <K extends keyof EmergencyContact>(key: K, value: EmergencyContact[K]) => {
    onChange({ ...contact, [key]: value })
  }

  const prefix = `contacts.${index}`

  return (
    <div className="border border-border/60 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 bg-muted/30 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Emergency Contact {index + 1}
            </h4>
            {contact.name && (
              <p className="text-xs text-muted-foreground">{contact.name} — {contact.relationship}</p>
            )}
          </div>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1.5 text-xs text-destructive hover:text-destructive/80 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
        )}
      </div>

      <div className="p-5 space-y-5">
        <FormGrid cols={2}>
          <FormField label="Full Name" required error={errors[`${prefix}.name`]}>
            <StyledInput
              placeholder="Full name"
              value={contact.name}
              onChange={(e) => update("name", e.target.value)}
              error={!!errors[`${prefix}.name`]}
            />
          </FormField>

          <FormField label="Relationship to Student" required error={errors[`${prefix}.relationship`]}>
            <StyledSelect
              value={contact.relationship}
              onValueChange={(v) => update("relationship", v)}
              options={RELATIONSHIPS}
              error={!!errors[`${prefix}.relationship`]}
            />
          </FormField>

          <FormField label="Mobile Phone" required error={errors[`${prefix}.mobilePhone`]}>
            <StyledInput
              type="tel"
              placeholder="+968 XXXX XXXX"
              value={contact.mobilePhone}
              onChange={(e) => update("mobilePhone", e.target.value)}
              error={!!errors[`${prefix}.mobilePhone`]}
            />
          </FormField>

          <FormField label="Home Phone">
            <StyledInput
              type="tel"
              placeholder="+968 XXXX XXXX"
              value={contact.homePhone}
              onChange={(e) => update("homePhone", e.target.value)}
            />
          </FormField>

          <FormField label="Work Phone">
            <StyledInput
              type="tel"
              placeholder="+968 XXXX XXXX"
              value={contact.workPhone}
              onChange={(e) => update("workPhone", e.target.value)}
            />
          </FormField>

          <FormField label="Email Address">
            <StyledInput
              type="email"
              placeholder="email@example.com"
              value={contact.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </FormField>
        </FormGrid>

        <CheckboxField
          label="Authorized to pick up student"
          description="This person is authorized to collect the student from school."
          checked={contact.authorizedToPickup}
          onChange={(v) => update("authorizedToPickup", v)}
        />
      </div>
    </div>
  )
}

export function Step3EmergencyData({ data, onChange, errors }: Step3Props) {
  const update = <K extends keyof EmergencyData>(key: K, value: EmergencyData[K]) => {
    onChange({ ...data, [key]: value })
  }

  const addContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: "",
      relationship: "",
      mobilePhone: "",
      homePhone: "",
      workPhone: "",
      email: "",
      authorizedToPickup: false,
    }
    update("emergencyContacts", [...data.emergencyContacts, newContact])
  }

  const removeContact = (index: number) => {
    update(
      "emergencyContacts",
      data.emergencyContacts.filter((_, i) => i !== index)
    )
  }

  const updateContact = (index: number, updated: EmergencyContact) => {
    const contacts = [...data.emergencyContacts]
    contacts[index] = updated
    update("emergencyContacts", contacts)
  }

  return (
    <div className="space-y-8">
      {/* Emergency Contacts Section */}
      <div>
        <SectionHeader
          title="Emergency Contacts"
          description="Provide at least one emergency contact who can be reached if parents are unavailable. These contacts may also be authorized to collect the student."
          icon={<ShieldAlert className="w-5 h-5" />}
        />

        <div className="space-y-5">
          {data.emergencyContacts.map((contact, index) => (
            <EmergencyContactCard
              key={contact.id}
              contact={contact}
              index={index}
              onChange={(updated) => updateContact(index, updated)}
              onRemove={data.emergencyContacts.length > 1 ? () => removeContact(index) : undefined}
              errors={errors}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addContact}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#A07830] border border-[#C9A84C]/40 rounded-lg hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Add Emergency Contact
        </button>
      </div>

      {/* Medical Information */}
      <div>
        <SectionHeader
          title="Medical Information"
          description="Please provide the student's medical details so we can ensure their safety and wellbeing."
          icon={<Stethoscope className="w-5 h-5" />}
        />

        <div className="space-y-5">
          <FormGrid cols={2}>
            <FormField label="Doctor / Physician Name" required error={errors.doctorName}>
              <StyledInput
                placeholder="Full name of the doctor"
                value={data.doctorName}
                onChange={(e) => update("doctorName", e.target.value)}
                error={!!errors.doctorName}
              />
            </FormField>

            <FormField label="Doctor Phone Number" required error={errors.doctorPhone}>
              <StyledInput
                type="tel"
                placeholder="+968 XXXX XXXX"
                value={data.doctorPhone}
                onChange={(e) => update("doctorPhone", e.target.value)}
                error={!!errors.doctorPhone}
              />
            </FormField>

            <FormField label="Preferred Hospital / Medical Centre">
              <StyledInput
                placeholder="e.g. Royal Hospital, Muscat"
                value={data.hospitalPreference}
                onChange={(e) => update("hospitalPreference", e.target.value)}
              />
            </FormField>
          </FormGrid>

          <FormField
            label="Medical Conditions"
            hint="List any chronic conditions, disabilities, or health concerns the school should be aware of."
          >
            <StyledTextarea
              placeholder="e.g. Asthma, Diabetes, Epilepsy — or write 'None' if not applicable"
              value={data.medicalConditions}
              onChange={(e) => update("medicalConditions", e.target.value)}
              rows={3}
            />
          </FormField>

          <FormField
            label="Allergies"
            hint="Include food, medication, and environmental allergies."
          >
            <StyledTextarea
              placeholder="e.g. Peanuts, Penicillin, Bee stings — or write 'None' if not applicable"
              value={data.allergies}
              onChange={(e) => update("allergies", e.target.value)}
              rows={3}
            />
          </FormField>

          <FormField
            label="Current Medications"
            hint="List any regular medications the student takes, including dosage if applicable."
          >
            <StyledTextarea
              placeholder="e.g. Ventolin inhaler 100mcg — or write 'None' if not applicable"
              value={data.medications}
              onChange={(e) => update("medications", e.target.value)}
              rows={3}
            />
          </FormField>

          <FormField label="Additional Medical Information">
            <StyledTextarea
              placeholder="Any other relevant medical information the school should know about..."
              value={data.additionalMedicalInfo}
              onChange={(e) => update("additionalMedicalInfo", e.target.value)}
              rows={3}
            />
          </FormField>
        </div>
      </div>
    </div>
  )
}
