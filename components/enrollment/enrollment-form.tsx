"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Sparkles, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"


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

export function EnrollmentForm({ onSwitchToMyApps }: { onSwitchToMyApps?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [formData, setFormData] = useState<EnrollmentFormData>(defaultFormData)
  const [errors, setErrors] = useState<Record<string, unknown>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState("")
  const [stepKey, setStepKey] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false)

  const { data: sessionData } = useSession()
  const user = sessionData?.user
  const router = useRouter()
  
  const saveDraftMutation = useMutation(api.drafts.save)
  const removeDraftMutation = useMutation(api.drafts.remove)
  const dbDraft = useQuery(api.drafts.get)

  const updateFormSection = useCallback(<K extends keyof EnrollmentFormData>(
    key: K,
    value: EnrollmentFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSaveDraft = useCallback(async () => {
    try {
      const payload = {
        formData,
        currentStep,
        completedSteps,
        savedAt: Date.now(),
      }
      
      // Always save to localStorage as a quick local fallback
      localStorage.setItem("shomoukh-enrolment-draft", JSON.stringify(payload))
      
      // If logged in, save to DB for security and persistence
      if (user) {
        await saveDraftMutation({
          formData,
          currentStep,
          completedSteps,
        })
      }
      
      setLastSaved(new Date())
    } catch (err) {
      console.error("Failed to save draft:", err)
    }
  }, [formData, currentStep, completedSteps, user, saveDraftMutation])

  // Load draft from DB or LocalStorage on mount
  useEffect(() => {
    if (hasLoadedDraft) return

    const loadDraft = () => {
      // 1. Try DB first if user is logged in
      if (user && dbDraft) {
        setFormData(dbDraft.formData)
        setCurrentStep(dbDraft.currentStep)
        setCompletedSteps(dbDraft.completedSteps)
        setLastSaved(new Date(dbDraft.lastSaved))
        setHasLoadedDraft(true)
        toast.info("Draft loaded from your account")
        return
      }

      // 2. Fallback to LocalStorage
      try {
        const saved = localStorage.getItem("shomoukh-enrolment-draft")
        if (saved) {
          const parsed = JSON.parse(saved)
          // Only load if we haven't loaded from DB
          if (!user || !dbDraft) {
            setFormData(parsed.formData)
            setCurrentStep(parsed.currentStep)
            setCompletedSteps(parsed.completedSteps)
            setLastSaved(new Date(parsed.savedAt))
            setHasLoadedDraft(true)
            toast.info("Draft loaded from local browser storage")
          }
        }
      } catch {
        /* ignore */
      }
      
      // If no draft found, just mark as loaded
      if (user !== undefined && (dbDraft !== undefined || !user)) {
        setHasLoadedDraft(true)
      }
    }

    loadDraft()
  }, [user, dbDraft, hasLoadedDraft])

  // Auto-save effect
  useEffect(() => {
    const timer = setInterval(() => {
      handleSaveDraft()
    }, 10000)
    return () => clearInterval(timer)
  }, [handleSaveDraft])

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

  const submitApplication = useMutation(api.applications.submit)

  const handleNext = async () => {
    if (currentStep === 6) {
      if (!user) {
        toast.info("Authentication Required", {
          description: "Please sign in or create an account to submit your application.",
        });
        // Save current progress to draft before redirecting
        handleSaveDraft();
        router.push("/login?redirect=/enrollment");
        return;
      }

      setSubmitError(null)
      setIsSubmitting(true)
      try {
        const result = await submitApplication({ formData })
        setReferenceNumber(result.referenceNumber)
        setSubmitted(true)
        toast.success("Application Submitted!", {
          description: `Your reference is ${result.referenceNumber}. We will review it soon.`,
        })
        try {
          localStorage.removeItem("shomoukh-enrolment-draft")
          if (user) {
            await removeDraftMutation()
          }
        } catch {
          /* ignore */
        }
      } catch (err) {
        console.error("Submission error:", err)
        setSubmitError(
          "We could not submit your application. Check your connection and try again.",
        )
        toast.error("Submission Failed", {
          description: "Please check your internet connection and try again.",
        })
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
      <div className="min-h-screen">
        <EnrolmentHeader />
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="premium-card p-10 text-center animate-fade-slide-up">
            <Step6Submit
              formData={formData}
              submitted={submitted}
              referenceNumber={referenceNumber}
            />
          </div>
        </div>
        <EnrolmentFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen selection:bg-gold/20">
      <EnrolmentHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-start">
          
          <EnrolmentSidebar />

          <div className="space-y-8">
            {/* Main Form Card */}
            <div className="premium-card overflow-hidden">
              {/* Stepper Header */}
              <div className="px-6 py-8 sm:px-10 sm:py-10 border-b border-border-soft bg-white">
                <ProgressStepper
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  onStepClick={handleStepClick}
                />
              </div>

              {/* Step Info */}
              <div className="px-6 py-8 sm:px-10 sm:py-10 bg-white border-b border-border-soft">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0 shadow-sm border border-gold/5">
                      <StepTitleIcon className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Step {currentStep} of 6</span>
                        {completedSteps.includes(currentStep) && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">{stepMeta.label}</h1>
                      <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-2xl">
                        {STEP_INTRO[currentStep]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="px-4 py-2 rounded-xl bg-cream border border-border-soft flex items-center gap-2 shadow-inner-soft">
                      <Sparkles className="w-4 h-4 text-gold" />
                      <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                        Est: {STEP_ESTIMATED[currentStep - 1]}
                      </span>
                    </div>
                    {lastSaved && (
                      <span className="text-[10px] text-text-muted font-medium italic">
                        Draft saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div key={stepKey} className="px-6 py-8 sm:px-10 sm:py-12 animate-fade-slide-up bg-white">
                {errorCount > 0 && (
                  <div className="mb-8 p-5 rounded-2xl bg-destructive/5 border border-destructive/10 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3 text-destructive mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <h4 className="font-bold text-sm">Please check {errorCount} {errorCount === 1 ? 'field' : 'fields'}</h4>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 ml-8">
                      {Object.values(errors as Record<string, string>).map((msg, i) => (
                        <li key={i} className="text-xs text-destructive/80 list-disc">{msg}</li>
                      ))}
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

                <FormNavigation
                  currentStep={currentStep}
                  totalSteps={6}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onSaveDraft={handleSaveDraft}
                  isSubmitting={isSubmitting}
                  nextLabel={currentStep === 6 ? "Finalize & Submit" : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <EnrolmentFooter />
    </div>
  )
}

function AlertCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
