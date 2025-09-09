'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Users, Star, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import Link from 'next/link'

export default function NavratriUtsavPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const { isDarkMode, toggleTheme, themeStyles } = useTheme()

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showMobileMenu && !target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMobileMenu])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
              <span className="text-2xl sm:text-3xl">🕉️</span>
              <span className={`text-xl sm:text-2xl font-bold font-style-script ${themeStyles.text}`}>
                Konark Exotica
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#pooja" className={`${themeStyles.text} hover:text-purple-300 transition-colors duration-200 font-medium digital-text`}>
                Daily Pooja
              </a>
              <Link href="/garba-dandiya" className={`${themeStyles.text} hover:text-purple-300 transition-colors duration-200 font-medium digital-text`}>
                Garba & Dandiya
              </Link>
              <Link href="/gallery" className={`${themeStyles.text} hover:text-purple-300 transition-colors duration-200 font-medium digital-text`}>
                Gallery
              </Link>
            </div>

            {/* Theme Toggle */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${themeStyles.cardBg} border ${themeStyles.border} hover:bg-opacity-80 transition-all duration-200`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className={`w-5 h-5 ${themeStyles.text}`} />
                ) : (
                  <Moon className={`w-5 h-5 ${themeStyles.text}`} />
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden mobile-menu-container">
              <div className="relative flex items-center space-x-2">
                {/* Theme Toggle for Mobile */}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg ${themeStyles.cardBg} border ${themeStyles.border} hover:bg-opacity-80 transition-all duration-200`}
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? (
                    <Sun className={`w-4 h-4 ${themeStyles.text}`} />
                  ) : (
                    <Moon className={`w-4 h-4 ${themeStyles.text}`} />
                  )}
                </button>
                
                <button 
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className={`${themeStyles.text} hover:text-purple-300 transition-colors duration-200 p-2`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                  {showMobileMenu && (
                    <>
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/20 z-40"
                        onClick={() => setShowMobileMenu(false)}
                      />
                      
                      {/* Menu */}
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 top-12 w-64 ${themeStyles.cardBg} rounded-xl shadow-2xl border py-2 z-50`}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <span className={`text-sm font-medium ${themeStyles.muted} digital-text`}>Quick Navigation</span>
                        </div>
                        
                        <div className="py-2">
                          <a 
                            href="#pooja" 
                            onClick={() => setShowMobileMenu(false)}
                            className={`flex items-center px-4 py-3 ${themeStyles.text} hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 digital-text`}
                          >
                            <span className="text-lg mr-3">🙏</span>
                            <span className="font-medium">Daily Pooja</span>
                          </a>
                          
                          <Link 
                            href="/garba-dandiya"
                            onClick={() => setShowMobileMenu(false)}
                            className={`flex items-center px-4 py-3 ${themeStyles.text} hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 digital-text`}
                          >
                            <span className="text-lg mr-3">💃</span>
                            <span className="font-medium">Garba & Dandiya</span>
                          </Link>
                          
                          <Link 
                            href="/gallery"
                            onClick={() => setShowMobileMenu(false)}
                            className={`flex items-center px-4 py-3 ${themeStyles.text} hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 digital-text`}
                          >
                            <span className="text-lg mr-3">📸</span>
                            <span className="font-medium">Gallery</span>
                          </Link>
                        </div>
                        
                        <div className="px-4 py-3 border-t border-gray-100">
                          <Link 
                            href="/"
                            onClick={() => setShowMobileMenu(false)}
                            className={`flex items-center ${themeStyles.accent} hover:text-purple-700 font-medium digital-text`}
                          >
                            <span className="mr-2">🏠</span>
                            Back to Home
                          </Link>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/events/durga-pooja/durga1.png')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-pink-800/60 to-purple-900/60"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[130px] font-bold mb-3 sm:mb-4 font-style-script leading-tight">
              Konark Exotica
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 digital-numbers">
              Navratri Utsav 2025
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto digital-text leading-relaxed px-2 sm:px-0">
              Experience nine nights of divine celebration with Goddess Durga through spiritual ceremonies, 
              cultural performances, and community festivities
            </p>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/30">
              <div className="text-2xl sm:text-3xl mb-2">🕉️</div>
              <div className="text-base sm:text-lg md:text-xl font-bold mb-1 digital-numbers">9 Nights</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-200 digital-text">Divine Celebration</div>
            </div>
            <Link href="/garba-dandiya" className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/30 hover:bg-white/30 transition-all duration-200 cursor-pointer relative overflow-hidden">
              <div className="text-2xl sm:text-3xl mb-2">💃</div>
              <div className="text-base sm:text-lg md:text-xl font-bold mb-1 digital-numbers">Garba & Dandiya</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-200 digital-text mb-3">Cultural Events</div>
              
              {/* Enrol Button */}
              <div className="mt-3 flex justify-center">
                <motion.button
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.9, 1, 0.9]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
                >
                  Participate
                </motion.button>
              </div>
            </Link>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/30">
              <div className="text-2xl sm:text-3xl mb-2">🙏</div>
              <div className="text-base sm:text-lg md:text-xl font-bold mb-1 digital-numbers">Daily Pooja</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-200 digital-text">Spiritual Ceremonies</div>
            </div>
          </motion.div>
        </div>

      </section>

      

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 text-center">
        <p className="text-lg font-medium digital-text">
          🎉 Celebrating Divine Feminine Energy! 🎉
        </p>
        <p className="text-sm mt-2 opacity-90 digital-text">
          © 2025 Navratri Utsav Festival. Crafted with ❤️ to bring our community closer through spiritual celebrations.
        </p>
      </footer>
    </div>
  )
}