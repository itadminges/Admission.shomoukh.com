"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { format } from "date-fns"
import { MessageSquare, Send, CheckCircle2, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LongFormReview } from "./long-form-review"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Id } from "@/convex/_generated/dataModel"

interface ApplicationViewProps {
  applicationId: Id<"applications">
}

export function ApplicationView({ applicationId }: ApplicationViewProps) {
  const application = useQuery(api.applications.get, { id: applicationId })
  const addComment = useMutation(api.applications.addComment)
  
  const [message, setMessage] = useState("")
  const [messageContext, setMessageContext] = useState("General")
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !application) return
    
    setIsSending(true)
    try {
      await addComment({ 
        applicationId: application._id, 
        text: message,
        context: messageContext
      })
      setMessage("")
      setMessageContext("General")
      toast.success("Message sent to admissions office")
    } catch (err) {
      toast.error("Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  if (application === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold" />
      </div>
    )
  }

  if (!application) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-navy mb-2">Application Not Found</h2>
        <p className="text-slate-500">The application you are looking for does not exist or you don't have access.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden bg-white rounded-[2rem] border border-slate-200 shadow-xl min-h-[80vh]">
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12 border-r border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-8 border-b border-slate-50">
          <div>
            <h2 className="text-3xl font-serif font-bold text-navy">
              {application.formData?.studentData?.givenNames}'s Application
            </h2>
            <p className="text-gold-dark font-bold mt-1 tracking-wide uppercase text-sm">
              Reference: {application.referenceNumber}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
              {application.status === "accepted" ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-bold border-none px-4 py-1.5 rounded-lg">
                  <CheckCircle2 size={14} className="mr-1.5" /> Accepted
                </Badge>
              ) : application.status === "reviewing" ? (
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 font-bold border-none px-4 py-1.5 rounded-lg">
                  <Clock size={14} className="mr-1.5" /> Reviewing
                </Badge>
              ) : (
                <Badge variant="secondary" className="font-bold border-none px-4 py-1.5 rounded-lg">
                  <Clock size={14} className="mr-1.5" /> Pending
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <LongFormReview formData={application.formData} referenceNumber={application.referenceNumber} />
      </div>

      {/* Messaging Sidebar */}
      <aside className="w-full lg:w-[400px] flex flex-col bg-slate-50/50 border-t lg:border-t-0">
        <div className="p-8 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-navy text-lg">Communication</h3>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-8">
          <div className="space-y-6">
            {application.comments?.filter((c: any) => !c.isPrivate).map((comment: any, i: number) => (
              <div key={i} className={cn(
                "flex flex-col gap-1.5 max-w-[90%]",
                comment.isStaff ? "self-start" : "self-end items-end ml-auto text-right"
              )}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {comment.author}
                  </span>
                  {comment.context && (
                    <span className="text-[8px] bg-white text-slate-400 px-2 py-0.5 rounded-full border border-slate-100 font-bold uppercase tracking-widest">
                      {comment.context}
                    </span>
                  )}
                </div>
                <div className={cn(
                  "p-5 rounded-3xl text-sm leading-relaxed shadow-sm",
                  comment.isStaff 
                    ? "bg-white text-slate-700 rounded-tl-none border border-slate-100" 
                    : "bg-navy text-white rounded-tr-none shadow-navy/10"
                )}>
                  {comment.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 font-medium">
                  {format(comment.timestamp, "MMM d, HH:mm")}
                </span>
              </div>
            ))}
            {(!application.comments || application.comments.filter((c: any) => !c.isPrivate).length === 0) && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                  <MessageSquare className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No messages yet</p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Start a conversation with admissions</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-8 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Topic:</span>
              <select 
                value={messageContext}
                onChange={(e) => setMessageContext(e.target.value)}
                className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-4 focus:ring-gold/10 outline-none cursor-pointer hover:border-gold/50 transition-all shadow-sm"
              >
                <option value="General">General Inquiry</option>
                <option value="Student Data">Correction in Data</option>
                <option value="Medical">Medical / Emergency</option>
                <option value="Documents">Document Uploads</option>
              </select>
            </div>
            <div className="relative">
              <textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[120px] p-5 text-sm rounded-[1.5rem] border border-slate-200 focus:ring-8 focus:ring-gold/5 focus:border-gold transition-all resize-none pr-14 shadow-inner bg-white"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!message.trim() || isSending}
                className="absolute bottom-4 right-4 h-10 w-10 bg-gold hover:bg-gold-dark text-navy rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Send size={18} />
              </Button>
            </div>
          </form>
          <p className="text-[10px] text-slate-400 mt-4 text-center font-bold uppercase tracking-tight">
            Average response time: 24-48 hours
          </p>
        </div>
      </aside>
    </div>
  )
}
