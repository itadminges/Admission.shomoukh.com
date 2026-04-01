'use client'

import { useEnrollment } from '@/app/enrollment/context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  CheckCircle, Download, Mail, ArrowLeft, Send, User, Users, Phone, 
  GraduationCap, FileCheck, Loader2, Sparkles, Calendar, Clock
} from 'lucide-react'
import { useState } from 'react'

export function EnrollmentStep6() {
  const { student, resetForm, setCurrentStep } = useEnrollment()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setSubmitted(true)
    setLoading(false)
  }

  const handleDownload = () => {
    const summary = generateApplicationSummary()
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(summary))
    element.setAttribute('download', `shomoukh-application-${student.familyName}-${Date.now()}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const generateApplicationSummary = (): string => {
    return `
═══════════════════════════════════════════════════════════════
              SHOMOUKH EARLY CHILDHOOD EDUCATION
                 Student Enrollment Application
═══════════════════════════════════════════════════════════════

Application ID: APP-${Date.now().toString().slice(-8)}
Submitted: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

───────────────────────────────────────────────────────────────
                      STUDENT INFORMATION
───────────────────────────────────────────────────────────────
Full Name: ${student.givenNames} ${student.middleName ? student.middleName + ' ' : ''}${student.familyName}
Known As: ${student.knownAs || 'N/A'}
Date of Birth: ${student.dateOfBirth}
Gender: ${student.gender}
Nationality: ${student.nationality}
Resident Card: ${student.omanResidentCardNumber || 'N/A'}

Languages:
  • First Language: ${student.firstLanguageSpoken}
  • Other Language: ${student.otherLanguageSpoken || 'N/A'}
  • English Level: ${student.levelOfEnglishSpoken}

Enrollment:
  • Year: ${student.enrollmentYear}
  • Grade: ${student.anticipatedGradeOfEntry}

───────────────────────────────────────────────────────────────
                      FAMILY INFORMATION
───────────────────────────────────────────────────────────────
PRIMARY PARENT/GUARDIAN
Name: ${student.parentGuardian1Name}
Relationship: ${student.parentGuardian1Relationship}
Email: ${student.parentGuardian1Email}
Phone: ${student.parentGuardian1Phone}
Occupation: ${student.parentGuardian1Occupation || 'N/A'}

SECONDARY PARENT/GUARDIAN
Name: ${student.parentGuardian2Name || 'N/A'}
${student.parentGuardian2Email ? `Email: ${student.parentGuardian2Email}` : ''}
${student.parentGuardian2Phone ? `Phone: ${student.parentGuardian2Phone}` : ''}

FAMILY ADDRESS
${student.familyAddress || 'N/A'}
${student.familyCity || ''} ${student.familyCountry || ''}

───────────────────────────────────────────────────────────────
                      EMERGENCY CONTACT
───────────────────────────────────────────────────────────────
Name: ${student.emergencyContactName}
Phone: ${student.emergencyContactPhone}
Relationship: ${student.emergencyContactRelationship}
Address: ${student.emergencyContactAddress || 'N/A'}

───────────────────────────────────────────────────────────────
                   EDUCATIONAL BACKGROUND
───────────────────────────────────────────────────────────────
Previous School: ${student.previousSchoolName || 'N/A'}
Country: ${student.previousSchoolCountry || 'N/A'}
Years Attended: ${student.yearsAttended || 'N/A'}
Current Level: ${student.currentAcademicLevel || 'N/A'}
Additional Notes: ${student.additionalEducationalInfo || 'N/A'}

───────────────────────────────────────────────────────────────
                        AGREEMENTS
───────────────────────────────────────────────────────────────
Terms & Conditions: ${student.agreeToTerms ? '✓ Accepted' : '✗ Not Accepted'}
Privacy Policy: ${student.agreeToPrivacyPolicy ? '✓ Accepted' : '✗ Not Accepted'}
Data Processing: ${student.agreeToDataProcessing ? '✓ Accepted' : '✗ Not Accepted'}

Additional Comments: ${student.additionalNotes || 'None'}

═══════════════════════════════════════════════════════════════
                     APPLICATION STATUS
═══════════════════════════════════════════════════════════════
Status: SUBMITTED
You will receive confirmation via email within 5-7 business days.

Thank you for choosing Shomoukh Early Childhood Education.
═══════════════════════════════════════════════════════════════
    `
  }

  const handleNewApplication = () => {
    resetForm()
  }

  // Success State
  if (submitted) {
    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gold/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-gold" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-6 h-6 text-gold animate-pulse" />
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-3 text-balance">
            Application Submitted Successfully!
          </h2>

          <p className="text-ash text-sm sm:text-base mb-8 max-w-xl leading-relaxed">
            Thank you for submitting your enrollment application to Shomoukh Early Childhood Education. 
            We have received your information and our admissions team will review it carefully.
          </p>

          {/* Confirmation Card */}
          <Card className="w-full max-w-2xl p-6 sm:p-8 border-gold/20 bg-gradient-to-br from-gold/5 to-transparent">
            {/* Email Confirmation */}
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-silver">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <div className="text-left">
                <p className="font-medium text-charcoal mb-1">Confirmation Email Sent</p>
                <p className="text-sm text-ash">
                  A confirmation has been sent to <span className="text-charcoal font-medium">{student.parentGuardian1Email}</span>
                </p>
              </div>
            </div>

            {/* Application Summary */}
            <div className="bg-white rounded-xl p-4 sm:p-5 mb-6 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-ash text-xs uppercase tracking-wider mb-1">Student Name</p>
                  <p className="font-medium text-charcoal">{student.givenNames} {student.familyName}</p>
                </div>
                <div>
                  <p className="text-ash text-xs uppercase tracking-wider mb-1">Applied Grade</p>
                  <p className="font-medium text-charcoal">{student.anticipatedGradeOfEntry}</p>
                </div>
                <div>
                  <p className="text-ash text-xs uppercase tracking-wider mb-1">Enrollment Year</p>
                  <p className="font-medium text-charcoal">{student.enrollmentYear}</p>
                </div>
                <div>
                  <p className="text-ash text-xs uppercase tracking-wider mb-1">Application ID</p>
                  <p className="font-medium text-gold">APP-{Date.now().toString().slice(-8)}</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="text-left">
              <p className="text-sm font-semibold text-charcoal mb-4">What happens next?</p>
              <div className="space-y-3">
                {[
                  { icon: FileCheck, text: 'Application Review', time: '5-7 business days' },
                  { icon: Calendar, text: 'Interview Invitation', time: 'If applicable' },
                  { icon: Mail, text: 'Admission Decision', time: 'Via email' },
                  { icon: CheckCircle, text: 'Enrollment Confirmation', time: 'Final step' },
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-4 h-4 text-gold" />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm text-charcoal">{step.text}</span>
                      <span className="text-xs text-ash">{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-2xl">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 h-11 border-gold/30 text-charcoal hover:bg-gold/5 gap-2"
            >
              <Download className="w-4 h-4" />
              Download Summary
            </Button>
            <Button
              onClick={handleNewApplication}
              className="flex-1 btn-premium h-11 text-charcoal font-medium"
            >
              Submit Another Application
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Review State
  return (
    <div className="space-y-6 sm:space-y-8 stagger-children">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-2">Review Your Application</h2>
        <p className="text-ash text-sm sm:text-base">Please verify all information is correct before submitting.</p>
      </div>

      {/* Student Summary */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover overflow-hidden">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
            <User className="w-5 h-5 text-charcoal" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">Student Information</h3>
            <button 
              onClick={() => setCurrentStep(1)} 
              className="text-xs text-gold hover:underline"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-ash text-xs uppercase tracking-wider mb-1">Full Name</p>
            <p className="font-medium text-charcoal">{student.givenNames} {student.middleName ? student.middleName + ' ' : ''}{student.familyName}</p>
          </div>
          <div>
            <p className="text-ash text-xs uppercase tracking-wider mb-1">Date of Birth</p>
            <p className="font-medium text-charcoal">{student.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-ash text-xs uppercase tracking-wider mb-1">Gender</p>
            <p className="font-medium text-charcoal capitalize">{student.gender}</p>
          </div>
          <div>
            <p className="text-ash text-xs uppercase tracking-wider mb-1">Nationality</p>
            <p className="font-medium text-charcoal">{student.nationality}</p>
          </div>
          <div>
            <p className="text-ash text-xs uppercase tracking-wider mb-1">Grade</p>
            <p className="font-medium text-charcoal">{student.anticipatedGradeOfEntry}</p>
          </div>
          <div>
            <p className="text-ash text-xs uppercase tracking-wider mb-1">Year</p>
            <p className="font-medium text-charcoal">{student.enrollmentYear}</p>
          </div>
        </div>
      </Card>

      {/* Family Summary */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
            <Users className="w-5 h-5 text-charcoal" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">Family Information</h3>
            <button 
              onClick={() => setCurrentStep(2)} 
              className="text-xs text-gold hover:underline"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-ash text-xs uppercase tracking-wider mb-1">Primary Contact</p>
            <p className="font-medium text-charcoal">{student.parentGuardian1Name}</p>
            <p className="text-ash text-xs">{student.parentGuardian1Relationship}</p>
          </div>
          <div>
            <p className="text-ash text-xs uppercase tracking-wider mb-1">Contact Details</p>
            <p className="font-medium text-charcoal">{student.parentGuardian1Email}</p>
            <p className="text-ash text-xs">{student.parentGuardian1Phone}</p>
          </div>
        </div>
      </Card>

      {/* Emergency Contact Summary */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
            <Phone className="w-5 h-5 text-charcoal" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">Emergency Contact</h3>
            <button 
              onClick={() => setCurrentStep(3)} 
              className="text-xs text-gold hover:underline"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-ash text-xs uppercase tracking-wider mb-1">Contact Name</p>
            <p className="font-medium text-charcoal">{student.emergencyContactName}</p>
            <p className="text-ash text-xs">{student.emergencyContactRelationship}</p>
          </div>
          <div>
            <p className="text-ash text-xs uppercase tracking-wider mb-1">Phone</p>
            <p className="font-medium text-charcoal">{student.emergencyContactPhone}</p>
          </div>
        </div>
      </Card>

      {/* Agreements Summary */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-charcoal" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">Agreements</h3>
            <button 
              onClick={() => setCurrentStep(5)} 
              className="text-xs text-gold hover:underline"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {student.agreeToTerms && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Terms Accepted
            </span>
          )}
          {student.agreeToPrivacyPolicy && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Privacy Policy Accepted
            </span>
          )}
          {student.agreeToDataProcessing && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Data Processing Accepted
            </span>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-silver">
        <Button 
          onClick={() => {
            setCurrentStep(5)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }} 
          variant="outline" 
          className="w-full sm:w-auto h-11 px-6 border-gold/30 text-charcoal hover:bg-gold/5 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto btn-premium h-12 px-8 text-charcoal font-semibold gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Application
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
