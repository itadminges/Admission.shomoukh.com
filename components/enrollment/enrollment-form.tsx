"use client"

import { useState, useCallback } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ProgressStepper, STEPS } from "@/components/enrollment/progress-stepper"
import { FormNavigation } from "@/components/enrollment/form-components"
import { Step1StudentData } from "@/components/enrollment/step1-student-data"
import { Step2FamilyData } from "@/components/enrollment/step2-family-data"
import { Step3EmergencyData } from "@/components/enrollment/step3-emergency-data"
import { Step4EducationalBackground } from "@/components/enrollment/step4-educational-background"
import { Step5ConditionsWaiver } from "@/components/enrollment/step5-conditions-waiver"
import { Step6Submit } from "@/components/enrollment/step6-submit"
import { EnrolmentHeader } from "@/components/enrollment/enrolment-header"
import { EnrolmentFooter } from "@/components/enrollment/enrolment-footer"
import { EnrolmentSidebar } from "@/components/enrollment/enrolment-sidebar"
import type { EnrollmentFormData, StudentData, FamilyData, EmergencyData, EducationalBackground, ConditionsWaiver } from "@/lib/enrollment-types"
import { defaultFormData } from "@/lib/enrollment-types"

const STEP_ESTIMATED = ["~5 min", "~8 min", "~6 min", "~6 min", "~8 min", "~4 min"]

const STEP_INTRO: Record<number, string> = {
  1: "Photo, legal name, languages, and which year and class you are applying for.",
  2: "Parents or legal guardians: how we reach you, where you live, and who else is in the household picture.",
  3: "Doctor details, allergies and medications, plus backup contacts if we cannot reach parents.",
  4: "Previous schools (if any) and anything we should plan for around learning or extra support.",
  5: "School policies in plain language — read, tick, and sign where indicated.",
  6: "Quick sanity check on what you entered, then submit to admissions.",
}

/* ── validators ── */
function validateStudentData(data: StudentData): Partial<Record<keyof StudentData, string>> {
  const e: Partial<Record<keyof StudentData, string>> = {}
  if (!data.familyName.trim())         e.familyName           = "Please add the family name."
  if (!data.givenNames.trim())         e.givenNames           = "Please add the given names."
  if (!data.toBeKnownAs.trim())        e.toBeKnownAs          = "Tell us what we should call them day to day."
  if (!data.dateOfBirth)               e.dateOfBirth          = "Choose a date of birth."
  if (!data.nationality)               e.nationality          = "Select a nationality."
  if (!data.gender)                    e.gender               = "Select an option."
  if (!data.firstLanguageSpoken)       e.firstLanguageSpoken  = "Select the first language."
  if (!data.levelOfEnglishSpoken)      e.levelOfEnglishSpoken = "Select an English level."
  if (!data.enrollmentYear)            e.enrollmentYear       = "Choose the enrolment year."
  if (!data.anticipatedGradeOfEntry)   e.anticipatedGradeOfEntry = "Choose the grade or class."
  return e
}
function validateFamilyData(data: FamilyData): Record<string, string> {
  const e: Record<string, string> = {}
  if (!data.maritalStatus)          e.maritalStatus = "Select marital status."
  if (!data.languageSpokenAtHome)   e.languageSpokenAtHome = "Which language is mainly spoken at home?"
  data.parents.forEach((p, i) => {
    const pre = `parents.${i}`
    if (!p.familyName.trim()) e[`${pre}.familyName`] = "Family name is missing."
    if (!p.givenNames.trim()) e[`${pre}.givenNames`] = "Given names are missing."
    if (!p.nationality)       e[`${pre}.nationality`] = "Select a nationality."
    if (!p.mobilePhone.trim())e[`${pre}.mobilePhone`] = "Mobile number is missing."
    if (!p.email.trim())      e[`${pre}.email`]       = "Email is missing."
    if (!p.relationship)      e[`${pre}.relationship`]= "How is this person related to the child?"
  })
  return e
}
function validateEmergencyData(data: EmergencyData): Record<string, string> {
  const e: Record<string, string> = {}
  if (!data.doctorName.trim())  e.doctorName  = "Add the doctor or clinic name."
  if (!data.doctorPhone.trim()) e.doctorPhone = "Add a phone number for the doctor."
  data.emergencyContacts.forEach((c, i) => {
    const pre = `contacts.${i}`
    if (!c.name.trim())         e[`${pre}.name`]        = "Full name is missing."
    if (!c.relationship)        e[`${pre}.relationship`]= "Relationship to the child?"
    if (!c.mobilePhone.trim())  e[`${pre}.mobilePhone`] = "Mobile number is missing."
  })
  return e
}
function validateEducationalBackground(data: EducationalBackground): Record<string, string> {
  const e: Record<string, string> = {}
  data.previousSchools.forEach((s, i) => {
    const pre = `schools.${i}`
    if (!s.schoolName.trim()) e[`${pre}.schoolName`] = "School name is missing."
    if (!s.country)           e[`${pre}.country`]    = "Country is missing."
  })
  return e
}
function validateConditionsWaiver(data: ConditionsWaiver): Partial<Record<keyof ConditionsWaiver, string>> {
  const e: Partial<Record<keyof ConditionsWaiver, string>> = {}
  if (!data.agreeToTerms)         e.agreeToTerms         = "Please confirm you accept the enrolment terms."
  if (!data.agreeToPhotoPolicy)   e.agreeToPhotoPolicy   = "Please confirm the photo and media policy."
  if (!data.agreeToMedicalPolicy) e.agreeToMedicalPolicy = "Emergency medical care needs your consent."
  if (!data.agreeToCodeOfConduct) e.agreeToCodeOfConduct = "Please confirm the code of conduct."
  if (!data.declarationAccepted)  e.declarationAccepted  = "Please confirm the information is accurate."
  if (!data.parentSignatureName.trim()) e.parentSignatureName = "Type the signing parent or guardian’s full name."
  if (!data.signatureDate)        e.signatureDate        = "Today’s date, or the date you are signing."
  return e
}

export function EnrollmentForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState<EnrollmentFormData>(defaultFormData)
  const [errors, setErrors] = useState<Record<string, unknown>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState("")
  const [stepKey, setStepKey] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitApplication = useMutation(api.applications.submit)

  const updateFormSection = useCallback(<K extends keyof EnrollmentFormData>(
    key: K,
    value: EnrollmentFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const validateCurrentStep = (): Record<string, unknown> => {
    switch (currentStep) {
      case 1: return validateStudentData(formData.studentData)
      case 2: return validateFamilyData(formData.familyData)
      case 3: return validateEmergencyData(formData.emergencyData)
      case 4: return validateEducationalBackground(formData.educationalBackground)
      case 5: return validateConditionsWaiver(formData.conditionsWaiver)
      default: return {}
    }
  }

  const handleSaveDraft = useCallback(() => {
    try {
      const payload = {
        formData,
        currentStep,
        completedSteps,
        savedAt: Date.now(),
      }
      localStorage.setItem("shomoukh-enrolment-draft", JSON.stringify(payload))
    } catch {
      /* ignore */
    }
  }, [formData, currentStep, completedSteps])

  const handleNext = async () => {
    if (currentStep === 6) {
      setSubmitError(null)
      setIsSubmitting(true)
      try {
        const result = await submitApplication({ formData })
        setReferenceNumber(result.referenceNumber)
        setSubmitted(true)
        try {
          localStorage.removeItem("shomoukh-enrolment-draft")
        } catch {
          /* ignore */
        }
      } catch {
        setSubmitError(
          "We could not submit your application. Check your connection and try again. If it keeps happening, email admissions with a screenshot.",
        )
        window.scrollTo({ top: 0, behavior: "smooth" })
      } finally {
        setIsSubmitting(false)
      }
      return
    }
    const stepErrors = validateCurrentStep()
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    setErrors({})
    setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]))
    setCurrentStep((prev) => Math.min(prev + 1, 6))
    setStepKey((k) => k + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePrevious = () => {
    setErrors({})
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setStepKey((k) => k + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleStepClick = (step: number) => {
    if (completedSteps.includes(step) || step <= currentStep) {
      setErrors({})
      setCurrentStep(step)
      setStepKey((k) => k + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const errorCount = Object.keys(errors).length
  const stepMeta = STEPS[currentStep - 1]
  const StepTitleIcon = stepMeta?.Icon

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f7f4ed]">
        <EnrolmentHeader />
        <div className="enrolment-page-bg pb-8">
          <div className="enrolment-inner mx-auto max-w-3xl px-4 py-8 sm:py-14 sm:px-6 lg:px-8">
            <div className="premium-card overflow-hidden p-6 sm:p-10">
              <Step6Submit
                formData={formData}
                submitted={submitted}
                referenceNumber={referenceNumber}
              />
            </div>
          </div>
          <EnrolmentFooter />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f4ed]">
      <EnrolmentHeader />

      <div className="enrolment-page-bg pb-16">
        <div className="enrolment-inner mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-6 pt-6 sm:gap-8 sm:pt-8 lg:grid-cols-[minmax(260px,360px)_1fr] lg:gap-10 lg:pt-10">

            <EnrolmentSidebar />

            <div className="premium-card min-w-0 overflow-hidden">
              <div className="border-b border-[var(--border-soft)] px-4 py-5 sm:px-8 sm:py-8">
                <ProgressStepper
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  onStepClick={handleStepClick}
                />
              </div>

              {StepTitleIcon && (
                <div className="flex flex-col gap-4 border-b border-[var(--border-soft)] px-4 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-8">
                  <div className="flex min-w-0 gap-3 sm:gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-amber-50 sm:h-14 sm:w-14"
                      style={{ border: "1px solid rgba(200,162,77,.35)" }}
                    >
                      <StepTitleIcon className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: "var(--gold-dark)" }} strokeWidth={2} />
                    </div>
                    <div>
                      <h1 className="font-serif text-xl font-bold leading-tight tracking-tight text-[var(--navy)] sm:text-2xl lg:text-[1.65rem]">
                        {stepMeta.label}
                      </h1>
                      <p className="mt-1 max-w-[52ch] text-sm leading-relaxed text-[var(--text-secondary)] md:text-[0.9375rem]">
                        {STEP_INTRO[currentStep] ??
                          "Fill this block as completely as you can — you can edit later before you send."}
                      </p>
                    </div>
                  </div>
                  <div
                    className="w-full shrink-0 rounded-md px-4 py-2 text-center text-xs font-semibold sm:mt-1 sm:w-fit sm:self-start sm:text-left"
                    style={{
                      background: "#f8f6f2",
                      border: "1px solid var(--border-soft)",
                      color: "var(--text-muted)",
                    }}
                  >
                    Rough timing: {STEP_ESTIMATED[currentStep - 1]}
                  </div>
                </div>
              )}

              <div key={stepKey} className="animate-fade-slide-up px-4 py-6 sm:px-8 sm:py-8">
                {submitError && (
                  <div
                    className="mb-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50/80 px-4 py-3"
                    style={{ borderLeftWidth: 3, borderLeftColor: "#dc2626" }}
                  >
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                      <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <p className="text-sm text-red-700">{submitError}</p>
                  </div>
                )}

                {errorCount > 0 && (
                  <div
                    className="mb-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50/80 px-4 py-3"
                    style={{ borderLeftWidth: 3, borderLeftColor: "#dc2626" }}
                  >
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                      <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-red-700">
                        {errorCount === 1
                          ? "One field still needs attention before we move on"
                          : `${errorCount} fields still need attention before we move on`}
                      </p>
                      <ul className="mt-1 space-y-0.5">
                        {Object.values(errors as Record<string, string>).slice(0, 4).map((msg, i) => (
                          <li key={i} className="text-xs text-red-600">• {msg}</li>
                        ))}
                        {errorCount > 4 && <li className="text-xs text-red-600">• …and {errorCount - 4} more</li>}
                      </ul>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <Step1StudentData
                    data={formData.studentData}
                    onChange={(data) => updateFormSection("studentData", data)}
                    errors={errors as Partial<Record<keyof StudentData, string>>}
                  />
                )}
                {currentStep === 2 && (
                  <Step2FamilyData
                    data={formData.familyData}
                    onChange={(data) => updateFormSection("familyData", data)}
                    errors={errors as Record<string, string>}
                  />
                )}
                {currentStep === 3 && (
                  <Step3EmergencyData
                    data={formData.emergencyData}
                    onChange={(data) => updateFormSection("emergencyData", data)}
                    errors={errors as Record<string, string>}
                  />
                )}
                {currentStep === 4 && (
                  <Step4EducationalBackground
                    data={formData.educationalBackground}
                    onChange={(data) => updateFormSection("educationalBackground", data)}
                    errors={errors as Record<string, string>}
                  />
                )}
                {currentStep === 5 && (
                  <Step5ConditionsWaiver
                    data={formData.conditionsWaiver}
                    onChange={(data) => updateFormSection("conditionsWaiver", data)}
                    errors={errors as Partial<Record<keyof ConditionsWaiver, string>>}
                  />
                )}
                {currentStep === 6 && (
                  <Step6Submit
                    formData={formData}
                    submitted={submitted}
                    referenceNumber={referenceNumber}
                  />
                )}

                <FormNavigation
                  currentStep={currentStep}
                  totalSteps={6}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onSaveDraft={handleSaveDraft}
                  isSubmitting={isSubmitting}
                  nextLabel={currentStep === 6 ? "Submit application" : undefined}
                />
              </div>
            </div>
          </div>

          <EnrolmentFooter />
        </div>
      </div>
    </div>
  )
}
