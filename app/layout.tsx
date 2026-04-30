import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Navbar from './components/Navbar'
import AudioPlayer from './components/AudioPlayer'
import { AudioProvider } from './context/AudioContext'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'buzi music',
  description: 'Music project by buzi',
}

// Inline script that runs before React hydrates — prevents flash of wrong theme
const themeScript = `
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    } catch (_) {}
  })();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Runs synchronously before paint to avoid theme flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <AudioProvider>
          <Navbar />
          {/* Offset content below fixed navbar, above fixed player */}
          <main className="flex flex-1 flex-col pt-16 pb-16">
            {children}
          </main>
          <AudioPlayer />
        </AudioProvider>
      </body>
    </html>
  )
}
