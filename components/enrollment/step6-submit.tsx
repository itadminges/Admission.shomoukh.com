"use client"

import { CheckCircle2, Clock, Download, Mail, ArrowRight } from "lucide-react"
import type { EnrollmentFormData } from "@/lib/enrollment-types"

interface Step6SubmitProps {
  formData:         EnrollmentFormData
  submitted:        boolean
  referenceNumber?: string
}

export function Step6Submit({ formData, submitted, referenceNumber }: Step6SubmitProps) {
  const { studentData } = formData
  const studentName = [studentData.givenNames, studentData.familyName].filter(Boolean).join(" ") || "the student"

  /* ── SUCCESS STATE ── */
  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-12 space-y-8 animate-fade-slide-up">

        <div className="relative">
          <div
            className="flex h-28 w-28 items-center justify-center rounded-full"
            style={{ background: "rgba(200,162,77,.1)", border: "2px solid rgba(200,162,77,.35)" }}
          >
            <CheckCircle2 className="w-16 h-16" style={{ color: "var(--gold)" }} strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-green-700 bg-green-600">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="space-y-2 max-w-md">
          <h2 className="text-3xl font-bold font-serif" style={{ color: "var(--text-primary)" }}>
            Application Submitted!
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Thank you for applying to Shomoukh. We have received the enrolment application for{" "}
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>{studentName}</span>{" "}
            and will review it promptly.
          </p>
        </div>

        {/* Reference number card */}
        {referenceNumber && (
          <div
            className="px-8 py-5 rounded-2xl text-center"
            style={{
              background: "rgba(200,162,77,.08)",
              border: "1.5px solid rgba(200,162,77,.3)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              Application Reference Number
            </p>
            <p
              className="text-2xl font-bold font-mono tracking-widest"
              style={{ color: "var(--gold-dark)" }}
            >
              {referenceNumber}
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              Please save this reference for your records
            </p>
          </div>
        )}

        {/* Next steps */}
        <div
          className="flex items-start gap-4 p-5 rounded-2xl text-left w-full max-w-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--border-soft)" }}
        >
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "rgba(200,162,77,.12)" }}
          >
            <Clock className="w-4.5 h-4.5" style={{ color: "var(--gold)" }} />
          </div>
          <div>
            <p className="text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>What happens next?</p>
            <ul className="space-y-1.5">
              {[
                "Our admissions team will review your application",
                "You will receive a confirmation email within 2–3 business days",
                "We may contact you for additional documents or an interview",
                "A final admission decision will be communicated in writing",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <ArrowRight className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button type="button" className="btn-ghost text-sm">
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button type="button" className="btn-ghost text-sm" style={{ color: "var(--gold-dark)" }}>
            <Mail className="w-4 h-4" />
            Email Copy
          </button>
        </div>

        <a
          href="https://shomoukh.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:underline"
          style={{ color: "var(--gold)" }}
        >
          Return to Shomoukh Website →
        </a>
      </div>
    )
  }

  /* ── REVIEW STATE ── */
  const summaryItems = [
    { label: "Student Name",       value: studentName },
    {
      label: "Date of Birth",
      value: studentData.dateOfBirth
        ? new Date(studentData.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : "—",
    },
    { label: "Nationality",        value: studentData.nationality || "—" },
    { label: "Gender",             value: studentData.gender || "—" },
    { label: "Grade of Entry",     value: studentData.anticipatedGradeOfEntry || "—" },
    { label: "Enrollment Year",    value: studentData.enrollmentYear || "—" },
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
      <div
        className="flex flex-col items-center text-center space-y-3 pb-6"
        style={{ borderBottom: "1px solid var(--border-soft)" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(200,162,77,.12)", border: "1px solid rgba(200,162,77,.2)" }}
        >
          <CheckCircle2 className="w-9 h-9" style={{ color: "var(--gold)" }} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-serif" style={{ color: "var(--text-primary)" }}>
            Review &amp; Submit
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Please review the summary below before submitting your application.
          </p>
        </div>
      </div>

      {/* Summary Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border-soft)" }}
      >
        <div
          className="px-5 py-3.5"
          style={{
            background: "rgba(200,162,77,.06)",
            borderBottom: "1px solid var(--border-soft)",
          }}
        >
          <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Application Summary</h3>
        </div>
        <div>
          {summaryItems.map((item, i) => (
            <div
              key={item.label}
              className="flex items-start gap-4 px-5 py-3.5"
              style={{
                borderBottom: i < summaryItems.length - 1 ? "1px solid var(--border-soft)" : "none",
                background: i % 2 === 0 ? "transparent" : "rgba(200,162,77,.02)",
              }}
            >
              <span
                className="text-xs font-semibold uppercase tracking-wider shrink-0 pt-0.5"
                style={{ width: 160, color: "var(--text-muted)" }}
              >
                {item.label}
              </span>
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Note */}
      <div className="notice-banner">
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          By clicking <span className="font-bold" style={{ color: "var(--text-primary)" }}>"Submit Application"</span>, you confirm that
          all information provided is accurate and complete, and that you have read and agreed to all conditions and
          policies in the previous step.
        </p>
      </div>
    </div>
  )
}
