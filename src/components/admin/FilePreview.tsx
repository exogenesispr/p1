'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { PreviewConfig } from '@/lib/previewHandler'

interface FilePreviewProps {
  file: {
    _id: string
    title: string
    category: string
    mimeType: string
    fileUrl: string
    preview?: PreviewConfig
  }
}

export function FilePreview({ file }: FilePreviewProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchPreviewUrl = async () => {
    try {
        setIsLoading(true)
      const response = await fetch (`/api/files/${file._id}/download`)
      if (!response.ok) throw new Error ('Failed to fetch preview URL')
        const data = await response.json()
        setPreviewUrl(data.fileUrl)
    } catch (error) {
      console.error('Error fetching preview URL:', error)
    } finally {
        setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isHovered && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.top - 256, 
        left: rect.left 
      })
      fetchPreviewUrl()
    } else {
      setPreviewUrl(null)
    }
  }, [isHovered, file._id])

  const renderPreview = () => {
    if (isLoading) {
        return <div className="p-4 text-center">
            <p className='text-sm text-gray-500'>Loading preview...</p>
            </div>
    }
    if (!file.preview?.canPreview) {
      return (
        <div className="p-4 text-center">
          <img 
            src={file.preview?.icon || `/icons/${file.category}.svg`} 
            alt={file.category} 
            className="w-12 h-12 mx-auto mb-2" 
          />
          <p className="text-sm text-gray-500">Preview not available</p>
        </div>
      )
    }

    if (!previewUrl) {
        return (
            <div className="p-4 text-center">
                <p className='text-sm text-gray-500'>Failed to load preview</p>
            </div>
        )
    }

    switch (file.preview.previewType) {
      case 'image':
        return (
          <img
            src={previewUrl || file.fileUrl}
            alt={file.title}
            className="w-full h-full object-contain"
          />
        )
      case 'iframe':
        return (
          <iframe
            src={previewUrl || file.fileUrl}
            className="w-full h-full"
            title={file.title}
          />
        )
      case 'audio':
        return (
          <audio controls className="w-full">
            <source src={previewUrl || file.fileUrl} type={file.mimeType} />
            Your browser does not support the audio element.
          </audio>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="cursor-pointer hover:text-primary transition-colors">
          {file.title}
        </span>
      </div>
      
      {isHovered && (
        <div
          className={cn(
            "fixed z-50 w-64 h-64 bg-white rounded-lg shadow-lg overflow-hidden",
            "border border-gray-200"
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
        >
          {renderPreview()}
        </div>
      )}
    </>
  )
} 