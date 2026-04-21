"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation, useQuery } from "convex/react"
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  Download,
  GraduationCap,
  X,
  LogOut,
} from "lucide-react"
import type { EnrollmentFormData } from "@/lib/enrollment-types"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { authClient } from "@/lib/auth-client"

interface Application {
  id: Id<"applications">
  referenceNumber: string
  submittedAt: string
  status: "pending" | "reviewing" | "accepted" | "rejected"
  formData: EnrollmentFormData
}

function mapDoc(doc: Doc<"applications">): Application {
  return {
    id: doc._id,
    referenceNumber: doc.referenceNumber,
    submittedAt: new Date(doc.submittedAt).toISOString(),
    status: doc.status,
    formData: doc.formData as EnrollmentFormData,
  }
}

const STATUS_CONFIG = {
  pending: {
    label: "New",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  reviewing: {
    label: "In review",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
  },
  accepted: {
    label: "Offer made",
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-400",
  },
  rejected: {
    label: "Closed",
    color: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-400",
  },
}

interface ApplicationDetailProps {
  application: Application
  onClose: () => void
  onStatusChange: (id: Application["id"], status: Application["status"]) => void | Promise<void>
}

function ApplicationDetail({ application, onClose, onStatusChange }: ApplicationDetailProps) {
  const { formData, referenceNumber, submittedAt, status } = application
  const { studentData, familyData, emergencyData, educationalBackground } = formData
  const cfg = STATUS_CONFIG[status]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-stretch sm:justify-end">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative flex h-[min(100dvh,100%)] max-h-[100dvh] w-full max-w-2xl flex-col overflow-y-auto overscroll-y-contain border-t border-border bg-card shadow-2xl sm:h-full sm:border-t-0 sm:border-l">
        {/* Header */}
        <div className="sticky top-0 z-10 flex shrink-0 items-start justify-between gap-3 border-b border-border bg-card px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
          <div className="min-w-0">
            <h3 className="font-serif text-base font-semibold leading-snug text-foreground sm:text-lg">
              {studentData.givenNames} {studentData.familyName}
            </h3>
            <p className="mt-0.5 break-all font-mono text-xs text-muted-foreground">{referenceNumber}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-md ${cfg.dot}`} />
              {cfg.label}
            </span>
            <button type="button" onClick={onClose} className="touch-manipulation rounded-md p-2 hover:bg-muted transition-colors" aria-label="Close details">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-6">
          {/* Status Controls */}
          <div className="flex flex-wrap gap-2">
            {(["pending", "reviewing", "accepted", "rejected"] as Application["status"][]).map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(application.id, s)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ["Name", `${studentData.givenNames} ${studentData.familyName}`],
                ["Known as", studentData.toBeKnownAs],
                ["Gender", studentData.gender],
                ["Nationality", studentData.nationality],
                ["DOB", studentData.dateOfBirth || "—"],
                ["Language", studentData.firstLanguageSpoken],
                ["English Level", studentData.levelOfEnglishSpoken],
                ["Class", studentData.anticipatedGradeOfEntry],
                ["School year", studentData.enrollmentYear],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-muted/30 px-3 py-2">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-0.5 break-words text-sm font-medium text-foreground">{value || "—"}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Family */}
          <section>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Family</h4>
            <div className="space-y-3">
              {familyData.parents.map((parent) => (
                <div key={parent.id} className="bg-muted/30 rounded-md px-3 py-2">
                  <p className="text-sm font-medium">{parent.givenNames} {parent.familyName}</p>
                  <p className="break-words text-xs text-muted-foreground">{parent.relationship} · {parent.email} · {parent.mobilePhone}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Medical */}
          <section>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Medical</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ["Doctor", emergencyData.doctorName],
                ["Doctor Phone", emergencyData.doctorPhone],
                ["Hospital", emergencyData.hospitalPreference],
                ["Conditions", emergencyData.medicalConditions],
                ["Allergies", emergencyData.allergies],
                ["Medications", emergencyData.medications],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-muted/30 px-3 py-2">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-0.5 break-words text-sm font-medium text-foreground">{value || "—"}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Educational */}
          <section>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Education</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-md bg-muted/30 px-3 py-2">
                <p className="text-xs text-muted-foreground">Previous Schools</p>
                <p className="mt-0.5 break-words text-sm font-medium">
                  {educationalBackground.previousSchools.length > 0
                    ? educationalBackground.previousSchools.map((s) => s.schoolName).join(", ")
                    : "—"}
                </p>
              </div>
              <div className="rounded-md bg-muted/30 px-3 py-2">
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
  const rawApps = useQuery(api.applications.listForAdmin)
  const updateStatusMutation = useMutation(api.applications.updateStatus)

  const applications = rawApps?.map(mapDoc) ?? []
  const listLoading = rawApps === undefined

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

  const handleStatusChange = async (id: Id<"applications">, status: Application["status"]) => {
    await updateStatusMutation({ applicationId: id, status })
    setSelectedApp((prev) => (prev?.id === id ? { ...prev, status } : prev))
  }

  const statCards = [
    { label: "In the queue", value: stats.total, icon: <Users className="w-5 h-5" />, color: "text-[#C9A84C] bg-[#C9A84C]/10" },
    { label: "Needs attention", value: stats.pending + stats.reviewing, icon: <Clock className="w-5 h-5" />, color: "text-amber-600 bg-amber-50" },
    { label: "Offers out", value: stats.accepted, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-green-600 bg-green-50" },
    { label: "Closed / declined", value: stats.rejected, icon: <XCircle className="w-5 h-5" />, color: "text-red-500 bg-red-50" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-[#1E1E2E] border-b border-[#2D2D3F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#C9A84C]/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-xs text-[#C9A84C] font-semibold tracking-wider uppercase">Shomoukh</p>
              <h1 className="text-white font-semibold text-sm">Applications</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden text-xs text-white/70 hover:text-white sm:inline"
            >
              Public form
            </Link>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#C9A84C] border border-[#C9A84C]/30 rounded-md hover:bg-[#C9A84C]/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => authClient.signOut()}
              className="flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-card border border-border/60 rounded-md p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                <div className={`w-9 h-9 rounded-md flex items-center justify-center ${card.color}`}>
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
              placeholder="Search name or SHM reference…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-sm bg-background border border-border/80 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "reviewing", "accepted", "rejected"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-md text-xs font-semibold border transition-all capitalize ${
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
        <div className="bg-card border border-border/60 rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Queue ({filtered.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b border-border/40">
                  {["Ref.", "Child", "Class", "Year", "Nationality", "Sent", "Status", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {listLoading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      Loading applications…
                    </td>
                  </tr>
                )}
                {!listLoading && filtered.map((app) => {
                  const cfg = STATUS_CONFIG[app.status]
                  const { studentData } = app.formData
                  return (
                    <tr key={app.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {app.referenceNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-[#C9A84C]/15 flex items-center justify-center shrink-0">
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
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border whitespace-nowrap ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-md ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="flex items-center gap-1.5 text-xs font-medium text-[#A07830] hover:text-[#C9A84C] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Open
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {!listLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      Nothing matches that search or filter.
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
