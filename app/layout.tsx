import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Kanban App',
  description:
    'Kanban app with Next.js, @hello-pangea/dnd, drizzle, and tailwind',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className='flex flex-col min-h-svh'>
        <main className='flex-1 flex'>
          <div className='flex-1 flex flex-col container p-4 w-full mx-auto gap-4 space-y-4'>
            <h1 className='text-xl sm:text-2xl font-semibold'>
              <Link href='/' className='p-2'>
                Kanban App
              </Link>
            </h1>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
