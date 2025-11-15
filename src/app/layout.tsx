import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Personal AI Effectiveness Assistant',
  description: 'ИИ-ассистент для управления эффективностью и достижения целей',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Header />
        {children}
      </body>
    </html>
  )
}
