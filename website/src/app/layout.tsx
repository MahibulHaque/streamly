import type { Metadata } from 'next'
import './globals.css'
import { DM_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import ReactQueryProvider from '@/providers/react-query'
import { ReduxProvider } from '@/providers/redux'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

const manrope = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Streamly',
  description: 'Share AI powered videos with your friends.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${manrope.className} bg-[#171717]`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <ReduxProvider>
              <ReactQueryProvider>
                {children}
                <Toaster />
              </ReactQueryProvider>
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}