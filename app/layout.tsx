import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Northstar Re | Reinsurance Operations',
  description: 'Policy tracking, market fit intelligence, reminders and reports for reinsurance brokers.',
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f5f7fb' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-[#f5f7fb]"><body className={`${inter.variable} antialiased`}>{children}</body></html>
}
