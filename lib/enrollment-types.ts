export interface Sibling {
  id: string
  familyName: string
  givenNames: string
  age: string
}

export interface StudentData {
  photoUrl: string | null
  familyName: string
  givenNames: string
  middleName: string
  toBeKnownAs: string
  dateOfBirth: string
  nationality: string
  omanResidentCardNumber: string
  gender: 'Male' | 'Female' | ''
  firstLanguageSpoken: string
  otherLanguageSpoken: string
  levelOfEnglishSpoken: string
  enrollmentYear: string
  anticipatedGradeOfEntry: string
  siblings: Sibling[]
}

export interface ParentGuardian {
  id: string
  relationship: string
  title: string
  familyName: string
  givenNames: string
  nationality: string
  occupation: string
  employer: string
  mobilePhone: string
  homePhone: string
  workPhone: string
  email: string
  residentialAddress: string
  postalAddress: string
  isEmergencyContact: boolean
  authorizedToPickup: boolean
}

export interface FamilyData {
  parents: ParentGuardian[]
  maritalStatus: string
  custodyArrangement: string
  languageSpokenAtHome: string
}

export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  mobilePhone: string
  homePhone: string
  workPhone: string
  email: string
  authorizedToPickup: boolean
}

export interface EmergencyData {
  emergencyContacts: EmergencyContact[]
  doctorName: string
  doctorPhone: string
  hospitalPreference: string
  medicalConditions: string
  allergies: string
  medications: string
  additionalMedicalInfo: string
}

export interface PreviousSchool {
  id: string
  schoolName: string
  country: string
  city: string
  fromYear: string
  toYear: string
  gradeAttended: string
  reasonForLeaving: string
}

export interface EducationalBackground {
  previousSchools: PreviousSchool[]
  hasLearningDifficulties: boolean | null
  learningDifficultiesDetails: string
  hasReceivedSpecialSupport: boolean | null
  specialSupportDetails: string
  additionalInfo: string
}

export interface ConditionsWaiver {
  agreeToTerms: boolean
  agreeToPhotoPolicy: boolean
  agreeToMedicalPolicy: boolean
  agreeToCodeOfConduct: boolean
  parentSignatureName: string
  signatureDate: string
  declarationAccepted: boolean
}

export interface EnrollmentFormData {
  studentData: StudentData
  familyData: FamilyData
  emergencyData: EmergencyData
  educationalBackground: EducationalBackground
  conditionsWaiver: ConditionsWaiver
}

export const NATIONALITIES = [
  'Omani', 'British', 'American', 'Canadian', 'Australian', 'Indian',
  'Pakistani', 'Bangladeshi', 'Filipino', 'Egyptian', 'Jordanian',
  'Lebanese', 'Syrian', 'Saudi Arabian', 'Emirati', 'Kuwaiti',
  'Bahraini', 'Qatari', 'Iranian', 'French', 'German', 'Italian',
  'Spanish', 'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish',
  'South African', 'Nigerian', 'Kenyan', 'Chinese', 'Japanese',
  'Korean', 'Malaysian', 'Indonesian', 'Thai', 'Vietnamese', 'Other',
]

export const LANGUAGES = [
  'Arabic', 'English', 'French', 'Hindi', 'Urdu', 'Tagalog',
  'Malay', 'Bengali', 'Tamil', 'Telugu', 'Persian', 'Turkish',
  'German', 'Spanish', 'Italian', 'Dutch', 'Portuguese', 'Russian',
  'Chinese (Mandarin)', 'Chinese (Cantonese)', 'Japanese', 'Korean', 'Other',
]

export const ENGLISH_LEVELS = [
  'Native Speaker',
  'Fluent',
  'Advanced',
  'Intermediate',
  'Basic',
  'No English',
]

export const ENROLLMENT_YEARS = [
  '2024–2025',
  '2025–2026',
  '2026–2027',
]

export const GRADE_OPTIONS = [
  'Pre-K (Age 3)',
  'Kindergarten 1 (Age 4)',
  'Kindergarten 2 (Age 5)',
  'Grade 1 (Age 6)',
  'Grade 2 (Age 7)',
  'Grade 3 (Age 8)',
  'Grade 4 (Age 9)',
  'Grade 5 (Age 10)',
  'Grade 6 (Age 11)',
  'Grade 7 (Age 12)',
  'Grade 8 (Age 13)',
  'Grade 9 (Age 14)',
  'Grade 10 (Age 15)',
  'Grade 11 (Age 16)',
  'Grade 12 (Age 17)',
]

export const RELATIONSHIPS = [
  'Mother', 'Father', 'Legal Guardian', 'Grandmother', 'Grandfather',
  'Uncle', 'Aunt', 'Step-Mother', 'Step-Father', 'Other',
]

export const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']

export const MARITAL_STATUSES = [
  'Married', 'Single', 'Divorced', 'Widowed', 'Separated', 'Other',
]

export const COUNTRIES = [
  'Oman', 'United Kingdom', 'United States', 'Canada', 'Australia',
  'India', 'Pakistan', 'Philippines', 'Egypt', 'Jordan', 'Lebanon',
  'Saudi Arabia', 'UAE', 'Kuwait', 'Bahrain', 'Qatar', 'France',
  'Germany', 'Other',
]

export const defaultStudentData: StudentData = {
  photoUrl: null,
  familyName: '',
  givenNames: '',
  middleName: '',
  toBeKnownAs: '',
  dateOfBirth: '',
  nationality: '',
  omanResidentCardNumber: '',
  gender: '',
  firstLanguageSpoken: '',
  otherLanguageSpoken: '',
  levelOfEnglishSpoken: '',
  enrollmentYear: '',
  anticipatedGradeOfEntry: '',
  siblings: [],
}

export const defaultFamilyData: FamilyData = {
  parents: [
    {
      id: '1',
      relationship: 'Father',
      title: '',
      familyName: '',
      givenNames: '',
      nationality: '',
      occupation: '',
      employer: '',
      mobilePhone: '',
      homePhone: '',
      workPhone: '',
      email: '',
      residentialAddress: '',
      postalAddress: '',
      isEmergencyContact: false,
      authorizedToPickup: true,
    },
    {
      id: '2',
      relationship: 'Mother',
      title: '',
      familyName: '',
      givenNames: '',
      nationality: '',
      occupation: '',
      employer: '',
      mobilePhone: '',
      homePhone: '',
      workPhone: '',
      email: '',
      residentialAddress: '',
      postalAddress: '',
      isEmergencyContact: false,
      authorizedToPickup: true,
    },
  ],
  maritalStatus: '',
  custodyArrangement: '',
  languageSpokenAtHome: '',
}

export const defaultEmergencyData: EmergencyData = {
  emergencyContacts: [
    {
      id: '1',
      name: '',
      relationship: '',
      mobilePhone: '',
      homePhone: '',
      workPhone: '',
      email: '',
      authorizedToPickup: false,
    },
  ],
  doctorName: '',
  doctorPhone: '',
  hospitalPreference: '',
  medicalConditions: '',
  allergies: '',
  medications: '',
  additionalMedicalInfo: '',
}

export const defaultEducationalBackground: EducationalBackground = {
  previousSchools: [],
  hasLearningDifficulties: null,
  learningDifficultiesDetails: '',
  hasReceivedSpecialSupport: null,
  specialSupportDetails: '',
  additionalInfo: '',
}

export const defaultConditionsWaiver: ConditionsWaiver = {
  agreeToTerms: false,
  agreeToPhotoPolicy: false,
  agreeToMedicalPolicy: false,
  agreeToCodeOfConduct: false,
  parentSignatureName: '',
  signatureDate: '',
  declarationAccepted: false,
}

export const defaultFormData: EnrollmentFormData = {
  studentData: defaultStudentData,
  familyData: defaultFamilyData,
  emergencyData: defaultEmergencyData,
  educationalBackground: defaultEducationalBackground,
  conditionsWaiver: defaultConditionsWaiver,
}
