"use client"

import { CheckCircle2, Clock, ArrowLeft, Download, Mail } from "lucide-react"
import type { EnrollmentFormData } from "@/lib/enrollment-types"

interface Step6SubmitProps {
  formData: EnrollmentFormData
  submitted: boolean
  referenceNumber?: string
}

export function Step6Submit({ formData, submitted, referenceNumber }: Step6SubmitProps) {
  const { studentData } = formData
  const studentName = [studentData.givenNames, studentData.familyName].filter(Boolean).join(" ") || "the student"

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-10 space-y-6">
        {/* Success Icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-[#C9A84C]" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground font-serif">Application Submitted!</h2>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            Thank you for applying to Shomoukh. We have received the enrolment application for{" "}
            <span className="font-semibold text-foreground">{studentName}</span> and will review it promptly.
          </p>
        </div>

        {referenceNumber && (
          <div className="px-6 py-4 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Application Reference Number</p>
            <p className="text-xl font-bold text-[#A07830] font-mono tracking-widest">{referenceNumber}</p>
            <p className="text-xs text-muted-foreground mt-1">Please save this for your records</p>
          </div>
        )}

        <div className="flex flex-col gap-3 items-center w-full max-w-sm">
          <div className="flex items-start gap-3 p-4 bg-muted/40 rounded-xl text-left w-full">
            <Clock className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">What happens next?</p>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Our admissions team will review your application</li>
                <li>• You will receive a confirmation email within 2–3 business days</li>
                <li>• We may contact you for additional documents or an interview</li>
                <li>• A final admission decision will be communicated in writing</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground border border-border/80 rounded-lg hover:bg-muted/50 transition-all"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#A07830] border border-[#C9A84C]/40 rounded-lg hover:bg-[#C9A84C]/10 transition-all"
            >
              <Mail className="w-4 h-4" />
              Email Copy
            </button>
          </div>

          <a
            href="https://shomoukh.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#A07830] hover:underline"
          >
            Return to Shomoukh Website
          </a>
        </div>
      </div>
    )
  }

  // Review state
  const summaryItems = [
    {
      label: "Student Name",
      value: studentName,
    },
    {
      label: "Date of Birth",
      value: studentData.dateOfBirth
        ? new Date(studentData.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : "—",
    },
    {
      label: "Nationality",
      value: studentData.nationality || "—",
    },
    {
      label: "Gender",
      value: studentData.gender || "—",
    },
    {
      label: "Grade of Entry",
      value: studentData.anticipatedGradeOfEntry || "—",
    },
    {
      label: "Enrollment Year",
      value: studentData.enrollmentYear || "—",
    },
    {
      label: "Parents / Guardians",
      value: formData.familyData.parents
        .filter((p) => p.givenNames)
        .map((p) => `${p.givenNames} ${p.familyName} (${p.relationship})`)
        .join(", ") || "—",
    },
    {
      label: "Emergency Contacts",
      value: formData.emergencyData.emergencyContacts
        .filter((c) => c.name)
        .map((c) => `${c.name} (${c.relationship})`)
        .join(", ") || "—",
    },
    {
      label: "Previous Schools",
      value: formData.educationalBackground.previousSchools.length > 0
        ? formData.educationalBackground.previousSchools.map((s) => s.schoolName).join(", ")
        : "None listed",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-border/60">
        <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-[#C9A84C]" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground font-serif">Review & Submit</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Please review the summary below before submitting your application.
          </p>
        </div>
      </div>

      {/* Summary Table */}
      <div className="rounded-xl border border-border/60 overflow-hidden">
        <div className="px-5 py-3 bg-muted/30 border-b border-border/40">
          <h3 className="text-sm font-semibold text-foreground">Application Summary</h3>
        </div>
        <div className="divide-y divide-border/40">
          {summaryItems.map((item) => (
            <div key={item.label} className="flex items-start gap-4 px-5 py-3.5">
              <span className="text-xs font-medium text-muted-foreground w-40 shrink-0 pt-0.5">{item.label}</span>
              <span className="text-sm text-foreground font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Note */}
      <div className="p-4 bg-[#C9A84C]/8 border border-[#C9A84C]/20 rounded-xl">
        <p className="text-sm text-foreground/80 leading-relaxed">
          By clicking <span className="font-semibold text-foreground">"Submit Application"</span>, you confirm that
          all information provided is accurate and complete, and that you have read and agreed to all conditions and
          policies in the previous step.
        </p>
      </div>
    </div>
  )
}
