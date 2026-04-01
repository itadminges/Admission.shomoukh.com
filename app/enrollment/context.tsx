'use client'

import React, { createContext, useContext, useState } from 'react'

export interface Student {
  // Step 1: Student Data
  photo?: File
  familyName: string
  givenNames: string
  middleName?: string
  knownAs?: string
  dateOfBirth: string
  nationality: string
  omanResidentCardNumber?: string
  gender: 'male' | 'female' | ''
  firstLanguageSpoken: string
  otherLanguageSpoken?: string
  levelOfEnglishSpoken: string
  enrollmentYear: string
  anticipatedGradeOfEntry: string

  // Step 2: Family Data
  parentGuardian1Name: string
  parentGuardian1Email: string
  parentGuardian1Phone: string
  parentGuardian1Relationship: string
  parentGuardian1Occupation?: string
  parentGuardian2Name?: string
  parentGuardian2Email?: string
  parentGuardian2Phone?: string
  parentGuardian2Relationship?: string
  parentGuardian2Occupation?: string
  familyAddress?: string
  familyCity?: string
  familyCountry?: string

  // Step 3: Emergency Data
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  emergencyContactAddress?: string

  // Step 4: Educational Background
  previousSchoolName?: string
  previousSchoolCountry?: string
  yearsAttended?: string
  currentAcademicLevel?: string
  additionalEducationalInfo?: string

  // Step 5: Conditions and Waiver
  agreeToTerms: boolean
  agreeToPrivacyPolicy: boolean
  agreeToDataProcessing: boolean
  additionalNotes?: string

  // Metadata
  id?: string
  createdAt?: string
  updatedAt?: string
  status?: 'draft' | 'submitted' | 'under-review' | 'accepted' | 'rejected'
}

const initialStudent: Student = {
  familyName: '',
  givenNames: '',
  middleName: '',
  knownAs: '',
  dateOfBirth: '',
  nationality: '',
  omanResidentCardNumber: '',
  gender: '',
  firstLanguageSpoken: 'English',
  otherLanguageSpoken: '',
  levelOfEnglishSpoken: '',
  enrollmentYear: '',
  anticipatedGradeOfEntry: '',
  parentGuardian1Name: '',
  parentGuardian1Email: '',
  parentGuardian1Phone: '',
  parentGuardian1Relationship: '',
  parentGuardian1Occupation: '',
  parentGuardian2Name: '',
  parentGuardian2Email: '',
  parentGuardian2Phone: '',
  parentGuardian2Relationship: '',
  parentGuardian2Occupation: '',
  familyAddress: '',
  familyCity: '',
  familyCountry: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  emergencyContactAddress: '',
  previousSchoolName: '',
  previousSchoolCountry: '',
  yearsAttended: '',
  currentAcademicLevel: '',
  additionalEducationalInfo: '',
  agreeToTerms: false,
  agreeToPrivacyPolicy: false,
  agreeToDataProcessing: false,
  additionalNotes: '',
  status: 'draft',
}

interface EnrollmentContextType {
  student: Student
  updateStudent: (updates: Partial<Student>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  resetForm: () => void
  completeStep: (step: number) => boolean
  getStepValidation: (step: number) => boolean
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined)

export function EnrollmentProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student>(initialStudent)
  const [currentStep, setCurrentStep] = useState(1)

  const updateStudent = (updates: Partial<Student>) => {
    setStudent((prev) => ({ ...prev, ...updates }))
  }

  const resetForm = () => {
    setStudent(initialStudent)
    setCurrentStep(1)
  }

  const completeStep = (step: number): boolean => {
    const validations: Record<number, boolean> = {
      1: validateStep1(),
      2: validateStep2(),
      3: validateStep3(),
      4: validateStep4(),
      5: validateStep5(),
    }
    return validations[step] ?? false
  }

  const validateStep1 = (): boolean => {
    return !!(
      student.familyName &&
      student.givenNames &&
      student.dateOfBirth &&
      student.nationality &&
      student.gender &&
      student.firstLanguageSpoken &&
      student.levelOfEnglishSpoken &&
      student.enrollmentYear &&
      student.anticipatedGradeOfEntry
    )
  }

  const validateStep2 = (): boolean => {
    return !!(
      student.parentGuardian1Name &&
      student.parentGuardian1Email &&
      student.parentGuardian1Phone &&
      student.parentGuardian1Relationship
    )
  }

  const validateStep3 = (): boolean => {
    return !!(
      student.emergencyContactName &&
      student.emergencyContactPhone &&
      student.emergencyContactRelationship
    )
  }

  const validateStep4 = (): boolean => {
    return true // Educational background is optional
  }

  const validateStep5 = (): boolean => {
    return !!(
      student.agreeToTerms &&
      student.agreeToPrivacyPolicy &&
      student.agreeToDataProcessing
    )
  }

  const getStepValidation = (step: number): boolean => {
    return completeStep(step)
  }

  return (
    <EnrollmentContext.Provider
      value={{
        student,
        updateStudent,
        currentStep,
        setCurrentStep,
        resetForm,
        completeStep,
        getStepValidation,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  )
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext)
  if (!context) {
    throw new Error('useEnrollment must be used within EnrollmentProvider')
  }
  return context
}
