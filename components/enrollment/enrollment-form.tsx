"use client"

import { useState, useCallback } from "react"
import { ProgressStepper, STEPS } from "@/components/enrollment/progress-stepper"
import { FormNavigation } from "@/components/enrollment/form-components"
import { Step1StudentData } from "@/components/enrollment/step1-student-data"
import { Step2FamilyData } from "@/components/enrollment/step2-family-data"
import { Step3EmergencyData } from "@/components/enrollment/step3-emergency-data"
import { Step4EducationalBackground } from "@/components/enrollment/step4-educational-background"
import { Step5ConditionsWaiver } from "@/components/enrollment/step5-conditions-waiver"
import { Step6Submit } from "@/components/enrollment/step6-submit"
import { EnrolmentHeader } from "@/components/enrollment/enrolment-header"
import { EnrolmentSidebar } from "@/components/enrollment/enrolment-sidebar"
import type { EnrollmentFormData, StudentData, FamilyData, EmergencyData, EducationalBackground, ConditionsWaiver } from "@/lib/enrollment-types"
import { defaultFormData } from "@/lib/enrollment-types"

const STEP_ESTIMATED = ["5 minutes", "8 minutes", "5 minutes", "6 minutes", "10 minutes", "4 minutes"]

const STEP_INTRO: Record<number, string> = {
  1: "Tell us about your child — photo, identity, languages, and enrolment preferences.",
  2: "Parent and guardian details, contact information, and home environment.",
  3: "Medical contacts and people we can reach in an emergency.",
  4: "Previous schooling and any learning or support needs.",
  5: "Policies, declarations, and signatures required before submission.",
  6: "Review everything once more, then submit your application.",
}

/* ── validators ── */
function validateStudentData(data: StudentData): Partial<Record<keyof StudentData, string>> {
  const e: Partial<Record<keyof StudentData, string>> = {}
  if (!data.familyName.trim())         e.familyName           = "Family name is required."
  if (!data.givenNames.trim())         e.givenNames           = "Given names are required."
  if (!data.toBeKnownAs.trim())        e.toBeKnownAs          = "Preferred name is required."
  if (!data.dateOfBirth)               e.dateOfBirth          = "Date of birth is required."
  if (!data.nationality)               e.nationality          = "Nationality is required."
  if (!data.gender)                    e.gender               = "Gender is required."
  if (!data.firstLanguageSpoken)       e.firstLanguageSpoken  = "First language is required."
  if (!data.levelOfEnglishSpoken)      e.levelOfEnglishSpoken = "English level is required."
  if (!data.enrollmentYear)            e.enrollmentYear       = "Enrollment year is required."
  if (!data.anticipatedGradeOfEntry)   e.anticipatedGradeOfEntry = "Grade of entry is required."
  return e
}
function validateFamilyData(data: FamilyData): Record<string, string> {
  const e: Record<string, string> = {}
  if (!data.maritalStatus)          e.maritalStatus = "Marital status is required."
  if (!data.languageSpokenAtHome)   e.languageSpokenAtHome = "Language spoken at home is required."
  data.parents.forEach((p, i) => {
    const pre = `parents.${i}`
    if (!p.familyName.trim()) e[`${pre}.familyName`] = "Family name is required."
    if (!p.givenNames.trim()) e[`${pre}.givenNames`] = "Given names are required."
    if (!p.nationality)       e[`${pre}.nationality`] = "Nationality is required."
    if (!p.mobilePhone.trim())e[`${pre}.mobilePhone`] = "Mobile phone is required."
    if (!p.email.trim())      e[`${pre}.email`]       = "Email is required."
    if (!p.relationship)      e[`${pre}.relationship`]= "Relationship is required."
  })
  return e
}
function validateEmergencyData(data: EmergencyData): Record<string, string> {
  const e: Record<string, string> = {}
  if (!data.doctorName.trim())  e.doctorName  = "Doctor name is required."
  if (!data.doctorPhone.trim()) e.doctorPhone = "Doctor phone is required."
  data.emergencyContacts.forEach((c, i) => {
    const pre = `contacts.${i}`
    if (!c.name.trim())         e[`${pre}.name`]        = "Contact name is required."
    if (!c.relationship)        e[`${pre}.relationship`]= "Relationship is required."
    if (!c.mobilePhone.trim())  e[`${pre}.mobilePhone`] = "Mobile phone is required."
  })
  return e
}
function validateEducationalBackground(data: EducationalBackground): Record<string, string> {
  const e: Record<string, string> = {}
  if (data.hasLearningDifficulties === null)  e.hasLearningDifficulties  = "Please select an option."
  if (data.hasReceivedSpecialSupport === null) e.hasReceivedSpecialSupport = "Please select an option."
  data.previousSchools.forEach((s, i) => {
    const pre = `schools.${i}`
    if (!s.schoolName.trim()) e[`${pre}.schoolName`] = "School name is required."
    if (!s.country)           e[`${pre}.country`]    = "Country is required."
  })
  return e
}
function validateConditionsWaiver(data: ConditionsWaiver): Partial<Record<keyof ConditionsWaiver, string>> {
  const e: Partial<Record<keyof ConditionsWaiver, string>> = {}
  if (!data.agreeToTerms)         e.agreeToTerms         = "You must agree to the terms."
  if (!data.agreeToPhotoPolicy)   e.agreeToPhotoPolicy   = "You must acknowledge the photo policy."
  if (!data.agreeToMedicalPolicy) e.agreeToMedicalPolicy = "You must authorize medical treatment."
  if (!data.agreeToCodeOfConduct) e.agreeToCodeOfConduct = "You must agree to the code of conduct."
  if (!data.declarationAccepted)  e.declarationAccepted  = "You must accept the declaration."
  if (!data.parentSignatureName.trim()) e.parentSignatureName = "Signature name is required."
  if (!data.signatureDate)        e.signatureDate        = "Date is required."
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
      setIsSubmitting(true)
      await new Promise((res) => setTimeout(res, 1800))
      const ref = `SHM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      setReferenceNumber(ref)
      setSubmitted(true)
      setIsSubmitting(false)
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
        <div className="enrolment-page-bg">
          <div className="enrolment-inner mx-auto max-w-3xl px-4 py-10 sm:py-14">
            <div className="premium-card overflow-hidden p-6 sm:p-10">
              <Step6Submit
                formData={formData}
                submitted={submitted}
                referenceNumber={referenceNumber}
              />
            </div>
          </div>
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
                <div className="flex flex-col gap-4 border-b border-[var(--border-soft)] px-4 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-8">
                  <div className="flex gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50 sm:h-14 sm:w-14"
                      style={{ border: "1px solid rgba(200,162,77,.35)" }}
                    >
                      <StepTitleIcon className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: "var(--gold-dark)" }} strokeWidth={2} />
                    </div>
                    <div>
                      <h1 className="font-serif text-xl font-bold text-[var(--navy)] sm:text-2xl">
                        {stepMeta.label}
                      </h1>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {STEP_INTRO[currentStep] ??
                          "Complete this section with accurate information."}
                      </p>
                    </div>
                  </div>
                  <div
                    className="w-fit shrink-0 self-start rounded-full px-4 py-2 text-xs font-semibold sm:mt-1"
                    style={{
                      background: "#f3f4f6",
                      border: "1px solid #e5e7eb",
                      color: "var(--text-muted)",
                    }}
                  >
                    Estimated time: {STEP_ESTIMATED[currentStep - 1]}
                  </div>
                </div>
              )}

              <div key={stepKey} className="animate-fade-slide-up px-4 py-6 sm:px-8 sm:py-8">
                {errorCount > 0 && (
                  <div
                    className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3"
                    style={{ borderLeftWidth: 3, borderLeftColor: "#dc2626" }}
                  >
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                      <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-red-700">
                        Please fix {errorCount} issue{errorCount > 1 ? "s" : ""} before continuing
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
                  nextLabel={currentStep === 6 ? "Submit Application" : undefined}
                />
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Shomoukh Nursery ·{" "}
            <a href="https://shomoukh.com" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] hover:underline">
              shomoukh.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
