'use client'

import { useEnrollment } from '@/app/enrollment/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { GraduationCap, BookOpen, ArrowRight, ArrowLeft, Info } from 'lucide-react'

export function EnrollmentStep4() {
  const { student, updateStudent, setCurrentStep } = useEnrollment()

  const handleNext = () => {
    setCurrentStep(5)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setCurrentStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const FormField = ({ 
    id, 
    label, 
    children 
  }: { 
    id: string
    label: string
    children: React.ReactNode 
  }) => (
    <div className="space-y-2" id={id}>
      <Label htmlFor={id} className="text-sm font-medium text-charcoal">{label}</Label>
      {children}
    </div>
  )

  return (
    <div className="space-y-6 sm:space-y-8 stagger-children">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-2">Educational Background</h2>
        <p className="text-ash text-sm sm:text-base">Share information about the student&apos;s previous schooling and academic history.</p>
      </div>

      {/* Optional Notice */}
      <Card className="bg-blue-50 border-blue-200 p-4 sm:p-5">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Optional Section</p>
            <p className="text-sm text-blue-800 leading-relaxed">
              This section is optional. If this is your child&apos;s first school experience, you may skip these fields and proceed to the next step.
            </p>
          </div>
        </div>
      </Card>

      {/* Previous School */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-gold" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">Previous School</h3>
        </div>

        <div className="space-y-5">
          <FormField id="previousSchoolName" label="School Name">
            <Input
              id="previousSchoolName"
              placeholder="e.g., International School of Oman"
              value={student.previousSchoolName || ''}
              onChange={(e) => updateStudent({ previousSchoolName: e.target.value })}
              className="h-11"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="previousSchoolCountry" label="Country">
              <Input
                id="previousSchoolCountry"
                placeholder="e.g., Oman"
                value={student.previousSchoolCountry || ''}
                onChange={(e) => updateStudent({ previousSchoolCountry: e.target.value })}
                className="h-11"
              />
            </FormField>

            <FormField id="yearsAttended" label="Years Attended">
              <Input
                id="yearsAttended"
                placeholder="e.g., 2022-2024"
                value={student.yearsAttended || ''}
                onChange={(e) => updateStudent({ yearsAttended: e.target.value })}
                className="h-11"
              />
            </FormField>
          </div>

          <FormField id="currentAcademicLevel" label="Current/Last Academic Level">
            <Input
              id="currentAcademicLevel"
              placeholder="e.g., Grade 2, Kindergarten"
              value={student.currentAcademicLevel || ''}
              onChange={(e) => updateStudent({ currentAcademicLevel: e.target.value })}
              className="h-11"
            />
          </FormField>
        </div>
      </Card>

      {/* Additional Information */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-gold" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">Additional Information</h3>
        </div>

        <FormField id="additionalEducationalInfo" label="Educational Notes">
          <Textarea
            id="additionalEducationalInfo"
            placeholder="Share any additional information about your child's education, learning strengths, areas where they may need support, or any special requirements..."
            value={student.additionalEducationalInfo || ''}
            onChange={(e) => updateStudent({ additionalEducationalInfo: e.target.value })}
            className="min-h-32 resize-y"
          />
          <p className="text-xs text-ash mt-2">
            This information helps us understand your child better and provide the most appropriate support from day one.
          </p>
        </FormField>
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
