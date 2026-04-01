'use client'

import { useEnrollment } from '@/app/enrollment/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Users, User, MapPin, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export function EnrollmentStep2() {
  const { student, updateStudent, setCurrentStep } = useEnrollment()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!student.parentGuardian1Name) newErrors.parentGuardian1Name = 'Name is required'
    if (!student.parentGuardian1Email) newErrors.parentGuardian1Email = 'Email is required'
    if (!student.parentGuardian1Phone) newErrors.parentGuardian1Phone = 'Phone is required'
    if (!student.parentGuardian1Relationship) newErrors.parentGuardian1Relationship = 'Relationship is required'

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
      setCurrentStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
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
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-2">Family Information</h2>
        <p className="text-ash text-sm sm:text-base">Please provide details of the student&apos;s parents or guardians.</p>
      </div>

      {/* Primary Parent/Guardian */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-charcoal font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">Primary Parent/Guardian</h3>
            <p className="text-xs text-ash">Main contact for school communications</p>
          </div>
        </div>

        <div className="space-y-5">
          <FormField id="parentGuardian1Name" label="Full Name" required error={errors.parentGuardian1Name}>
            <Input
              id="parentGuardian1Name"
              placeholder="e.g., Ahmed Al-Manouri"
              value={student.parentGuardian1Name}
              onChange={(e) => updateStudent({ parentGuardian1Name: e.target.value })}
              className={`h-11 ${errors.parentGuardian1Name ? 'border-destructive' : ''}`}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="parentGuardian1Email" label="Email Address" required error={errors.parentGuardian1Email}>
              <Input
                id="parentGuardian1Email"
                type="email"
                placeholder="email@example.com"
                value={student.parentGuardian1Email}
                onChange={(e) => updateStudent({ parentGuardian1Email: e.target.value })}
                className={`h-11 ${errors.parentGuardian1Email ? 'border-destructive' : ''}`}
              />
            </FormField>

            <FormField id="parentGuardian1Phone" label="Phone Number" required error={errors.parentGuardian1Phone}>
              <Input
                id="parentGuardian1Phone"
                placeholder="+968 XXXX XXXX"
                value={student.parentGuardian1Phone}
                onChange={(e) => updateStudent({ parentGuardian1Phone: e.target.value })}
                className={`h-11 ${errors.parentGuardian1Phone ? 'border-destructive' : ''}`}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="parentGuardian1Relationship" label="Relationship to Student" required error={errors.parentGuardian1Relationship}>
              <Input
                id="parentGuardian1Relationship"
                placeholder="e.g., Father, Mother, Guardian"
                value={student.parentGuardian1Relationship}
                onChange={(e) => updateStudent({ parentGuardian1Relationship: e.target.value })}
                className={`h-11 ${errors.parentGuardian1Relationship ? 'border-destructive' : ''}`}
              />
            </FormField>

            <FormField id="parentGuardian1Occupation" label="Occupation">
              <Input
                id="parentGuardian1Occupation"
                placeholder="Optional"
                value={student.parentGuardian1Occupation || ''}
                onChange={(e) => updateStudent({ parentGuardian1Occupation: e.target.value })}
                className="h-11"
              />
            </FormField>
          </div>
        </div>
      </Card>

      {/* Secondary Parent/Guardian */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-silver flex items-center justify-center text-ash font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">Secondary Parent/Guardian</h3>
            <p className="text-xs text-ash">Optional - additional contact information</p>
          </div>
        </div>

        <div className="space-y-5">
          <FormField id="parentGuardian2Name" label="Full Name">
            <Input
              id="parentGuardian2Name"
              placeholder="e.g., Fatima Al-Manouri"
              value={student.parentGuardian2Name || ''}
              onChange={(e) => updateStudent({ parentGuardian2Name: e.target.value })}
              className="h-11"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="parentGuardian2Email" label="Email Address">
              <Input
                id="parentGuardian2Email"
                type="email"
                placeholder="email@example.com"
                value={student.parentGuardian2Email || ''}
                onChange={(e) => updateStudent({ parentGuardian2Email: e.target.value })}
                className="h-11"
              />
            </FormField>

            <FormField id="parentGuardian2Phone" label="Phone Number">
              <Input
                id="parentGuardian2Phone"
                placeholder="+968 XXXX XXXX"
                value={student.parentGuardian2Phone || ''}
                onChange={(e) => updateStudent({ parentGuardian2Phone: e.target.value })}
                className="h-11"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="parentGuardian2Relationship" label="Relationship to Student">
              <Input
                id="parentGuardian2Relationship"
                placeholder="e.g., Father, Mother, Guardian"
                value={student.parentGuardian2Relationship || ''}
                onChange={(e) => updateStudent({ parentGuardian2Relationship: e.target.value })}
                className="h-11"
              />
            </FormField>

            <FormField id="parentGuardian2Occupation" label="Occupation">
              <Input
                id="parentGuardian2Occupation"
                placeholder="Optional"
                value={student.parentGuardian2Occupation || ''}
                onChange={(e) => updateStudent({ parentGuardian2Occupation: e.target.value })}
                className="h-11"
              />
            </FormField>
          </div>
        </div>
      </Card>

      {/* Family Address */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-gold" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">Family Address</h3>
        </div>

        <div className="space-y-5">
          <FormField id="familyAddress" label="Street Address">
            <Input
              id="familyAddress"
              placeholder="Building number, street name, area"
              value={student.familyAddress || ''}
              onChange={(e) => updateStudent({ familyAddress: e.target.value })}
              className="h-11"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="familyCity" label="City">
              <Input
                id="familyCity"
                placeholder="e.g., Muscat"
                value={student.familyCity || ''}
                onChange={(e) => updateStudent({ familyCity: e.target.value })}
                className="h-11"
              />
            </FormField>

            <FormField id="familyCountry" label="Country">
              <Input
                id="familyCountry"
                placeholder="e.g., Oman"
                value={student.familyCountry || ''}
                onChange={(e) => updateStudent({ familyCountry: e.target.value })}
                className="h-11"
              />
            </FormField>
          </div>
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
