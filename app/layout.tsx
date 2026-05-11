import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display, Noto_Sans_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ConvexClientProvider } from '@/components/ConvexClientProvider'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Apply to Shomoukh Early Childhood Education | Online enrolment (Oman)',
  description:
    'Apply for a place at Shomoukh Early Childhood Education in Muscat. One secure form walks you through child details, family contacts, health information, and consent — save progress and submit when you are ready.',
  keywords: [
    'Shomoukh Early Childhood Education',
    'Muscat nursery admission',
    'early childhood Oman',
    'school enrolment Oman',
    'Shomoukh application',
  ],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/logo-icon.png', type: 'image/png' },
    ],
    apple: '/logo-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${playfair.variable} ${notoArabic.variable}`}>
      <body className="font-sans antialiased">
        <ConvexClientProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'white',
                color: '#111827',
                border: '1px solid #e5e7eb',
              },
            }}
          />
        </ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  )
}

