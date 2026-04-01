'use client'

import { useEnrollment } from '@/app/enrollment/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Phone, ArrowRight, ArrowLeft, AlertCircle, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export function EnrollmentStep3() {
  const { student, updateStudent, setCurrentStep } = useEnrollment()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!student.emergencyContactName) newErrors.emergencyContactName = 'Contact name is required'
    if (!student.emergencyContactPhone) newErrors.emergencyContactPhone = 'Phone number is required'
    if (!student.emergencyContactRelationship) newErrors.emergencyContactRelationship = 'Relationship is required'

    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0]
      const element = document.getElementById(firstErrorKey)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(4)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const FormField = ({ 
    id, 
    label, 
    required = false, 
    error, 
    children 
  }: { 
    id: string
    label: string
    required?: boolean
    error?: string
    children: React.ReactNode 
  }) => (
    <div className="space-y-2" id={id}>
      <Label htmlFor={id} className="text-sm font-medium text-charcoal">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )

  return (
    <div className="space-y-6 sm:space-y-8 stagger-children">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-2">Emergency Contact</h2>
        <p className="text-ash text-sm sm:text-base">Provide details of a person we can contact in case of emergency.</p>
      </div>

      {/* Important Notice */}
      <Card className="bg-amber-50 border-amber-200 p-4 sm:p-5">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900 mb-1">Important</p>
            <p className="text-sm text-amber-800 leading-relaxed">
              This person should be easily reachable during school hours and should not be a parent or guardian already listed above.
            </p>
          </div>
        </div>
      </Card>

      {/* Emergency Contact Details */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <Phone className="w-4 h-4 text-gold" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">Contact Details</h3>
        </div>

        <div className="space-y-5">
          <FormField id="emergencyContactName" label="Full Name" required error={errors.emergencyContactName}>
            <Input
              id="emergencyContactName"
              placeholder="e.g., Khaled Al-Noor"
              value={student.emergencyContactName}
              onChange={(e) => updateStudent({ emergencyContactName: e.target.value })}
              className={`h-11 ${errors.emergencyContactName ? 'border-destructive' : ''}`}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="emergencyContactPhone" label="Phone Number" required error={errors.emergencyContactPhone}>
              <Input
                id="emergencyContactPhone"
                placeholder="+968 XXXX XXXX"
                value={student.emergencyContactPhone}
                onChange={(e) => updateStudent({ emergencyContactPhone: e.target.value })}
                className={`h-11 ${errors.emergencyContactPhone ? 'border-destructive' : ''}`}
              />
            </FormField>

            <FormField id="emergencyContactRelationship" label="Relationship to Student" required error={errors.emergencyContactRelationship}>
              <Input
                id="emergencyContactRelationship"
                placeholder="e.g., Uncle, Aunt, Neighbor"
                value={student.emergencyContactRelationship}
                onChange={(e) => updateStudent({ emergencyContactRelationship: e.target.value })}
                className={`h-11 ${errors.emergencyContactRelationship ? 'border-destructive' : ''}`}
              />
            </FormField>
          </div>

          <FormField id="emergencyContactAddress" label="Address">
            <Input
              id="emergencyContactAddress"
              placeholder="Optional - street address, city"
              value={student.emergencyContactAddress || ''}
              onChange={(e) => updateStudent({ emergencyContactAddress: e.target.value })}
              className="h-11"
            />
          </FormField>
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
          className="w-full sm:w-auto btn-premium h-11 px-6 text-charcoal font-medium gap-2"
        >
          Save & Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
