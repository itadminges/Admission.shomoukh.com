"use client"

import { useRef, useState } from "react"
import { Camera, Upload, User, Trash2, Info } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Loader2 } from "lucide-react"

interface PhotoUploadProps {
  value: string | null
  onChange: (url: string | null) => void
}

export function PhotoUpload({ value, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  
  // If the value starts with "storage:", it's a storage ID, we need to get the URL
  const isStorageId = value?.startsWith("storage:")
  const storageId = isStorageId ? value.replace("storage:", "") : null
  const dbUrl = useQuery(api.files.getUrl, storageId ? { storageId } : "skip")
  
  const displayUrl = isStorageId ? dbUrl : value

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return

    setIsUploading(true)
    try {
      // 1. Get upload URL
      const postUrl = await generateUploadUrl()

      // 2. Upload the file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      
      const { storageId } = await result.json()
      
      // 3. Save the storage ID with a prefix so we know it's a storage ID
      onChange(`storage:${storageId}`)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
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
    // reset input value so selecting the same file again triggers onChange
    if (e.target) {
      e.target.value = ''
    }
  }

  const removePhoto = () => {
    onChange(null)
  }

  return (
    <div className="w-full flex flex-col gap-5 mt-2">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* The Frame */}
        <div
          className={cn(
            "relative shrink-0 w-32 h-36 rounded-md border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 overflow-hidden group cursor-pointer",
            isDragging ? "border-gold bg-gold/5 scale-[1.02]" : "border-[#e0ddcf] bg-[#F9F9F8] hover:border-gold/50",
            value ? "border-solid border-border-mid" : ""
          )}
          onClick={() => !value && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {displayUrl ? (
            <>
              <Image src={displayUrl} alt="Student photo" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removePhoto(); }}
                  className="p-2.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
              <span className="text-[10px] font-bold text-gold uppercase">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-md border-2 border-dashed border-[#d4ab53] flex items-center justify-center text-[#d4ab53]">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-text-secondary text-center leading-tight">
                Face<br/>photo
              </span>
            </div>
          )}
        </div>

        {/* The Details */}
        <div className="flex flex-col flex-1 pt-1">
          <h3 className="text-[15px] font-bold text-navy mb-1">Add a recent photo</h3>
          <p className="text-[13px] text-text-muted mb-1">
            Face forward, plain background — same idea as a passport shot.
          </p>
          <p className="text-[13px] text-text-muted mb-4">
            JPG or PNG · max 5 MB
          </p>
          
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
              className="h-10 px-5 rounded-md bg-[#c6a254] text-white text-[13px] font-medium flex items-center gap-2 hover:bg-[#b39045] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Browse files
            </button>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => cameraInputRef.current?.click()}
              className="h-10 px-5 rounded-md border border-border-mid bg-white text-navy text-[13px] font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              Use Camera
            </button>
          </div>
          
          <p className="text-[13px] text-text-muted/70">
            Or drop a file onto the frame
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-md border border-[#f2e6cc] bg-[#fbf9f4]">
        <Info className="w-4 h-4 text-[#c6a254] shrink-0" />
        <span className="text-[13px] text-text-secondary">
          JPG or PNG, up to 5 MB. Drag in or click to browse.
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/png"
        className="sr-only"
        onChange={handleChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg, image/png"
        capture="user"
        className="sr-only"
        onChange={handleChange}
      />
    </div>
  )
}
