import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Cairo } from 'next/font/google'

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '600', '700'],
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ERP System',
  description: 'نظام إدارة متكامل',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.className}>
      <body >
        {children}
      </body>
    </html>
  )
}