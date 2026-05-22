import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/sidebar'

const inter = Inter({ variable: '--font-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agencia Distribuidora SEDEM',
  description: 'Sistema logístico de distribución — SEDEM · UCB',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${geistMono.variable} h-full`}>
      <body className="h-full flex bg-gray-50 antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-auto">
          {children}
        </div>
      </body>
    </html>
  )
}
