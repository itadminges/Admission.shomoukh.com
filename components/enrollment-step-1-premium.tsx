'use client'

import { useState, useRef } from 'react'
import { useEnrollment } from '@/app/enrollment/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Cloud, User, Calendar, Globe, Volume2, BookOpen, Check } from 'lucide-react'
import Image from 'next/image'

export function EnrollmentStep1Premium() {
  const { student, updateStudent, setCurrentStep } = useEnrollment()
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateStudent({ photo: file })
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(2)
    }
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <User className="w-5 h-5 text-gold" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Student Profile</h2>
          </div>
          <p className="text-text-muted text-sm">Please provide the basic details of the child applying for enrolment.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cream rounded-full text-sm font-medium text-charcoal">
          <Clock className="w-4 h-4" />
          <span>Estimated time: 2 minutes</span>
        </div>
      </div>

      {/* Photo Upload Card */}
      <div className="bg-cream/50 border-2 border-dashed border-gold rounded-2xl p-8">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Photo Upload Area */}
          <div className="flex-1">
            <div
              className="border-2 border-dashed border-gold rounded-xl p-8 text-center cursor-pointer hover:bg-gold/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Cloud className="w-12 h-12 text-gold mx-auto mb-3" />
              <h3 className="font-semibold text-charcoal mb-1">Upload Passport-Size Photo</h3>
              <p className="text-sm text-text-muted mb-2">Drag & drop or click to browse</p>
              <p className="text-xs text-text-muted">JPG, PNG up to 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-text-muted mt-3 flex items-center gap-2">
              <info className="w-3 h-3" />
              Passport size, clear background
            </p>
          </div>

          {/* Photo Preview */}
          {photoPreview && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-32 h-40 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={photoPreview}
                  alt="Student photo"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setPhotoPreview(null)
                  updateStudent({ photo: undefined })
                }}
                className="mt-4 text-gold hover:text-gold hover:bg-gold/10"
              >
                Change Photo
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Student Identity Section */}
      <div className="border border-border-light rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-charcoal text-lg">Student Identity</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              First Name <span className="text-gold">*</span>
            </label>
            <Input
              placeholder="Enter first name"
              value={student.givenNames}
              onChange={(e) => updateStudent({ givenNames: e.target.value })}
              className={`rounded-lg ${errors.givenNames ? 'border-red-500' : ''}`}
            />
            {errors.givenNames && <p className="text-xs text-red-500 mt-1">{errors.givenNames}</p>}
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Middle Name
            </label>
            <Input
              placeholder="Enter middle name (optional)"
              value={student.middleName || ''}
              onChange={(e) => updateStudent({ middleName: e.target.value })}
              className="rounded-lg"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Last Name <span className="text-gold">*</span>
            </label>
            <Input
              placeholder="Enter last name"
              value={student.familyName}
              onChange={(e) => updateStudent({ familyName: e.target.value })}
              className={`rounded-lg ${errors.familyName ? 'border-red-500' : ''}`}
            />
            {errors.familyName && <p className="text-xs text-red-500 mt-1">{errors.familyName}</p>}
          </div>

          {/* Preferred Name */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Preferred Name <span className="text-gold">*</span>
            </label>
            <Input
              placeholder="How would you like us to call your child?"
              value={student.knownAs || ''}
              onChange={(e) => updateStudent({ knownAs: e.target.value })}
              className={`rounded-lg ${errors.knownAs ? 'border-red-500' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="border border-border-light rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-charcoal text-lg">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Date of Birth <span className="text-gold">*</span>
            </label>
            <Input
              type="date"
              value={student.dateOfBirth}
              onChange={(e) => updateStudent({ dateOfBirth: e.target.value })}
              className={`rounded-lg ${errors.dateOfBirth ? 'border-red-500' : ''}`}
            />
            {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-3">
              Gender <span className="text-gold">*</span>
            </label>
            <div className="flex gap-3">
              {['male', 'female'].map((option) => (
                <button
                  key={option}
                  onClick={() => updateStudent({ gender: option as 'male' | 'female' })}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                    student.gender === option
                      ? 'bg-gold text-white'
                      : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                  }`}
                >
                  {option === 'male' ? '👦 Boy' : '👧 Girl'}
                </button>
              ))}
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Nationality <span className="text-gold">*</span>
            </label>
            <Select value={student.nationality} onValueChange={(value) => updateStudent({ nationality: value })}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select nationality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oman">Omani</SelectItem>
                <SelectItem value="arab">Arab</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="european">European</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.nationality && <p className="text-xs text-red-500 mt-1">{errors.nationality}</p>}
          </div>

          {/* Oman Resident Card */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Oman Resident Card Number
            </label>
            <Input
              placeholder="Enter resident card number"
              value={student.omanResidentCardNumber || ''}
              onChange={(e) => updateStudent({ omanResidentCardNumber: e.target.value })}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Language Section */}
      <div className="border border-border-light rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Volume2 className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-charcoal text-lg">Language</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* First Language */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              First Language Spoken <span className="text-gold">*</span>
            </label>
            <Select value={student.firstLanguageSpoken} onValueChange={(value) => updateStudent({ firstLanguageSpoken: value })}>
              <SelectTrigger className="rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Urdu">Urdu</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Other Language */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Other Language Spoken
            </label>
            <Select value={student.otherLanguageSpoken || ''} onValueChange={(value) => updateStudent({ otherLanguageSpoken: value })}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* English Level */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Level of English Spoken <span className="text-gold">*</span>
            </label>
            <Select value={student.levelOfEnglishSpoken} onValueChange={(value) => updateStudent({ levelOfEnglishSpoken: value })}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Fluent">Fluent</SelectItem>
                <SelectItem value="Native">Native Speaker</SelectItem>
              </SelectContent>
            </Select>
            {errors.levelOfEnglishSpoken && <p className="text-xs text-red-500 mt-1">{errors.levelOfEnglishSpoken}</p>}
          </div>
        </div>
      </div>

      {/* Enrollment Information Section */}
      <div className="border border-border-light rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-5 h-5 text-gold" />
          <h3 className="font-semibold text-charcoal text-lg">Enrollment Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Academic Year */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Academic Year <span className="text-gold">*</span>
            </label>
            <Select value={student.enrollmentYear} onValueChange={(value) => updateStudent({ enrollmentYear: value })}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-2026">2025–2026 (Current Year)</SelectItem>
                <SelectItem value="2026-2027">2026–2027</SelectItem>
                <SelectItem value="2027-2028">2027–2028</SelectItem>
              </SelectContent>
            </Select>
            {errors.enrollmentYear && <p className="text-xs text-red-500 mt-1">{errors.enrollmentYear}</p>}
          </div>

          {/* Grade of Entry */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Anticipated Grade of Entry <span className="text-gold">*</span>
            </label>
            <Select value={student.anticipatedGradeOfEntry} onValueChange={(value) => updateStudent({ anticipatedGradeOfEntry: value })}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nursery1">Nursery 1</SelectItem>
                <SelectItem value="Nursery2">Nursery 2</SelectItem>
                <SelectItem value="KG1">Kindergarten 1</SelectItem>
                <SelectItem value="KG2">Kindergarten 2</SelectItem>
              </SelectContent>
            </Select>
            {errors.anticipatedGradeOfEntry && (
              <p className="text-xs text-red-500 mt-1">{errors.anticipatedGradeOfEntry}</p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-cream/50 border border-gold/20 rounded-lg p-4 flex gap-3">
          <div className="flex-shrink-0">
            <span className="text-gold text-lg">ℹ️</span>
          </div>
          <p className="text-sm text-charcoal">
            Children must be 2 years old by 1st September 2025 for Nursery admission.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center pt-4">
        <div className="text-xs text-text-muted">
          Your progress will be saved automatically
        </div>
        <Button
          onClick={handleNext}
          className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-white rounded-lg px-8 py-3 font-semibold flex items-center justify-center gap-2"
        >
          Save & Next
          <span>→</span>
        </Button>
      </div>
    </div>
  )
}

// Helper icon
function Clock(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
