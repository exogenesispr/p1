import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className='min-h-screen bg-gray-50'>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
