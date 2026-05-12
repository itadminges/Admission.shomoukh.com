"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  FileText,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Download,
  MessageSquare,
  Lock,
  Send
} from "lucide-react"
import { format } from "date-fns"
import { LongFormReview } from "./long-form-review"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"list" | "detail">("list")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")

  const access = useQuery(api.profiles.getAccess)
  const applications = useQuery(api.applications.listForAdmin)
  const updateStatus = useMutation(api.applications.updateStatus)
  const addComment = useMutation(api.applications.addComment)

  const stats = {
    total: applications?.length || 0,
    pending: applications?.filter(a => a.status === "pending").length || 0,
    accepted: applications?.filter(a => a.status === "accepted").length || 0,
  }

  const filteredApps = applications?.filter(app => 
    app.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.formData?.studentData?.familyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.formData?.studentData?.givenNames?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentApp = applications?.find(a => a._id === selectedId)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-bold px-3 py-1 rounded-full border-none shadow-sm">Accepted</Badge>
      case "reviewing": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-bold px-3 py-1 rounded-full border-none shadow-sm">Reviewing</Badge>
      default: return <Badge variant="secondary" className="font-bold px-3 py-1 rounded-full border-none shadow-sm">Pending Review</Badge>
    }
  }

  const handleStatusChange = async (id: any, status: any) => {
    try {
      await updateStatus({ applicationId: id, status })
      toast.success(`Status updated to ${status}`)
    } catch (err) {
      toast.error("Failed to update status")
    }
  }

  const [commentContext, setCommentContext] = useState("General")
  const [isPrivate, setIsPrivate] = useState(true)

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !selectedId) return
    try {
      await addComment({ 
        applicationId: selectedId as any, 
        text: commentText,
        context: commentContext,
        isPrivate
      })
      setCommentText("")
      setCommentContext("General")
      toast.success(isPrivate ? "Internal note added" : "Message sent to parent")
    } catch (err) {
      toast.error("Failed to add note")
    }
  }

  const handleOpenApp = (id: string) => {
    setSelectedId(id)
    setView("detail")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBackToList = () => {
    setView("list")
    setSelectedId(null)
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-navy flex flex-col sticky top-0 h-screen shrink-0 overflow-hidden shadow-2xl z-40">
        <div className="p-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-navy shadow-lg shadow-gold/20">
              <LayoutDashboard size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-white font-serif font-bold text-lg leading-tight">Admin</h1>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Admissions</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <button 
            onClick={handleBackToList}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              view === "list" ? "bg-white/10 text-white shadow-inner" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <Users size={18} className={view === "list" ? "text-gold" : ""} />
            Applications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all text-sm font-bold">
            <FileText size={18} />
            Reports
          </button>
        </nav>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={async () => { await signOut(); window.location.href = "/"; }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white transition-colors text-sm font-bold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {view === "list" ? (
          <>
            <header className="h-20 bg-white border-b border-border-soft px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name or reference..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-80 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2 rounded-xl border-slate-200">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-navy uppercase tracking-tight">{access?.viewer?.name || "Staff"}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{access?.role || "Administrator"}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-navy font-bold text-xs">
                  {access?.viewer?.name?.[0] || "S"}
                </div>
              </div>
            </header>

            <div className="p-8 max-w-[1600px] mx-auto w-full">
              {/* Stats Grid */}
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card className="rounded-3xl border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Total Applications</p>
                        <p className="text-3xl font-serif font-bold text-navy">{stats.total}</p>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                        <FileText size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Pending Review</p>
                        <p className="text-3xl font-serif font-bold text-amber-600">{stats.pending}</p>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                        <Clock size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-none shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">Accepted</p>
                        <p className="text-3xl font-serif font-bold text-green-600">{stats.accepted}</p>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                        <CheckCircle2 size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Applications Table */}
              <Card className="border-none shadow-premium overflow-hidden rounded-[2rem]">
                <CardHeader className="bg-white border-b px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-serif text-navy">Inbox</CardTitle>
                      <CardDescription className="text-sm">Manage student enrolment requests.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 rounded-xl border-slate-200 text-slate-600">
                      <Download className="h-4 w-4" /> Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="w-[180px] font-bold text-navy uppercase text-[10px] tracking-widest pl-8">Ref Number</TableHead>
                        <TableHead className="font-bold text-navy uppercase text-[10px] tracking-widest">Student Name</TableHead>
                        <TableHead className="font-bold text-navy uppercase text-[10px] tracking-widest">Submitted At</TableHead>
                        <TableHead className="font-bold text-navy uppercase text-[10px] tracking-widest">Status</TableHead>
                        <TableHead className="text-right font-bold text-navy uppercase text-[10px] tracking-widest pr-8">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApps?.map((app) => (
                        <TableRow key={app._id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                          <TableCell className="font-mono text-xs font-bold text-gold-dark pl-8">{app.referenceNumber}</TableCell>
                          <TableCell>
                            <div className="font-bold text-navy text-sm">
                              {app.formData?.studentData?.givenNames} {app.formData?.studentData?.familyName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                              {app.formData?.studentData?.anticipatedGradeOfEntry}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500 text-xs font-medium">
                            {format(app.submittedAt, "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell className="text-right pr-8">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleOpenApp(app._id)}
                                className="gap-2 text-navy hover:bg-navy/5 font-bold text-xs"
                              >
                                Open <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-xl">
                                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl p-2">
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(app._id, "reviewing")}
                                    className="rounded-lg text-xs font-bold gap-2"
                                  >
                                    <Clock className="w-3.5 h-3.5" /> Mark Reviewing
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusChange(app._id, "accepted")} 
                                    className="rounded-lg text-xs font-bold gap-2 text-green-600 hover:bg-green-50"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredApps?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-64 text-center">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                                <FileText size={32} />
                              </div>
                              <p className="text-sm font-bold text-slate-400 italic">No applications found.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </>
        ) : currentApp && (
          <div className="min-h-screen flex flex-col bg-slate-50/50">
            <header className="sticky top-0 z-30 bg-white border-b border-border-soft px-8 py-4 flex items-center justify-between shadow-sm h-20">
              <div className="flex items-center gap-6">
                <Button variant="ghost" size="sm" onClick={handleBackToList} className="gap-2 text-slate-500 hover:text-navy hover:bg-slate-100 rounded-xl px-4 font-bold uppercase text-[10px] tracking-widest">
                  <ChevronRight className="rotate-180 h-3 w-3" />
                  Back to List
                </Button>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <h2 className="text-xl font-serif font-bold text-navy leading-none">
                    {currentApp.formData?.studentData?.givenNames} {currentApp.formData?.studentData?.familyName}
                  </h2>
                  <p className="text-xs text-gold-dark font-mono font-bold tracking-tighter mt-1">{currentApp.referenceNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                  <button 
                    onClick={() => handleStatusChange(currentApp._id, "pending")}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all",
                      currentApp.status === "pending" ? "bg-amber-500 text-white shadow-xl shadow-amber-500/20" : "text-slate-500 hover:bg-white"
                    )}
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => handleStatusChange(currentApp._id, "reviewing")}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all",
                      currentApp.status === "reviewing" ? "bg-blue-500 text-white shadow-xl shadow-blue-500/20" : "text-slate-500 hover:bg-white"
                    )}
                  >
                    Reviewing
                  </button>
                  <button 
                    onClick={() => handleStatusChange(currentApp._id, "accepted")}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all",
                      currentApp.status === "accepted" ? "bg-green-600 text-white shadow-xl shadow-green-600/20" : "text-slate-500 hover:bg-white"
                    )}
                  >
                    Approve
                  </button>
                </div>
              </div>
            </header>

            <div className="flex-1 p-10 overflow-y-auto">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start pb-20">
                {/* Full Form Content */}
                <div className="bg-white rounded-[2.5rem] border border-border-soft shadow-premium overflow-hidden">
                  <LongFormReview formData={currentApp.formData} referenceNumber={currentApp.referenceNumber} />
                </div>

                {/* Sidebar with Actions and Comments */}
                <aside className="space-y-8 sticky top-28">
                  <Card className="border-none shadow-premium overflow-hidden rounded-[2.5rem] bg-white">
                    <CardHeader className="bg-navy text-white pb-8 px-10 pt-10">
                      <CardTitle className="text-lg flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl">
                          <MessageSquare className="w-5 h-5 text-gold" />
                        </div>
                        Staff Discussion
                      </CardTitle>
                      <CardDescription className="text-white/60">Internal collaboration and log.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="p-10 space-y-10">
                        {/* Comments List */}
                        <div className="space-y-6">
                          {currentApp.comments && currentApp.comments.length > 0 ? (
                            currentApp.comments.map((comment: any, i: number) => (
                              <div key={i} className={cn(
                                "flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2 duration-300",
                                !comment.isStaff && "flex-row-reverse"
                              )}>
                                <div className={cn(
                                  "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border text-navy font-black text-xs shadow-sm",
                                  comment.isStaff ? "bg-slate-100 border-slate-200" : "bg-gold/20 border-gold/30"
                                )}>
                                  {comment.author?.[0] || "S"}
                                </div>
                                <div className={cn(
                                  "flex-1 p-5 rounded-2xl border relative group shadow-sm",
                                  comment.isStaff 
                                    ? "bg-slate-50 border-slate-100" 
                                    : "bg-white border-gold/20 text-right"
                                )}>
                                  <div className={cn(
                                    "flex justify-between items-center mb-1.5",
                                    !comment.isStaff && "flex-row-reverse"
                                  )}>
                                    <span className={cn(
                                      "text-[10px] font-black uppercase tracking-widest",
                                      comment.isStaff ? "text-navy" : "text-gold-dark"
                                    )}>{comment.author}</span>
                                    {comment.context && (
                                      <span className="text-[9px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
                                        {comment.context}
                                      </span>
                                    )}
                                    {comment.isStaff && (
                                      <span className={cn(
                                        "text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest flex items-center gap-1",
                                        comment.isPrivate ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                                      )}>
                                        {comment.isPrivate ? (
                                          <><Lock size={8} /> Internal</>
                                        ) : (
                                          <><Eye size={8} /> Public</>
                                        )}
                                      </span>
                                    )}
                                    <span className="text-[9px] text-slate-400 font-bold uppercase">{format(comment.timestamp, "MMM d, HH:mm")}</span>
                                  </div>
                                  <p className={cn(
                                    "text-sm leading-relaxed font-medium",
                                    comment.isStaff ? "text-slate-600 italic" : "text-navy"
                                  )}>
                                    {comment.isStaff ? `"${comment.text}"` : comment.text}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-10 opacity-40">
                              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                              <p className="text-xs text-slate-400 font-black uppercase tracking-widest">No internal notes</p>
                            </div>
                          )}
                        </div>

                        {/* Add Comment Form */}
                        <form onSubmit={handleAddComment} className="pt-10 border-t border-slate-100">
                          <div className="space-y-5">
                            <div className="flex flex-wrap gap-4 items-center">
                              <div className="flex gap-2 items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tag Section:</span>
                                <select 
                                  value={commentContext}
                                  onChange={(e) => setCommentContext(e.target.value)}
                                  className="text-[10px] font-bold bg-slate-100 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-gold/20 outline-none cursor-pointer"
                                >
                                  <option value="General">General Note</option>
                                  <option value="Student Photo">Student Photo</option>
                                  <option value="Student Data">Student Data</option>
                                  <option value="Family Data">Family Data</option>
                                  <option value="Medical">Medical / Emergency</option>
                                  <option value="Education">Education History</option>
                                  <option value="Documents">Attached Documents</option>
                                </select>
                              </div>

                              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                                <button
                                  type="button"
                                  onClick={() => setIsPrivate(true)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all",
                                    isPrivate ? "bg-white text-navy shadow-sm" : "text-slate-400 hover:text-slate-600"
                                  )}
                                >
                                  <Lock size={10} /> Internal Note
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsPrivate(false)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all",
                                    !isPrivate ? "bg-navy text-white shadow-sm" : "text-slate-400 hover:text-slate-600"
                                  )}
                                >
                                  <Send size={10} /> Send to Parent
                                </button>
                              </div>
                            </div>
                            <textarea
                              placeholder={isPrivate ? "Add a private staff note..." : "Send a message to the parent..."}
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className={cn(
                                "w-full min-h-[140px] p-5 text-sm font-medium rounded-[1.5rem] border transition-all resize-none shadow-inner leading-relaxed",
                                isPrivate ? "bg-slate-50 border-slate-200 focus:ring-4 focus:ring-gold/10 focus:border-gold" : "bg-white border-navy/20 focus:ring-4 focus:ring-navy/5 focus:border-navy"
                              )}
                            />
                            <Button 
                              type="submit" 
                              disabled={!commentText.trim()}
                              className={cn(
                                "w-full rounded-[1.5rem] text-[10px] uppercase tracking-widest font-black h-14 shadow-2xl transition-all active:scale-95 flex gap-3",
                                isPrivate ? "bg-navy hover:bg-navy/90 text-white shadow-navy/20" : "bg-gold hover:bg-gold-dark text-navy shadow-gold/20"
                              )}
                            >
                              {isPrivate ? "Post Internal Note" : "Send Message to Parent"}
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </form>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="p-10 rounded-[2.5rem] bg-white border border-border-soft space-y-8 shadow-premium group">
                    <h4 className="text-[10px] font-black text-gold-dark uppercase tracking-[0.3em] flex items-center gap-3">
                      <Download size={18} className="text-gold" />
                      Documents
                    </h4>
                    <div className="grid gap-3">
                      <Button variant="outline" className="w-full justify-between gap-3 text-[10px] uppercase tracking-widest bg-slate-50 border-none text-navy font-black h-14 rounded-2xl hover:bg-gold hover:text-navy hover:shadow-xl hover:shadow-gold/20 transition-all group/btn">
                        Print Application
                        <FileText className="w-4 h-4 opacity-40 group-hover/btn:opacity-100" />
                      </Button>
                      <Button variant="outline" className="w-full justify-between gap-3 text-[10px] uppercase tracking-widest bg-slate-50 border-none text-navy font-black h-14 rounded-2xl hover:bg-gold hover:text-navy hover:shadow-xl hover:shadow-gold/20 transition-all group/btn">
                        Save as Archive
                        <Download className="w-4 h-4 opacity-40 group-hover/btn:opacity-100" />
                      </Button>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
