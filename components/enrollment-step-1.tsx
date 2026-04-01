'use client'

import { useEnrollment } from '@/app/enrollment/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { Upload, AlertCircle, Camera, User, Globe, Languages, GraduationCap, ArrowRight, Info } from 'lucide-react'
import { useState } from 'react'

const NATIONALITIES = [
  'Omani', 'Saudi Arabian', 'Emirati', 'Kuwaiti', 'Qatari', 'Bahraini',
  'British', 'American', 'Indian', 'Pakistani', 'Filipino', 'Egyptian',
  'Jordanian', 'Lebanese', 'Syrian', 'Other',
]

const LANGUAGES = ['English', 'Arabic', 'French', 'German', 'Spanish', 'Mandarin', 'Hindi', 'Urdu', 'Other']

const ENGLISH_LEVELS = [
  'Native Speaker',
  'Fluent',
  'Advanced (C1)',
  'Upper Intermediate (B2)',
  'Intermediate (B1)',
  'Elementary (A2)',
  'Beginner (A1)',
]

const GRADES = [
  'Nursery 1 (Age 2-3)',
  'Nursery 2 (Age 3-4)',
  'Kindergarten 1 (Age 4-5)',
  'Kindergarten 2 (Age 5-6)',
  'Grade 1 (Age 6-7)',
  'Grade 2 (Age 7-8)',
  'Grade 3 (Age 8-9)',
]

export function EnrollmentStep1() {
  const { student, updateStudent, setCurrentStep } = useEnrollment()
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!student.familyName) newErrors.familyName = 'Family name is required'
    if (!student.givenNames) newErrors.givenNames = 'Given names are required'
    if (!student.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!student.nationality) newErrors.nationality = 'Nationality is required'
    if (!student.gender) newErrors.gender = 'Gender is required'
    if (!student.firstLanguageSpoken) newErrors.firstLanguageSpoken = 'First language is required'
    if (!student.levelOfEnglishSpoken) newErrors.levelOfEnglishSpoken = 'English level is required'
    if (!student.enrollmentYear) newErrors.enrollmentYear = 'Enrollment year is required'
    if (!student.anticipatedGradeOfEntry) newErrors.anticipatedGradeOfEntry = 'Grade of entry is required'

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
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateStudent({ photo: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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
      {/* Intro Card */}
      <Card className="bg-gradient-to-br from-gold/5 via-gold/[0.02] to-transparent border-gold/20 p-5 sm:p-6 card-hover">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-2">
              Application for Enrolment
            </h2>
            <p className="text-ash text-sm leading-relaxed">
              A place will be offered whenever possible to best meet your child&apos;s needs. Acceptance is dependent upon successful fulfilment of our admission requirements.
            </p>
          </div>
        </div>
      </Card>

      {/* Photo Upload Section */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <Camera className="w-4 h-4 text-gold" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">Student Photo</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {photoPreview ? (
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-gold/30 shadow-lg">
                <img src={photoPreview} alt="Student" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => {
                  setPhotoPreview(null)
                  updateStudent({ photo: undefined })
                }}
                className="absolute -top-2 -right-2 w-7 h-7 bg-destructive text-white rounded-full flex items-center justify-center text-sm font-medium shadow-lg hover:bg-destructive/90 transition-colors"
              >
                &times;
              </button>
            </div>
          ) : (
            <label className="w-28 h-28 sm:w-32 sm:h-32 border-2 border-dashed border-silver hover:border-gold/50 rounded-2xl cursor-pointer transition-all hover:bg-gold/5 flex flex-col items-center justify-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-silver group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                <Upload className="w-5 h-5 text-ash group-hover:text-gold transition-colors" />
              </div>
              <span className="text-xs text-ash group-hover:text-gold transition-colors font-medium">Upload Photo</span>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          )}
          <div className="flex-1">
            <p className="text-sm text-charcoal font-medium mb-1">Passport-size Photo</p>
            <p className="text-xs text-ash leading-relaxed">
              Please upload a recent passport-size photograph with a plain background. Accepted formats: JPG, PNG. Max size: 5MB.
            </p>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <User className="w-4 h-4 text-gold" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">Personal Information</h3>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="familyName" label="Family Name" required error={errors.familyName}>
              <Input
                id="familyName"
                placeholder="e.g., Al-Manouri"
                value={student.familyName}
                onChange={(e) => updateStudent({ familyName: e.target.value })}
                className={`h-11 ${errors.familyName ? 'border-destructive focus:ring-destructive/20' : ''}`}
              />
            </FormField>

            <FormField id="givenNames" label="Given Names" required error={errors.givenNames}>
              <Input
                id="givenNames"
                placeholder="e.g., Mohammed"
                value={student.givenNames}
                onChange={(e) => updateStudent({ givenNames: e.target.value })}
                className={`h-11 ${errors.givenNames ? 'border-destructive' : ''}`}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="middleName" label="Middle Name">
              <Input
                id="middleName"
                placeholder="Optional"
                value={student.middleName || ''}
                onChange={(e) => updateStudent({ middleName: e.target.value })}
                className="h-11"
              />
            </FormField>

            <FormField id="knownAs" label="Preferred Name / Known As">
              <Input
                id="knownAs"
                placeholder="Optional"
                value={student.knownAs || ''}
                onChange={(e) => updateStudent({ knownAs: e.target.value })}
                className="h-11"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="dateOfBirth" label="Date of Birth" required error={errors.dateOfBirth}>
              <Input
                id="dateOfBirth"
                type="date"
                value={student.dateOfBirth}
                onChange={(e) => updateStudent({ dateOfBirth: e.target.value })}
                className={`h-11 ${errors.dateOfBirth ? 'border-destructive' : ''}`}
              />
            </FormField>

            <FormField id="gender" label="Gender" required error={errors.gender}>
              <RadioGroup 
                value={student.gender} 
                onValueChange={(v) => updateStudent({ gender: v as 'male' | 'female' })}
                className="flex items-center gap-4 h-11"
              >
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                  student.gender === 'male' ? 'border-gold bg-gold/5' : 'border-silver hover:border-gold/30'
                }`}>
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="font-normal cursor-pointer text-sm">Male</Label>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                  student.gender === 'female' ? 'border-gold bg-gold/5' : 'border-silver hover:border-gold/30'
                }`}>
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="font-normal cursor-pointer text-sm">Female</Label>
                </div>
              </RadioGroup>
            </FormField>
          </div>
        </div>
      </Card>

      {/* Nationality & Residency */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <Globe className="w-4 h-4 text-gold" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">Nationality & Residency</h3>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="nationality" label="Nationality" required error={errors.nationality}>
              <Select value={student.nationality} onValueChange={(v) => updateStudent({ nationality: v })}>
                <SelectTrigger className={`h-11 ${errors.nationality ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  {NATIONALITIES.map((nat) => (
                    <SelectItem key={nat} value={nat}>{nat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField id="omanResidentCardNumber" label="Oman Resident Card Number">
              <Input
                id="omanResidentCardNumber"
                placeholder="Optional"
                value={student.omanResidentCardNumber || ''}
                onChange={(e) => updateStudent({ omanResidentCardNumber: e.target.value })}
                className="h-11"
              />
            </FormField>
          </div>
        </div>
      </Card>

      {/* Languages */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <Languages className="w-4 h-4 text-gold" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">Language Proficiency</h3>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="firstLanguageSpoken" label="First Language" required error={errors.firstLanguageSpoken}>
              <Select value={student.firstLanguageSpoken} onValueChange={(v) => updateStudent({ firstLanguageSpoken: v })}>
                <SelectTrigger className={`h-11 ${errors.firstLanguageSpoken ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField id="otherLanguageSpoken" label="Other Language">
              <Select value={student.otherLanguageSpoken || ''} onValueChange={(v) => updateStudent({ otherLanguageSpoken: v })}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select language (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField id="levelOfEnglishSpoken" label="Level of English" required error={errors.levelOfEnglishSpoken}>
            <Select value={student.levelOfEnglishSpoken} onValueChange={(v) => updateStudent({ levelOfEnglishSpoken: v })}>
              <SelectTrigger className={`h-11 ${errors.levelOfEnglishSpoken ? 'border-destructive' : ''}`}>
                <SelectValue placeholder="Select English proficiency level" />
              </SelectTrigger>
              <SelectContent>
                {ENGLISH_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </Card>

      {/* Enrollment Details */}
      <Card className="p-5 sm:p-6 border-silver/50 card-hover">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-gold" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">Enrollment Details</h3>
        </div>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <FormField id="enrollmentYear" label="Enrollment Year" required error={errors.enrollmentYear}>
              <Select value={student.enrollmentYear} onValueChange={(v) => updateStudent({ enrollmentYear: v })}>
                <SelectTrigger className={`h-11 ${errors.enrollmentYear ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {[2025, 2026, 2027].map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField id="anticipatedGradeOfEntry" label="Anticipated Grade of Entry" required error={errors.anticipatedGradeOfEntry}>
              <Select value={student.anticipatedGradeOfEntry} onValueChange={(v) => updateStudent({ anticipatedGradeOfEntry: v })}>
                <SelectTrigger className={`h-11 ${errors.anticipatedGradeOfEntry ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <p className="text-sm text-charcoal leading-relaxed">
              Students must have reached the expected age by 1st September for admission to each grade as defined in the Schedule of Fees.
            </p>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-silver">
        <p className="text-xs text-ash">
          <span className="text-destructive">*</span> Required fields
        </p>
        <Button 
          onClick={handleNext} 
          className="btn-premium h-11 px-6 text-charcoal font-medium gap-2"
        >
          Save & Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
