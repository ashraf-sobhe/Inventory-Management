import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Inventory Management',
  description: 'نظام إدارة المخزون',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.className}>
      <body>
        {children}
        <Toaster
          position="bottom-left"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'inherit',
            },
            success: {
              style: {
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#15803d',
              },
            },
            error: {
              style: {
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
              },
            },
          }}
        />
      </body>
    </html>
  )
}