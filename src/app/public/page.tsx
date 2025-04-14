'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, FileText, Shield, Upload } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PublicPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false)
    }
  }, [status])

  const handleAdminRedirect = () => {
    if (session?.user) {
      router.push('/admin/files')
    } else {
      router.push('/auth/signin?callbackUrl=/admin/files')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to P1</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A secure platform for sharing and managing your files. Browse public files or sign in to access the admin dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Public Files
            </CardTitle>
            <CardDescription>
              Browse and download publicly available files
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="w-full cursor-not-allowed">
                <Button 
                  className="w-full" 
                  disabled={true}
                >
                  Browse Files <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/public/files">
                <Button 
                  className="w-full cursor-pointer" 
                >
                  Browse Files <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Dashboard
            </CardTitle>
            <CardDescription>
              {isLoading ? 'Checking authentication...' : 
                session?.user ? 'Access your admin dashboard' : 'Sign in to manage files'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full cursor-pointer" 
              onClick={handleAdminRedirect}
              variant={session?.user ? "default" : "outline"}
              disabled={isLoading}
            >
              {isLoading ? (
                'Loading...'
              ) : session?.user ? (
                <>
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {!isLoading && session?.user && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Signed in as {session.user.email}
          </p>
        </div>
      )}
    </div>
  )
} 