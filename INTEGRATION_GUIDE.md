# Backend Integration Guide

This guide shows how to integrate the Shomoukh enrollment system with a backend database and API.

## 📊 Database Schema

### Applications Table

```sql
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  application_id VARCHAR(255) UNIQUE NOT NULL,
  
  -- Student Information
  student_family_name VARCHAR(255) NOT NULL,
  student_given_names VARCHAR(255) NOT NULL,
  student_middle_name VARCHAR(255),
  student_known_as VARCHAR(255),
  student_date_of_birth DATE NOT NULL,
  student_nationality VARCHAR(255) NOT NULL,
  student_oman_resident_card VARCHAR(255),
  student_gender VARCHAR(50) NOT NULL,
  student_first_language VARCHAR(255) NOT NULL,
  student_other_language VARCHAR(255),
  student_english_level VARCHAR(255) NOT NULL,
  student_enrollment_year VARCHAR(4) NOT NULL,
  student_grade_entry VARCHAR(255) NOT NULL,
  
  -- Family Information
  parent1_name VARCHAR(255) NOT NULL,
  parent1_email VARCHAR(255) NOT NULL,
  parent1_phone VARCHAR(20) NOT NULL,
  parent1_relationship VARCHAR(255) NOT NULL,
  parent1_occupation VARCHAR(255),
  
  parent2_name VARCHAR(255),
  parent2_email VARCHAR(255),
  parent2_phone VARCHAR(20),
  parent2_relationship VARCHAR(255),
  parent2_occupation VARCHAR(255),
  
  family_address VARCHAR(255),
  family_city VARCHAR(255),
  family_country VARCHAR(255),
  
  -- Emergency Contact
  emergency_contact_name VARCHAR(255) NOT NULL,
  emergency_contact_phone VARCHAR(20) NOT NULL,
  emergency_contact_relationship VARCHAR(255) NOT NULL,
  emergency_contact_address VARCHAR(255),
  
  -- Educational Background
  previous_school_name VARCHAR(255),
  previous_school_country VARCHAR(255),
  years_attended VARCHAR(255),
  current_academic_level VARCHAR(255),
  additional_education_notes TEXT,
  
  -- Agreements
  agree_to_terms BOOLEAN NOT NULL DEFAULT FALSE,
  agree_to_privacy BOOLEAN NOT NULL DEFAULT FALSE,
  agree_to_data_processing BOOLEAN NOT NULL DEFAULT FALSE,
  additional_notes TEXT,
  
  -- Photo
  photo_url VARCHAR(255),
  
  -- Status & Metadata
  status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at),
  INDEX idx_parent1_email (parent1_email)
);
```

## 🔌 API Endpoints

### 1. Submit Application

**POST** `/api/applications/submit`

```typescript
// Request
{
  student: {
    familyName: "Al-Manouri",
    givenNames: "Ahmed",
    // ... all student data
  },
  // ... all form data
}

// Response
{
  success: true,
  applicationId: "APP-20240401001",
  message: "Application submitted successfully",
  data: {
    id: 123,
    applicationId: "APP-20240401001",
    status: "pending",
    submittedAt: "2024-04-01T10:30:00Z"
  }
}
```

### 2. Get Application Details

**GET** `/api/applications/[id]`

```typescript
// Response
{
  success: true,
  data: {
    id: 123,
    applicationId: "APP-20240401001",
    studentFamilyName: "Al-Manouri",
    // ... all application data
    status: "under-review",
    submittedAt: "2024-04-01T10:30:00Z"
  }
}
```

### 3. Get All Applications (Admin)

**GET** `/api/applications?status=pending&page=1&limit=10`

```typescript
// Response
{
  success: true,
  data: [
    {
      id: 123,
      applicationId: "APP-20240401001",
      studentFamilyName: "Al-Manouri",
      status: "pending",
      submittedAt: "2024-04-01T10:30:00Z"
    },
    // ... more applications
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 45
  }
}
```

### 4. Update Application Status (Admin)

**PUT** `/api/applications/[id]/status`

```typescript
// Request
{
  status: "accepted", // or "rejected", "under-review"
  notes: "Approved for enrollment"
}

// Response
{
  success: true,
  message: "Application status updated",
  data: {
    id: 123,
    status: "accepted",
    updatedAt: "2024-04-01T11:30:00Z"
  }
}
```

### 5. Upload Photo

**POST** `/api/applications/[id]/photo`

```typescript
// Request (FormData)
const formData = new FormData()
formData.append('photo', file)

// Response
{
  success: true,
  data: {
    photoUrl: "https://cdn.example.com/photos/APP-20240401001.jpg"
  }
}
```

## �� Context Integration Example

Update `app/enrollment/context.tsx` to use backend API:

```typescript
import { useCallback } from 'react'

// ... existing code ...

export function EnrollmentProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student>(initialStudent)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Submit application to backend
  const submitApplication = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      const data = await response.json()
      
      // Store application ID
      updateStudent({ id: data.data.applicationId })
      
      return data.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [student])

  // ... rest of context
}
```

## 📧 Email Notifications

### Send Confirmation Email

```typescript
// pages/api/emails/send-confirmation.ts
import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, applicationId, studentName } = req.body

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  try {
    await transporter.sendMail({
      from: 'enrollment@shomoukh.com',
      to: email,
      subject: `Enrollment Application Received - ${applicationId}`,
      html: `
        <h2>Welcome to Shomoukh Early Childhood Education</h2>
        <p>Dear Parent/Guardian,</p>
        <p>Thank you for submitting the enrollment application for <strong>${studentName}</strong>.</p>
        <p>Your application ID is: <strong>${applicationId}</strong></p>
        <p>Our admissions team will review your application and contact you within 5-7 business days.</p>
        <p>Best regards,<br/>Shomoukh Admissions Team</p>
      `,
    })

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

## 📦 Example: Using Supabase

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function submitApplicationToSupabase(student) {
  const { data, error } = await supabase
    .from('applications')
    .insert([
      {
        application_id: `APP-${Date.now().toString().slice(-8)}`,
        student_family_name: student.familyName,
        student_given_names: student.givenNames,
        // ... all fields
        status: 'pending',
      },
    ])
    .select()

  if (error) throw error
  return data[0]
}
```

## 🔐 Admin Authentication

Add authentication to admin dashboard:

```typescript
// app/admin/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Check if admin is authenticated (via session/cookie)
    const checkAuth = async () => {
      const response = await fetch('/api/auth/verify')
      if (!response.ok) {
        // Show login modal
        setAuthenticated(false)
      } else {
        setAuthenticated(true)
      }
    }
    checkAuth()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (response.ok) {
      setAuthenticated(true)
    }
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <form onSubmit={handleLogin} className="w-64 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            className="w-full px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gold text-charcoal rounded font-medium"
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  // Show admin dashboard
  return <AdminDashboardContent />
}
```

## 🗄️ Database Queries Example

```typescript
// lib/db.ts
import db from './database'

export async function getApplications(
  status?: string,
  page = 1,
  limit = 10
) {
  let query = db.from('applications')

  if (status) {
    query = query.eq('status', status)
  }

  const offset = (page - 1) * limit

  const { data, count } = await query
    .order('submitted_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return { data, total: count }
}

export async function updateApplicationStatus(id: number, status: string) {
  const { data, error } = await db
    .from('applications')
    .update({ status, updated_at: new Date() })
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}
```

## 📱 File Upload Example

```typescript
// app/api/applications/[id]/photo/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const formData = await request.formData()
  const file = formData.get('photo') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Save to public/uploads
  const path = join(process.cwd(), 'public/uploads', `${params.id}.jpg`)
  await writeFile(path, buffer)

  return NextResponse.json({
    success: true,
    photoUrl: `/uploads/${params.id}.jpg`,
  })
}
```

## 🚀 Deployment Checklist

- [ ] Set up database (PostgreSQL, MySQL, etc.)
- [ ] Create tables using schema above
- [ ] Set up API endpoints
- [ ] Configure environment variables
- [ ] Set up email service (SendGrid, Mailgun, etc.)
- [ ] Implement file storage (AWS S3, Cloudinary, etc.)
- [ ] Set up admin authentication
- [ ] Enable CORS if needed
- [ ] Add rate limiting to APIs
- [ ] Set up monitoring and logging
- [ ] Test all endpoints
- [ ] Set up backup strategy

## 🔒 Security Best Practices

```typescript
// Validate input on backend
function validateApplication(data: any) {
  if (!data.familyName || data.familyName.length > 255) {
    throw new Error('Invalid family name')
  }
  if (!isValidEmail(data.parentGuardian1Email)) {
    throw new Error('Invalid email')
  }
  // ... more validations
}

// Use parameterized queries
const { data } = await db
  .from('applications')
  .insert([{ ...sanitizedData }]) // Sanitize data first

// Rate limiting
import rateLimit from 'express-rate-limit'
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per window
})

app.post('/api/applications/submit', limiter, handler)
```

---

This guide provides a solid foundation for integrating your enrollment system with a backend. Customize based on your specific needs and tech stack.
