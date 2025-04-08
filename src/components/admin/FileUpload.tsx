'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X } from 'lucide-react'
import { validateAndCategorizeFile } from '@/lib/fileValidation'
import { toast } from 'sonner'

interface FileMetadata {
  title: string
  description: string
}

interface FileUploadProps {
  onUploadSuccess?: () => void
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<FileMetadata>({
    title: '',
    description: ''
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      try {
        validateAndCategorizeFile(acceptedFiles[0])
        setSelectedFile(acceptedFiles[0])
        setMetadata(prev => ({
          ...prev,
          title: acceptedFiles[0].name.split('.')[0] // Set default title from filename
        }))
      } catch (error) {
        toast.error('Invalid file', {
          description: error instanceof Error ? error.message : "File validation failed",
          className: "bg-destructive text-destructive-foreground"
        })
      }
    }
  }, [])

  const handleUpload = async () => {
    if (!selectedFile || !metadata.title) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', metadata.title)
      formData.append('description', metadata.description)

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      toast.success('File uploaded successfully')
      onUploadSuccess?.() // Call the callback if provided

      // Reset form
      setSelectedFile(null)
      setMetadata({ title: '', description: '' })
    } catch (error) {
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : "Failed to upload file",
        className: "bg-destructive text-destructive-foreground"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative w-full h-32 rounded-lg border-2 border-dashed
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary hover:bg-primary/5'
          }
          cursor-pointer transition-all duration-200 ease-in-out
          group
          overflow-hidden
        `}
      >
        <input {...getInputProps()} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`
            flex flex-col items-center justify-center
            ${isDragActive ? 'scale-110' : 'group-hover:scale-105'}
            transition-transform duration-200 ease-in-out
          `}>
            <Upload className={`
              h-8 w-8 mb-2
              ${isDragActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}
              transition-colors duration-200
            `} />
            <p className={`
              text-sm
              ${isDragActive ? 'text-primary font-medium' : 'text-gray-600'}
              whitespace-nowrap
              transition-colors duration-200
            `}>
              {isDragActive ? 'Drop the file here' : 'Drag and drop a file here, or click to select'}
            </p>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <span className="text-sm truncate">{selectedFile.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={metadata.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setMetadata(prev => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter file title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={metadata.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                setMetadata(prev => ({ ...prev, description: e.target.value }))
              }
              placeholder="Enter file description"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={isUploading || !metadata.title}
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      )}
    </div>
  )
} 