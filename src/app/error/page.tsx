'use client'

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error')

    const errorMessages: Record<string, string> = {
        AccessDenied: 'You are not authorized to access this area',
        Default: 'An error occurred while signing in',
    }

    const errorMessage = error ? errorMessages[error] : errorMessages.Default

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
            <div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Authentication Error
              </h2>
              <div className="mt-4 text-center text-red-500">
                {errorMessage}
              </div>
              <div className="mt-4 text-center">
                <Link 
                  href="/auth/signin"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Return to sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
}
