"use client"

import { useRef, useState } from "react"
import { Camera, Upload, X, User, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface PhotoUploadProps {
  value:    string | null
  onChange: (url: string | null) => void
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    
    // Format file size
    const size = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(0)} KB`
    
    setFileInfo({ name: file.name, size })

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) onChange(e.target.result as string)
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

  const removePhoto = () => {
    onChange(null)
    setFileInfo(null)
  }

  return (
    <div className="w-full">
      <div 
        className={cn(
          "relative group overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-500 p-8 flex flex-col items-center justify-center gap-6",
          isDragging ? "border-gold bg-gold/5 scale-[1.02]" : "border-border-mid bg-white hover:border-gold/30 hover:bg-cream/20",
          value ? "border-solid border-gold/20" : ""
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
            {/* Preview Circle */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-premium group-hover:scale-105 transition-transform duration-500">
              <Image src={value} alt="Student photo" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Upload className="text-white w-8 h-8" />
              </div>
            </div>

            {/* File Details */}
            <div className="text-center">
              <p className="text-sm font-bold text-navy">Photo Selected</p>
              {fileInfo && (
                <p className="text-xs text-text-muted mt-1">{fileInfo.name} • {fileInfo.size}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="btn-gold h-10 px-6 text-xs flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                Replace
              </button>
              <button
                type="button"
                onClick={removePhoto}
                className="btn-ghost h-10 px-6 text-xs flex items-center gap-2 text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/40"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-5 max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Camera className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-navy">Upload Student Photo</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Drag and drop your image here, or click to browse.<br />
                Recent passport-style photo, JPG or PNG (Max 5MB).
              </p>
            </div>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-gold h-11 px-8 text-sm"
            >
              Browse Files
            </button>
          </div>
        )}

        {/* Floating background icon */}
        {!value && (
          <User className="absolute -bottom-6 -right-6 w-32 h-32 text-navy/[0.03] -rotate-12" />
        )}
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
