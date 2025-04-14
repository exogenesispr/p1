'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FilePreview } from '@/components/admin/FilePreview'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { generatePreviewConfig } from '@/lib/previewHandler'
import { FileCategory } from '@/lib/fileValidation'

interface File {
  _id: string
  title: string
  category: string
  mimeType: string
  fileUrl: string
  downloads: number
  createdAt: string
  status: 'pending' | 'active' | 'error'
}

export default function PublicFilesPage() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const fetchFiles = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category !== 'all') params.set('category', category)

      const response = await fetch(`/api/public/files?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch files')
      
      const data = await response.json()
      setFiles(data)
    } catch (error) {
      toast.error('Failed to fetch files', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (id: string) => {
    try {
      const response = await fetch(`/api/public/files/${id}/download`)
      if (!response.ok) throw new Error('Failed to download file')
      
      const data = await response.json()
      window.open(data.fileUrl, '_blank')
    } catch (error) {
      toast.error('Failed to download file', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [search, category])

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Public Files</h1>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search files..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="archive">Archives</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No files found
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => (
                <TableRow key={file._id}>
                  <TableCell className="font-medium relative">
                    <FilePreview 
                      file={{
                        ...file,
                        preview: generatePreviewConfig(file.category as FileCategory, file.fileUrl, file.mimeType)
                      }} 
                    />
                  </TableCell>
                  <TableCell className="capitalize">{file.category}</TableCell>
                  <TableCell>
                    {new Date(file.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{file.downloads}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(file._id)}
                      disabled={file.status !== 'active'}
                      className='cursor-pointer hover:bg-gray-200 transition-colors'
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 