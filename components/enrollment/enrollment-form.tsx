"use client"

import { useState, useCallback } from "react"
import { ProgressStepper } from "@/components/enrollment/progress-stepper"
import { FormNavigation } from "@/components/enrollment/form-components"
import { Step1StudentData } from "@/components/enrollment/step1-student-data"
import { Step2FamilyData } from "@/components/enrollment/step2-family-data"
import { Step3EmergencyData } from "@/components/enrollment/step3-emergency-data"
import { Step4EducationalBackground } from "@/components/enrollment/step4-educational-background"
import { Step5ConditionsWaiver } from "@/components/enrollment/step5-conditions-waiver"
import { Step6Submit } from "@/components/enrollment/step6-submit"
import type { EnrollmentFormData, StudentData, FamilyData, EmergencyData, EducationalBackground, ConditionsWaiver } from "@/lib/enrollment-types"
import { defaultFormData } from "@/lib/enrollment-types"

function validateStudentData(data: StudentData): Partial<Record<keyof StudentData, string>> {
  const errors: Partial<Record<keyof StudentData, string>> = {}
  if (!data.familyName.trim()) errors.familyName = "Family name is required."
  if (!data.givenNames.trim()) errors.givenNames = "Given names are required."
  if (!data.toBeKnownAs.trim()) errors.toBeKnownAs = "Preferred name is required."
  if (!data.dateOfBirth) errors.dateOfBirth = "Date of birth is required."
  if (!data.nationality) errors.nationality = "Nationality is required."
  if (!data.gender) errors.gender = "Gender is required."
  if (!data.firstLanguageSpoken) errors.firstLanguageSpoken = "First language is required."
  if (!data.levelOfEnglishSpoken) errors.levelOfEnglishSpoken = "English level is required."
  if (!data.enrollmentYear) errors.enrollmentYear = "Enrollment year is required."
  if (!data.anticipatedGradeOfEntry) errors.anticipatedGradeOfEntry = "Grade of entry is required."
  return errors
}

function validateFamilyData(data: FamilyData): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!data.maritalStatus) errors.maritalStatus = "Marital status is required."
  if (!data.languageSpokenAtHome) errors.languageSpokenAtHome = "Language spoken at home is required."
  data.parents.forEach((parent, index) => {
    const prefix = `parents.${index}`
    if (!parent.familyName.trim()) errors[`${prefix}.familyName`] = "Family name is required."
    if (!parent.givenNames.trim()) errors[`${prefix}.givenNames`] = "Given names are required."
    if (!parent.nationality) errors[`${prefix}.nationality`] = "Nationality is required."
    if (!parent.mobilePhone.trim()) errors[`${prefix}.mobilePhone`] = "Mobile phone is required."
    if (!parent.email.trim()) errors[`${prefix}.email`] = "Email is required."
    if (!parent.relationship) errors[`${prefix}.relationship`] = "Relationship is required."
  })
  return errors
}

function validateEmergencyData(data: EmergencyData): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!data.doctorName.trim()) errors.doctorName = "Doctor name is required."
  if (!data.doctorPhone.trim()) errors.doctorPhone = "Doctor phone is required."
  data.emergencyContacts.forEach((c, i) => {
    const prefix = `contacts.${i}`
    if (!c.name.trim()) errors[`${prefix}.name`] = "Contact name is required."
    if (!c.relationship) errors[`${prefix}.relationship`] = "Relationship is required."
    if (!c.mobilePhone.trim()) errors[`${prefix}.mobilePhone`] = "Mobile phone is required."
  })
  return errors
}

function validateEducationalBackground(data: EducationalBackground): Record<string, string> {
  const errors: Record<string, string> = {}
  if (data.hasLearningDifficulties === null) errors.hasLearningDifficulties = "Please select an option."
  if (data.hasReceivedSpecialSupport === null) errors.hasReceivedSpecialSupport = "Please select an option."
  data.previousSchools.forEach((school, i) => {
    const prefix = `schools.${i}`
    if (!school.schoolName.trim()) errors[`${prefix}.schoolName`] = "School name is required."
    if (!school.country) errors[`${prefix}.country`] = "Country is required."
  })
  return errors
}

function validateConditionsWaiver(data: ConditionsWaiver): Partial<Record<keyof ConditionsWaiver, string>> {
  const errors: Partial<Record<keyof ConditionsWaiver, string>> = {}
  if (!data.agreeToTerms) errors.agreeToTerms = "You must agree to the terms."
  if (!data.agreeToPhotoPolicy) errors.agreeToPhotoPolicy = "You must acknowledge the photo policy."
  if (!data.agreeToMedicalPolicy) errors.agreeToMedicalPolicy = "You must authorize medical treatment."
  if (!data.agreeToCodeOfConduct) errors.agreeToCodeOfConduct = "You must agree to the code of conduct."
  if (!data.declarationAccepted) errors.declarationAccepted = "You must accept the declaration."
  if (!data.parentSignatureName.trim()) errors.parentSignatureName = "Signature name is required."
  if (!data.signatureDate) errors.signatureDate = "Date is required."
  return errors
}

export function EnrollmentForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState<EnrollmentFormData>(defaultFormData)
  const [errors, setErrors] = useState<Record<string, unknown>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState("")

  const updateFormSection = useCallback(<K extends keyof EnrollmentFormData>(
    key: K,
    value: EnrollmentFormData[K]
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

  const handleNext = async () => {
    if (currentStep === 6) {
      // Submit
      setIsSubmitting(true)
      await new Promise((res) => setTimeout(res, 1500))
      const ref = `SHM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      setReferenceNumber(ref)
      setSubmitted(true)
      setIsSubmitting(false)
      return
    }

    const stepErrors = validateCurrentStep()
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setErrors({})
    setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]))
    setCurrentStep((prev) => Math.min(prev + 1, 6))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePrevious = () => {
    setErrors({})
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleStepClick = (step: number) => {
    if (completedSteps.includes(step) || step <= currentStep) {
      setErrors({})
      setCurrentStep(step)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const stepTitles = [
    "Student Data",
    "Family Data",
    "Emergency Data",
    "Educational Background",
    "Conditions & Waiver",
    "Review & Submit",
  ]

  const isLastStep = currentStep === 6

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      {/* Top Header Bar */}
      <header className="bg-[#1E1E2E] shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[#C9A84C] font-bold text-base tracking-widest uppercase leading-none font-serif">
                Shomoukh
              </span>
              <span className="text-white/60 text-xs tracking-wide">Early Childhood Education</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/50">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Application for Enrolment
          </div>
        </div>
      </header>

      {/* Gold accent bar */}
      <div className="h-1 bg-[#C9A84C]" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stepper Card */}
        {!submitted && (
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6">
            <ProgressStepper
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={handleStepClick}
            />
          </div>
        )}

        {/* Form Card */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-sm">
          {/* Step Title */}
          {!submitted && (
            <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-[#1E1E2E]">{currentStep}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Step {currentStep} of 6</p>
                  <h1 className="text-lg font-bold text-foreground font-serif">{stepTitles[currentStep - 1]}</h1>
                </div>
              </div>
            </div>
          )}

          {/* Step Content */}
          <div className="px-6 sm:px-8 py-6">
            {/* Validation error summary */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                <p className="text-sm font-semibold text-destructive mb-1">Please fix the following errors:</p>
                <ul className="text-sm text-destructive/80 space-y-0.5 list-disc list-inside">
                  {Object.values(errors as Record<string, string>).slice(0, 5).map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                  {Object.keys(errors).length > 5 && (
                    <li>...and {Object.keys(errors).length - 5} more</li>
                  )}
                </ul>
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

            {/* Navigation */}
            {!submitted && (
              <FormNavigation
                currentStep={currentStep}
                totalSteps={6}
                onPrevious={handlePrevious}
                onNext={handleNext}
                isSubmitting={isSubmitting}
                nextLabel={isLastStep ? "Submit Application" : undefined}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Shomoukh Early Childhood Education. All rights reserved.
          {" "}
          <a href="https://shomoukh.com" target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:underline">
            shomoukh.com
          </a>
        </p>
      </footer>
    </div>
  )
}
