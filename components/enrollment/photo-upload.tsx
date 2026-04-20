"use client"

import { useRef, useState } from "react"
import { Camera, Upload, X, User, CheckCircle2 } from "lucide-react"
import Image from "next/image"

interface PhotoUploadProps {
  value:    string | null
  onChange: (url: string | null) => void
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
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

  return (
    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">

      {/* ── Photo drop zone ── */}
      <div
        className={`photo-zone ${isDragging ? "drag" : ""} ${value ? "filled" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !value && inputRef.current?.click()}
        style={{ position: "relative" }}
      >
        {value ? (
          <>
            <Image src={value} alt="Student photo" fill className="object-cover" />
            {/* Overlay checkmark */}
            <div
              className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/45 to-transparent p-1.5"
            >
              <CheckCircle2 className="w-5 h-5" style={{ color: "var(--gold)" }} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-3 text-center select-none pointer-events-none">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "rgba(200,162,77,.1)", border: "1.5px dashed var(--gold)" }}
            >
              <User className="w-5 h-5" style={{ color: "var(--gold)" }} />
            </div>
            <span className="text-[11px] font-medium leading-tight" style={{ color: "var(--text-muted)" }}>
              Passport<br />Photo
            </span>
          </div>
        )}
      </div>

      {/* ── Action area ── */}
      <div className="flex w-full flex-col gap-2.5 sm:w-auto">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {value ? "Photo uploaded" : "Upload passport photo"}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Recent, clear passport-size photo.<br />
            JPG or PNG · max 5 MB
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn-gold w-full justify-center px-3.5 py-2 text-xs sm:w-auto"
          >
            <Upload className="w-3.5 h-3.5" />
            {value ? "Change Photo" : "Upload Photo"}
          </button>

          <button
            type="button"
            className="btn-ghost w-full justify-center px-3.5 py-2 text-xs sm:w-auto"
          >
            <Camera className="w-3.5 h-3.5" />
            Use Camera
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="btn-ghost w-full justify-center px-3.5 py-2 text-xs sm:w-auto"
              style={{ color: "var(--destructive-color)", borderColor: "rgba(220,38,38,.25)" }}
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          )}
        </div>

        {/* Drag hint */}
        {!value && (
          <p className="text-[11px]" style={{ color: "rgba(138,138,154,.7)" }}>
            Or drag & drop onto the box
          </p>
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
