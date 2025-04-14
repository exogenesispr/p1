import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdmin = token?.role === 'admin';
        const pathname = req.nextUrl.pathname;

        // Public routes don't need authentication
        if (pathname.startsWith('/public')) {
            return NextResponse.next();
        }

        // Admin routes require admin role
        if (pathname.startsWith('/admin') && !isAdmin) {
            return NextResponse.redirect(new URL('/auth/unauthorized', req.url))
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Public routes don't need authentication
                if (req.nextUrl.pathname.startsWith('/public')) {
                    return true;
                }
                // Other routes require authentication
                return !!token;
            }
        },
    }
);

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/public/:path*'
    ]
}