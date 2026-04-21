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
      <div className="flex flex-col items-center space-y-6 px-1 py-8 text-center sm:space-y-8 sm:py-12 animate-fade-slide-up">

        <div className="relative shrink-0">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-md sm:h-28 sm:w-28"
            style={{ background: "rgba(200,162,77,.1)", border: "2px solid rgba(200,162,77,.35)" }}
          >
            <CheckCircle2 className="h-14 w-14 sm:h-16 sm:w-16" style={{ color: "var(--gold)" }} strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-md border border-green-700 bg-green-600">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="max-w-md space-y-2 px-2">
          <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            We have your application
          </h2>
          <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
            The enrolment form for{" "}
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>{studentName}</span>{" "}
            is on the admissions desk. You will hear from us once it has been read — usually within a few working days.
          </p>
        </div>

        {/* Reference number card */}
        {referenceNumber && (
          <div
            className="w-full max-w-md rounded-md px-5 py-5 text-center sm:px-8"
            style={{
              background: "rgba(200,162,77,.08)",
              border: "1.5px solid rgba(200,162,77,.3)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              Your reference
            </p>
            <p
              className="break-all font-mono text-xl font-bold tracking-widest sm:break-normal sm:text-2xl"
              style={{ color: "var(--gold-dark)" }}
            >
              {referenceNumber}
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              Quote this in emails or calls so we open the right file first time.
            </p>
          </div>
        )}

        {/* Next steps */}
        <div
          className="flex w-full max-w-sm items-start gap-3 rounded-md p-4 text-left sm:gap-4 sm:p-5"
          style={{ background: "var(--surface)", border: "1px solid var(--border-soft)" }}
        >
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "rgba(200,162,77,.12)" }}
          >
            <Clock className="h-[1.125rem] w-[1.125rem]" style={{ color: "var(--gold)" }} />
          </div>
          <div>
            <p className="text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>Typical next steps</p>
            <ul className="space-y-1.5">
              {[
                "Admissions checks the file for gaps",
                "Confirmation email within roughly three working days",
                "Sometimes we ask for documents or a short visit",
                "Offer or wait-list letter follows in writing",
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
        <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
          <button type="button" className="btn-ghost w-full justify-center text-sm sm:w-auto">
            <Download className="w-4 h-4" />
            Save PDF
          </button>
          <button type="button" className="btn-ghost w-full justify-center text-sm sm:w-auto" style={{ color: "var(--gold-dark)" }}>
            <Mail className="w-4 h-4" />
            Email summary
          </button>
        </div>

        <a
          href="https://shomoukh.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:underline"
          style={{ color: "var(--gold)" }}
        >
          Back to shomoukh.com →
        </a>
      </div>
    )
  }

  /* ── REVIEW STATE ── */
  const summaryItems = [
    { label: "Child",       value: studentName },
    { label: "Known as", value: studentData.toBeKnownAs || "—" },
    {
      label: "Date of Birth",
      value: studentData.dateOfBirth
        ? new Date(studentData.dateOfBirth).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : "—",
    },
    { label: "Nationality",        value: studentData.nationality || "—" },
    { label: "Gender",             value: studentData.gender || "—" },
    { label: "Class applied for",     value: studentData.anticipatedGradeOfEntry || "—" },
    { label: "School year",    value: studentData.enrollmentYear || "—" },
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
      label: "Previous schools",
      value: formData.educationalBackground.previousSchools.length > 0
        ? formData.educationalBackground.previousSchools.map((s) => s.schoolName).join(", ")
        : "Not applicable / none yet",
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
          className="w-16 h-16 rounded-md flex items-center justify-center"
          style={{ background: "rgba(200,162,77,.12)", border: "1px solid rgba(200,162,77,.2)" }}
        >
          <CheckCircle2 className="w-9 h-9" style={{ color: "var(--gold)" }} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-serif" style={{ color: "var(--text-primary)" }}>
            Final check
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Skim the snapshot — go back a step if anything looks wrong.
          </p>
        </div>
      </div>

      {/* Summary Table */}
      <div
        className="rounded-md overflow-hidden"
        style={{ border: "1px solid var(--border-soft)" }}
      >
        <div
          className="px-5 py-3.5"
          style={{
            background: "rgba(200,162,77,.06)",
            borderBottom: "1px solid var(--border-soft)",
          }}
        >
          <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Snapshot</h3>
        </div>
        <div>
          {summaryItems.map((item, i) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-start sm:gap-4 sm:px-5"
              style={{
                borderBottom: i < summaryItems.length - 1 ? "1px solid var(--border-soft)" : "none",
                background: i % 2 === 0 ? "transparent" : "rgba(200,162,77,.02)",
              }}
            >
              <span
                className="shrink-0 pt-0.5 text-[10px] font-semibold uppercase tracking-wider sm:w-36 sm:text-xs md:w-44"
                style={{ color: "var(--text-muted)" }}
              >
                {item.label}
              </span>
              <span
                className="min-w-0 break-words text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Note */}
      <div className="notice-banner">
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Submitting means the details above match what you know to be true, and the policies you ticked in the last step
          still stand.
        </p>
      </div>
    </div>
  )
}
