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
    title: "Terms & Conditions of Enrolment",
    body: `By submitting this application, I/we acknowledge that a place will be offered whenever it is possible to best meet the perceived needs of the child. I/we understand that the school does not guarantee a student admission based on the submission of this form. Acceptance is dependent upon successful fulfillment of Shomoukh's admission requirements, including but not limited to: age eligibility, available space, assessment results where applicable, and the provision of all required documentation.

I/we agree to abide by the school's policies, procedures, and code of conduct as outlined in the Student–Parent Handbook, and to support the school in maintaining a safe, respectful, and positive learning environment for all students.`,
  },
  {
    icon: <Camera className="w-5 h-5" />,
    title: "Photography & Media Release",
    body: `I/we give permission for Shomoukh to photograph and/or video-record my/our child for educational, promotional, and communication purposes. This may include use on the school website, official social media accounts, printed publications, and internal newsletters.

I/we understand that my child will not be identified by full name in any publicly accessible media without prior consent. If you do not wish for your child to appear in school media, please notify the admissions office in writing.`,
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Medical Treatment Authorization",
    body: `In the event of an emergency and in circumstances where a parent or guardian cannot be reached in a timely manner, I/we authorize Shomoukh staff and designated medical personnel to seek and administer medical treatment deemed necessary for the health and safety of my/our child.

I/we confirm that all medical information provided in this application is accurate and complete to the best of my/our knowledge. I/we agree to promptly inform the school of any changes to the student's medical condition, allergies, or medications.`,
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Code of Conduct Agreement",
    body: `I/we have read and understood the Shomoukh Code of Conduct for students and families. I/we agree to support the school's behavioral expectations, respect all members of the school community, and actively participate in my/our child's educational journey.

I/we acknowledge that failure to comply with the code of conduct may result in consequences as outlined in the school's disciplinary policy, up to and including withdrawal from the school.`,
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
      label: "I agree to the Terms & Conditions of Enrolment",
      description: "I confirm that I have read and understood the enrolment terms above.",
    },
    {
      key: "agreeToPhotoPolicy",
      label: "I agree to the Photography & Media Release Policy",
      description: "I give permission for my child to appear in school media and publications.",
    },
    {
      key: "agreeToMedicalPolicy",
      label: "I authorize Medical Treatment in Emergency Situations",
      description: "I authorize the school to seek emergency medical treatment for my child.",
    },
    {
      key: "agreeToCodeOfConduct",
      label: "I agree to the Code of Conduct",
      description: "I commit to supporting the school's behavioral expectations and policies.",
    },
    {
      key: "declarationAccepted",
      label: "I declare that all information provided is true and accurate",
      description: "I understand that providing false information may result in the withdrawal of the application.",
    },
  ]

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Conditions & Waiver"
        description="Please read all policies carefully before signing and submitting your application."
        icon={<FileText className="w-5 h-5" />}
      />

      {/* Policy Cards */}
      <div className="space-y-4">
        {POLICY_BLOCKS.map((block, index) => (
          <details
            key={index}
            className="group border border-border/60 rounded-xl overflow-hidden"
          >
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none bg-muted/20 hover:bg-muted/40 transition-colors list-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center shrink-0 text-[#C9A84C]">
                  {block.icon}
                </div>
                <span className="text-sm font-semibold text-foreground">{block.title}</span>
              </div>
              <svg
                className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 py-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line border-t border-border/40">
              {block.body}
            </div>
          </details>
        ))}
      </div>

      {/* Acknowledgment Checkboxes */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
          Acknowledgments & Agreements
        </h3>
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
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Pen className="w-4 h-4 text-[#C9A84C]" />
          Parent / Guardian Signature
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Full Name (as signature)" required error={errors.parentSignatureName}>
            <StyledInput
              placeholder="Type your full legal name"
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
