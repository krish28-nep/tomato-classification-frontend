// tomato-classification-frontend/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { AuthProvider } from '@/context/AuthContext'
import { SocketProvider } from '@/context/SocketContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'TomatoCare - Tomato Disease Detection & Farming Community',
  description: 'Detect tomato leaf diseases with AI and connect with agricultural experts in our farming community platform.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#2d8a4e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}>
        <ReactQueryProvider>
          <AuthProvider>
            <SocketProvider>
              {children}
              <Toaster position="top-right" richColors />
            </SocketProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
