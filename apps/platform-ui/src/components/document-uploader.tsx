"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface DocumentUploaderProps {
  onFileUpload: (files: FileList | null) => void
}

export default function DocumentUploader({ onFileUpload }: DocumentUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files)
    }
  }

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-md p-4 text-center ${
        dragActive ? "border-primary bg-primary/10" : "border-gray-300"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleChange} />

      <div className="flex flex-col items-center justify-center space-y-2">
        <Upload className="h-6 w-6 text-gray-500" />
        <p className="text-sm text-gray-500">Drag & drop your document here or</p>
        <Button type="button" variant="outline" size="sm" onClick={onButtonClick}>
          Browse files
        </Button>
        <p className="text-xs text-gray-400">Supports PDF (DOCX & TXT files coming soon)</p>
      </div>
    </div>
  )
}
