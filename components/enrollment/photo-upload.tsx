"use client"

import { useRef, useState } from "react"
import { Camera, Upload, X, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface PhotoUploadProps {
  value: string | null
  onChange: (url: string | null) => void
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        onChange(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-end gap-4">
        {/* Photo preview */}
        <div
          className={cn(
            "w-28 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all duration-200 cursor-pointer",
            isDragging
              ? "border-[#C9A84C] bg-[#C9A84C]/10"
              : value
              ? "border-[#C9A84C]/50 bg-transparent"
              : "border-border/80 bg-muted/30 hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5"
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !value && inputRef.current?.click()}
        >
          {value ? (
            <div className="relative w-full h-full">
              <Image src={value} alt="Student photo" fill className="object-cover" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-3 text-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground leading-tight">Passport photo</span>
            </div>
          )}
        </div>

        {/* Upload controls */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200",
              "border-[#C9A84C] text-[#A07830] hover:bg-[#C9A84C]/10"
            )}
          >
            <Upload className="w-4 h-4" />
            {value ? "Change Photo" : "Upload Photo"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/80 text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-all duration-200"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          )}
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/80 text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-all duration-200"
          >
            <Camera className="w-4 h-4" />
            Use Camera
          </button>
        </div>
      </div>

      <div className="flex items-start gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2 w-full max-w-xs">
        <span className="text-[#C9A84C] font-bold mt-0.5">i</span>
        <span>Please upload a recent passport-size photo (JPG, PNG). Max 5MB.</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  )
}
