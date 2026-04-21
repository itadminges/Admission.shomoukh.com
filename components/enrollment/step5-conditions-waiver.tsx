"use client"

import { FileText, ShieldCheck, Camera, Heart, Pen } from "lucide-react"
import {
  FormField,
  StyledInput,
  SectionHeader,
  CheckboxField,
} from "@/components/enrollment/form-components"
import type { ConditionsWaiver } from "@/lib/enrollment-types"

interface Step5Props {
  data: ConditionsWaiver
  onChange: (data: ConditionsWaiver) => void
  errors: Partial<Record<keyof ConditionsWaiver, string>>
}

const POLICY_BLOCKS = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Enrolment terms",
    body: `Sending this form does not reserve a place by itself. We offer seats when age, capacity, assessments (if needed), and paperwork line up — same rules for every family.

You agree to follow the policies in the parent handbook and to work with staff so every child can learn safely.`,
  },
  {
    icon: <Camera className="w-5 h-5" />,
    title: "Photos & video",
    body: `Shomoukh may photograph or film children for teaching, newsletters, and fair promotion — website, social channels, print, and screens inside school.

We do not publish full names beside photos without asking. If you prefer no public images, tell admissions in writing.`,
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Emergency medical care",
    body: `If there is an emergency and we cannot reach you quickly, you authorise staff or medics we call to treat your child as needed.

Medical answers on this form must stay accurate — tell us straight away when something changes.`,
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Behaviour & community",
    body: `Parents and children follow the same code of conduct: kindness, punctuality, honest communication.

Serious or repeated breaches are handled through the discipline policy and can include withdrawal in extreme cases.`,
  },
]

export function Step5ConditionsWaiver({ data, onChange, errors }: Step5Props) {
  const update = <K extends keyof ConditionsWaiver>(key: K, value: ConditionsWaiver[K]) => {
    onChange({ ...data, [key]: value })
  }

  const checkboxConfigs: Array<{
    key: keyof ConditionsWaiver
    label: string
    description?: string
  }> = [
    {
      key: "agreeToTerms",
      label: "We accept the enrolment conditions above",
      description: "Including age, space, and paperwork rules.",
    },
    {
      key: "agreeToPhotoPolicy",
      label: "Photos & filming for school use",
      description: "As described — tell admissions if this should not include our child.",
    },
    {
      key: "agreeToMedicalPolicy",
      label: "Emergency medical treatment if parents cannot be reached",
      description: "Staff may act in the child’s immediate interest.",
    },
    {
      key: "agreeToCodeOfConduct",
      label: "Parent & pupil code of conduct",
      description: "We will uphold expectations at home as well as at school.",
    },
    {
      key: "declarationAccepted",
      label: "This application is truthful",
      description: "Deliberately false answers can void the offer.",
    },
  ]

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Policies & signatures"
        description="Expand each panel to read the wording, then tick every box — same weight as ink on paper."
        icon={<FileText className="w-5 h-5" />}
      />

      {/* Policy Cards */}
      <div className="space-y-3">
        {POLICY_BLOCKS.map((block, index) => (
          <details
            key={index}
            className="group rounded-md overflow-hidden"
            style={{ border: "1px solid var(--border-soft)" }}
          >
            <summary
              className="flex items-center justify-between px-5 py-4 cursor-pointer select-none list-none transition-colors"
              style={{ background: "rgba(200,162,77,.04)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: "rgba(200,162,77,.12)", color: "var(--gold)" }}
                >
                  {block.icon}
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{block.title}</span>
              </div>
              <svg
                className="w-4 h-4 transition-transform group-open:rotate-180"
                style={{ color: "var(--text-muted)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div
              className="px-5 py-4 text-sm leading-relaxed whitespace-pre-line"
              style={{ color: "var(--text-secondary)", borderTop: "1px solid var(--border-soft)" }}
            >
              {block.body}
            </div>
          </details>
        ))}
      </div>

      {/* Acknowledgment Checkboxes */}
      <div>
        <div className="section-divider">
          <ShieldCheck className="w-4 h-4" style={{ color: "var(--gold)" }} />
          <span>Confirm each point</span>
        </div>
        <div className="space-y-3">
          {checkboxConfigs.map(({ key, label, description }) => (
            <CheckboxField
              key={key}
              label={label}
              description={description}
              checked={data[key] as boolean}
              onChange={(v) => update(key, v)}
              error={errors[key]}
            />
          ))}
        </div>
      </div>

      {/* Parent Signature */}
      <div>
        <div className="section-divider">
          <Pen className="w-4 h-4" style={{ color: "var(--gold)" }} />
          <span>Electronic signature</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Signing parent — full legal name" required error={errors.parentSignatureName}>
            <StyledInput
              placeholder="As on ID or passport"
              value={data.parentSignatureName}
              onChange={(e) => update("parentSignatureName", e.target.value)}
              error={!!errors.parentSignatureName}
            />
          </FormField>
          <FormField label="Date" required error={errors.signatureDate}>
            <StyledInput
              type="date"
              value={data.signatureDate}
              onChange={(e) => update("signatureDate", e.target.value)}
              error={!!errors.signatureDate}
            />
          </FormField>
        </div>
      </div>
    </div>
  )
}
