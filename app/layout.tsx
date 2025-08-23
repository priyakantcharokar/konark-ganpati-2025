import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Konark Exotica - Ganesh Pooja 2025',
  description: 'Complete schedule and information for the Ganesh Pooja Festival 2025 at Konark Exotica',
  keywords: 'Ganesh Pooja, Festival, Schedule, Events, Ganpati, Konark Exotica',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation Bar - Available on all pages */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">🕉️</span>
                <a 
                  href="/" 
                  className="text-3xl font-bold text-gray-800 font-style-script hover:text-orange-600 transition-colors duration-200 cursor-pointer"
                >
                  Konark Exotica
                </a>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                <a 
                  href="/" 
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-200 font-circular hover:scale-105 transform"
                >
                  Schedule & Events
                </a>
                <a 
                  href="/participation-overview"
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-200 font-circular hover:scale-105 transform"
                >
                  Participation Overview
                </a>
                <a 
                  href="/bhog-list"
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-200 font-circular hover:scale-105 transform"
                >
                  Bhog List
                </a>
                <a 
                  href="/gallery"
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-200 font-circular hover:scale-105 transform"
                >
                  Gallery
                </a>
              </div>
            </div>
            
            {/* Mobile Breadcrumb Navigation */}
            <div className="md:hidden pb-3 border-t border-gray-100 mt-3">
              <div className="flex flex-col space-y-2 text-sm">
                <span className="text-gray-500 flex items-center font-circular">
                  <span className="text-xs mr-1">📍</span>
                  Navigate:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <a 
                    href="/" 
                    className="text-orange-600 hover:text-orange-700 transition-all duration-200 font-medium px-2 py-1 rounded-md hover:bg-orange-50 active:scale-95 font-circular text-xs"
                  >
                    Schedule & Events
                  </a>
                  <span className="text-gray-400">•</span>
                  <a 
                    href="/participation-overview"
                    className="text-orange-600 hover:text-orange-700 transition-all duration-200 font-medium px-2 py-1 rounded-md hover:bg-orange-50 active:scale-95 font-circular text-xs"
                  >
                    Overview
                  </a>
                  <span className="text-gray-400">•</span>
                  <a 
                    href="/bhog-list"
                    className="text-orange-600 hover:text-orange-700 transition-all duration-200 font-medium px-2 py-1 rounded-md hover:bg-orange-50 active:scale-95 font-circular text-xs"
                  >
                    Bhog List
                  </a>
                  <span className="text-gray-400">•</span>
                  <a 
                    href="/gallery"
                    className="text-orange-600 hover:text-orange-700 transition-all duration-200 font-medium px-2 py-1 rounded-md hover:bg-orange-50 active:scale-95 font-circular text-xs"
                  >
                    Gallery
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
