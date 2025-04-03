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

export function FileUpload() {
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
          description: error instanceof Error ? error.message : "File validation failed"
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

      // Reset form
      setSelectedFile(null)
      setMetadata({ title: '', description: '' })
    } catch (error) {
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : "Failed to upload file"
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
          flex items-center justify-center w-full h-32 rounded-md border-2 border-dashed
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          cursor-pointer transition-colors
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="h-8 w-8 mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag and drop a file here, or click to select'}
          </p>
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