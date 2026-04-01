'use client'

import { useEnrollment } from '@/app/enrollment/context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Shield, Database, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react'
import { useState } from 'react'

export function EnrollmentStep5() {
  const { student, updateStudent, setCurrentStep } = useEnrollment()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!student.agreeToTerms) newErrors.agreeToTerms = 'Required'
    if (!student.agreeToPrivacyPolicy) newErrors.agreeToPrivacyPolicy = 'Required'
    if (!student.agreeToDataProcessing) newErrors.agreeToDataProcessing = 'Required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(6)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setCurrentStep(4)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const allAgreed = student.agreeToTerms && student.agreeToPrivacyPolicy && student.agreeToDataProcessing

  return (
    <div className="space-y-6 sm:space-y-8 stagger-children">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-2">Terms & Agreements</h2>
        <p className="text-ash text-sm sm:text-base">Please review and accept the terms and conditions to proceed.</p>
      </div>

      {/* School Policies */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-gold" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">School Policies</h3>
        </div>

        <div className="bg-silver/30 rounded-xl p-4 sm:p-5 max-h-56 overflow-y-auto mb-6 text-sm text-charcoal space-y-4 leading-relaxed">
          <div>
            <p className="font-semibold text-charcoal mb-1">Admission Policy</p>
            <p className="text-ash">A place will be offered whenever it is possible to best meet the perceived needs of the child. Parents will be notified when a place is available. Acceptance of the child is dependent upon successful fulfilment of our admission requirements.</p>
          </div>
          <div>
            <p className="font-semibold text-charcoal mb-1">Code of Conduct</p>
            <p className="text-ash">All students are expected to adhere to our school code of conduct. This includes respectful behavior toward peers, staff, and the learning environment.</p>
          </div>
          <div>
            <p className="font-semibold text-charcoal mb-1">Health & Safety</p>
            <p className="text-ash">We maintain strict health and safety standards. Parents must inform us of any medical conditions, allergies, or special needs that may require accommodation.</p>
          </div>
          <div>
            <p className="font-semibold text-charcoal mb-1">Communication</p>
            <p className="text-ash">We encourage open communication between parents and school. Regular updates about student progress will be provided through our parent portal and scheduled meetings.</p>
          </div>
          <div>
            <p className="font-semibold text-charcoal mb-1">Fees & Payment</p>
            <p className="text-ash">Payment of fees is due as per the agreed schedule. Late payments may result in suspension of enrollment until outstanding balances are settled.</p>
          </div>
        </div>

        {/* Agreement Checkboxes */}
        <div className="space-y-3">
          {/* Terms Checkbox */}
          <div
            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
              student.agreeToTerms 
                ? 'border-gold bg-gold/5' 
                : errors.agreeToTerms 
                  ? 'border-destructive bg-destructive/5' 
                  : 'border-silver hover:border-gold/30'
            }`}
            onClick={() => updateStudent({ agreeToTerms: !student.agreeToTerms })}
          >
            <Checkbox
              id="terms"
              checked={student.agreeToTerms}
              onCheckedChange={(checked) => updateStudent({ agreeToTerms: checked as boolean })}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" />
                <Label htmlFor="terms" className="font-medium text-charcoal cursor-pointer">
                  Terms and Conditions
                </Label>
                <span className="text-destructive text-xs">*</span>
              </div>
              <p className="text-xs text-ash mt-1">
                I have read and agree to the school&apos;s terms and conditions
              </p>
            </div>
            {student.agreeToTerms && <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />}
          </div>

          {/* Privacy Policy Checkbox */}
          <div
            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
              student.agreeToPrivacyPolicy 
                ? 'border-gold bg-gold/5' 
                : errors.agreeToPrivacyPolicy 
                  ? 'border-destructive bg-destructive/5' 
                  : 'border-silver hover:border-gold/30'
            }`}
            onClick={() => updateStudent({ agreeToPrivacyPolicy: !student.agreeToPrivacyPolicy })}
          >
            <Checkbox
              id="privacy"
              checked={student.agreeToPrivacyPolicy}
              onCheckedChange={(checked) => updateStudent({ agreeToPrivacyPolicy: checked as boolean })}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" />
                <Label htmlFor="privacy" className="font-medium text-charcoal cursor-pointer">
                  Privacy Policy
                </Label>
                <span className="text-destructive text-xs">*</span>
              </div>
              <p className="text-xs text-ash mt-1">
                I acknowledge my data will be processed according to the privacy policy
              </p>
            </div>
            {student.agreeToPrivacyPolicy && <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />}
          </div>

          {/* Data Processing Checkbox */}
          <div
            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
              student.agreeToDataProcessing 
                ? 'border-gold bg-gold/5' 
                : errors.agreeToDataProcessing 
                  ? 'border-destructive bg-destructive/5' 
                  : 'border-silver hover:border-gold/30'
            }`}
            onClick={() => updateStudent({ agreeToDataProcessing: !student.agreeToDataProcessing })}
          >
            <Checkbox
              id="data"
              checked={student.agreeToDataProcessing}
              onCheckedChange={(checked) => updateStudent({ agreeToDataProcessing: checked as boolean })}
              className="mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-gold" />
                <Label htmlFor="data" className="font-medium text-charcoal cursor-pointer">
                  Data Processing Consent
                </Label>
                <span className="text-destructive text-xs">*</span>
              </div>
              <p className="text-xs text-ash mt-1">
                I consent to data processing for enrollment and administrative purposes
              </p>
            </div>
            {student.agreeToDataProcessing && <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0" />}
          </div>

          {/* Error Message */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">Please accept all required agreements to continue with your application.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Additional Notes */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-gold" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">Additional Message</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalNotes" className="text-sm font-medium text-charcoal">
            Message to Admissions Team (Optional)
          </Label>
          <Textarea
            id="additionalNotes"
            placeholder="Any additional comments, questions, or special requests for the admissions team..."
            value={student.additionalNotes || ''}
            onChange={(e) => updateStudent({ additionalNotes: e.target.value })}
            className="min-h-24 resize-y"
          />
          <p className="text-xs text-ash">
            Use this space to communicate anything you feel is important for your application.
          </p>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-silver">
        <Button 
          onClick={handleBack} 
          variant="outline" 
          className="w-full sm:w-auto h-11 px-6 border-gold/30 text-charcoal hover:bg-gold/5 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!allAgreed}
          className="w-full sm:w-auto btn-premium h-11 px-6 text-charcoal font-medium gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review Application
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
