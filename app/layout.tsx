import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from "@/components/providers/toaster-provider"
import { ConfettiProvider } from '@/components/providers/confetti-provider'
import { dark } from "@clerk/themes"
import { Logo } from './(dashboard)/_components/logo'

const inter = Inter({ subsets: ['latin'], })

export const metadata: Metadata = {
  title: 'Munity',
  description: 'Marketplace to learn new skills',
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo-trans.svg",
        href: "/logo-trans.svg",
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider

    >
    <html lang="en">
      <body className={inter.className} >
        <ConfettiProvider />
        <ToastProvider />
        {children}
      </body>
    </html>
    </ClerkProvider>
  )
}
