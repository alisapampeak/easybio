import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EasyBio - Platform Link Bio Modern',
  description: 'Buat link bio profesional dengan mudah',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}