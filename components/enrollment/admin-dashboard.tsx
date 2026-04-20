"use client"

import { useState } from "react"
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Eye,
  Download,
  TrendingUp,
  Calendar,
  GraduationCap,
  ChevronDown,
  X,
} from "lucide-react"
import type { EnrollmentFormData } from "@/lib/enrollment-types"

interface Application {
  id: string
  referenceNumber: string
  submittedAt: string
  status: "pending" | "reviewing" | "accepted" | "rejected"
  formData: EnrollmentFormData
}

function generateDemoApplications(): Application[] {
  const statuses: Application["status"][] = ["pending", "reviewing", "accepted", "accepted", "rejected"]
  const names = [
    { given: "Layla", family: "Al-Rashidi", grade: "Grade 3 (Age 8)", year: "2025–2026", nationality: "Omani" },
    { given: "Omar", family: "Hassan", grade: "Kindergarten 2 (Age 5)", year: "2025–2026", nationality: "Omani" },
    { given: "Sara", family: "Mitchell", grade: "Grade 1 (Age 6)", year: "2026–2027", nationality: "British" },
    { given: "Ahmad", family: "Al-Balushi", grade: "Pre-K (Age 3)", year: "2025–2026", nationality: "Omani" },
    { given: "Emma", family: "Johnson", grade: "Grade 5 (Age 10)", year: "2026–2027", nationality: "American" },
    { given: "Khalid", family: "Al-Zaabi", grade: "Grade 2 (Age 7)", year: "2025–2026", nationality: "Omani" },
  ]

  return names.map((n, i) => ({
    id: `app-${i + 1}`,
    referenceNumber: `SHM-2025-${String(1000 + i + 1)}`,
    submittedAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    status: statuses[i % statuses.length],
    formData: {
      studentData: {
        photoUrl: null,
        familyName: n.family,
        givenNames: n.given,
        middleName: "",
        toBeKnownAs: n.given,
        dateOfBirth: "",
        nationality: n.nationality,
        omanResidentCardNumber: "",
        gender: i % 2 === 0 ? "Female" : "Male",
        firstLanguageSpoken: n.nationality === "Omani" ? "Arabic" : "English",
        otherLanguageSpoken: "",
        levelOfEnglishSpoken: "Fluent",
        enrollmentYear: n.year,
        anticipatedGradeOfEntry: n.grade,
        siblings: [],
      },
      familyData: {
        parents: [
          {
            id: "1",
            relationship: "Father",
            title: "Mr.",
            familyName: n.family,
            givenNames: "Mohammed",
            nationality: n.nationality,
            occupation: "Engineer",
            employer: "PDO",
            mobilePhone: "+968 9100 0000",
            homePhone: "",
            workPhone: "",
            email: `parent@${n.family.toLowerCase()}.com`,
            residentialAddress: "Muscat, Oman",
            postalAddress: "",
            isEmergencyContact: true,
            authorizedToPickup: true,
          },
        ],
        maritalStatus: "Married",
        custodyArrangement: "",
        languageSpokenAtHome: n.nationality === "Omani" ? "Arabic" : "English",
      },
      emergencyData: {
        emergencyContacts: [
          {
            id: "1",
            name: "Mohammed " + n.family,
            relationship: "Father",
            mobilePhone: "+968 9100 0000",
            homePhone: "",
            workPhone: "",
            email: `parent@${n.family.toLowerCase()}.com`,
            authorizedToPickup: true,
          },
        ],
        doctorName: "Dr. Al-Siyabi",
        doctorPhone: "+968 2400 0000",
        hospitalPreference: "Royal Hospital",
        medicalConditions: "None",
        allergies: "None",
        medications: "None",
        additionalMedicalInfo: "",
      },
      educationalBackground: {
        previousSchools: [],
        hasLearningDifficulties: false,
        learningDifficultiesDetails: "",
        hasReceivedSpecialSupport: false,
        specialSupportDetails: "",
        additionalInfo: "",
      },
      conditionsWaiver: {
        agreeToTerms: true,
        agreeToPhotoPolicy: true,
        agreeToMedicalPolicy: true,
        agreeToCodeOfConduct: true,
        parentSignatureName: "Mohammed " + n.family,
        signatureDate: new Date().toISOString().split("T")[0],
        declarationAccepted: true,
      },
    },
  }))
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  reviewing: {
    label: "Under Review",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
  },
  accepted: {
    label: "Accepted",
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-400",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-400",
  },
}

interface ApplicationDetailProps {
  application: Application
  onClose: () => void
  onStatusChange: (id: string, status: Application["status"]) => void
}

function ApplicationDetail({ application, onClose, onStatusChange }: ApplicationDetailProps) {
  const { formData, referenceNumber, submittedAt, status } = application
  const { studentData, familyData, emergencyData, educationalBackground } = formData
  const cfg = STATUS_CONFIG[status]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl h-full bg-card border-l border-border shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground font-serif">
              {studentData.givenNames} {studentData.familyName}
            </h3>
            <p className="text-xs text-muted-foreground">{referenceNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-xs font-medium border ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-none ${cfg.dot}`} />
              {cfg.label}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-none hover:bg-muted transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Controls */}
          <div className="flex flex-wrap gap-2">
            {(["pending", "reviewing", "accepted", "rejected"] as Application["status"][]).map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(application.id, s)}
                className={`px-3 py-1.5 rounded-none text-xs font-semibold border transition-all ${
                  status === s
                    ? STATUS_CONFIG[s].color
                    : "bg-background border-border text-muted-foreground hover:border-foreground/30"
                }`}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>

          {/* Student Details */}
          <section>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Student</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Name", `${studentData.givenNames} ${studentData.familyName}`],
                ["Known As", studentData.toBeKnownAs],
                ["Gender", studentData.gender],
                ["Nationality", studentData.nationality],
                ["DOB", studentData.dateOfBirth || "—"],
                ["Language", studentData.firstLanguageSpoken],
                ["English Level", studentData.levelOfEnglishSpoken],
                ["Grade", studentData.anticipatedGradeOfEntry],
                ["Enrollment Year", studentData.enrollmentYear],
              ].map(([label, value]) => (
                <div key={label} className="bg-muted/30 rounded-none px-3 py-2">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{value || "—"}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Family */}
          <section>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Family</h4>
            <div className="space-y-3">
              {familyData.parents.map((parent) => (
                <div key={parent.id} className="bg-muted/30 rounded-none px-3 py-2">
                  <p className="text-sm font-medium">{parent.givenNames} {parent.familyName}</p>
                  <p className="text-xs text-muted-foreground">{parent.relationship} · {parent.email} · {parent.mobilePhone}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Medical */}
          <section>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Medical</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Doctor", emergencyData.doctorName],
                ["Doctor Phone", emergencyData.doctorPhone],
                ["Hospital", emergencyData.hospitalPreference],
                ["Conditions", emergencyData.medicalConditions],
                ["Allergies", emergencyData.allergies],
                ["Medications", emergencyData.medications],
              ].map(([label, value]) => (
                <div key={label} className="bg-muted/30 rounded-none px-3 py-2">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{value || "—"}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Educational */}
          <section>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Education</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 rounded-none px-3 py-2">
                <p className="text-xs text-muted-foreground">Previous Schools</p>
                <p className="text-sm font-medium mt-0.5">
                  {educationalBackground.previousSchools.length > 0
                    ? educationalBackground.previousSchools.map((s) => s.schoolName).join(", ")
                    : "None listed"}
                </p>
              </div>
              <div className="bg-muted/30 rounded-none px-3 py-2">
                <p className="text-xs text-muted-foreground">Learning Difficulties</p>
                <p className="text-sm font-medium mt-0.5">
                  {educationalBackground.hasLearningDifficulties ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>(generateDemoApplications)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | Application["status"]>("all")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  }

  const filtered = applications.filter((app) => {
    const name = `${app.formData.studentData.givenNames} ${app.formData.studentData.familyName}`.toLowerCase()
    const matchesSearch = search === "" || name.includes(search.toLowerCase()) || app.referenceNumber.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (id: string, status: Application["status"]) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    setSelectedApp((prev) => (prev?.id === id ? { ...prev, status } : prev))
  }

  const statCards = [
    { label: "Total Applications", value: stats.total, icon: <Users className="w-5 h-5" />, color: "text-[#C9A84C] bg-[#C9A84C]/10" },
    { label: "Pending Review", value: stats.pending + stats.reviewing, icon: <Clock className="w-5 h-5" />, color: "text-amber-600 bg-amber-50" },
    { label: "Accepted", value: stats.accepted, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-green-600 bg-green-50" },
    { label: "Rejected", value: stats.rejected, icon: <XCircle className="w-5 h-5" />, color: "text-red-500 bg-red-50" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-[#1E1E2E] border-b border-[#2D2D3F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-[#C9A84C]/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-xs text-[#C9A84C] font-semibold tracking-wider uppercase">Shomoukh</p>
              <h1 className="text-white font-semibold text-sm">Admissions Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#C9A84C] border border-[#C9A84C]/30 rounded-none hover:bg-[#C9A84C]/10 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <div className="w-8 h-8 rounded-none bg-[#C9A84C] flex items-center justify-center">
              <span className="text-xs font-bold text-[#1E1E2E]">AD</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-card border border-border/60 rounded-none p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                <div className={`w-9 h-9 rounded-none flex items-center justify-center ${card.color}`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or reference number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-sm bg-background border border-border/80 rounded-none focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "reviewing", "accepted", "rejected"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-none text-xs font-semibold border transition-all capitalize ${
                  statusFilter === s
                    ? "bg-[#C9A84C] border-[#C9A84C] text-[#1E1E2E]"
                    : "bg-background border-border/80 text-muted-foreground hover:border-[#C9A84C]/50"
                }`}
              >
                {s === "all" ? "All" : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-card border border-border/60 rounded-none overflow-hidden">
          <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Applications ({filtered.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b border-border/40">
                  {["Reference", "Student Name", "Grade", "Year", "Nationality", "Submitted", "Status", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map((app) => {
                  const cfg = STATUS_CONFIG[app.status]
                  const { studentData } = app.formData
                  return (
                    <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {app.referenceNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-none bg-[#C9A84C]/15 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-[#A07830]">
                              {studentData.givenNames[0]}{studentData.familyName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                              {studentData.givenNames} {studentData.familyName}
                            </p>
                            <p className="text-xs text-muted-foreground">{studentData.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {studentData.anticipatedGradeOfEntry}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {studentData.enrollmentYear}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {studentData.nationality}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(app.submittedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-xs font-medium border whitespace-nowrap ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-none ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="flex items-center gap-1.5 text-xs font-medium text-[#A07830] hover:text-[#C9A84C] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No applications match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Application Detail Drawer */}
      {selectedApp && (
        <ApplicationDetail
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
