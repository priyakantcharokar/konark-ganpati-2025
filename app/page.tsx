'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import EventSchedule from '@/components/EventSchedule'
import { AnimatePresence } from 'framer-motion'

// Counting Animation Component
function CountUp({ end, duration = 4000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration])

  return (
    <span className="font-mono tracking-wider text-green-600">
      {count}
    </span>
  )
}

export default function Home() {
  const [userData] = useState({ flatNumber: 'Guest', phone: 'Visitor' })
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl">🕉️</span>
              <span className="text-xl sm:text-2xl font-bold text-white font-style-script">
                Konark Exotica
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#aarti" className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium digital-text">
                Book Aarti
              </a>
              <a href="#events" className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium digital-text">
                Participate
              </a>
              <Link href="/gallery" className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium digital-text">
                Gallery
              </Link>
              <Link href="/participation-overview" className="text-white hover:text-yellow-300 transition-colors duration-200 font-medium digital-text">
                Participation
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden mobile-menu-container">
              <div className="relative">
                <button 
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="text-white hover:text-yellow-300 transition-colors duration-200 p-2"
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
                        className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-500 digital-text">Quick Navigation</span>
                        </div>
                        
                        <div className="py-2">
                          <a 
                            href="#aarti" 
                            onClick={() => setShowMobileMenu(false)}
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 digital-text"
                          >
                            <span className="text-lg mr-3">🙏</span>
                            <span className="font-medium">Daily Aarti</span>
                          </a>
                          
                          <a 
                            href="#events" 
                            onClick={() => setShowMobileMenu(false)}
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 digital-text"
                          >
                            <span className="text-lg mr-3">🎉</span>
                            <span className="font-medium">Festival Events</span>
                          </a>
                          
                          <Link 
                            href="/gallery"
                            onClick={() => setShowMobileMenu(false)}
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 digital-text"
                          >
                            <span className="text-lg mr-3">📸</span>
                            <span className="font-medium">Gallery</span>
                          </Link>
                          
                          <Link 
                            href="/participation-overview"
                            onClick={() => setShowMobileMenu(false)}
                            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 digital-text"
                          >
                            <span className="text-lg mr-3">📊</span>
                            <span className="font-medium">Participation</span>
                          </Link>
                        </div>
                        
                        <div className="px-4 py-3 border-t border-gray-100">
                          <Link 
                            href="/"
                            onClick={() => setShowMobileMenu(false)}
                            className="flex items-center text-blue-600 hover:text-blue-700 font-medium digital-text"
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
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="memories/GaneshaMusical.png"
            alt="Ganesha Musical Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50 sm:bg-black/40"></div>
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
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 digital-text">
              Ganesh Pooja 2025
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto digital-text leading-relaxed px-2 sm:px-0">
              Experience the divine celebration of Lord Ganesha with cultural events, 
              spiritual ceremonies, and community festivities
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
              <div className="text-2xl sm:text-3xl mb-2">🎉</div>
              <div className="text-base sm:text-lg md:text-xl font-bold mb-1 digital-numbers">24 Events</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-200 digital-text">Cultural & Spiritual</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/30">
              <div className="text-2xl sm:text-3xl mb-2">📅</div>
              <div className="text-base sm:text-lg md:text-xl font-bold mb-1 digital-numbers">Aug 23 - Sep 6</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-200 digital-text">Festival Duration</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-white/30">
              <div className="text-2xl sm:text-3xl mb-2">⏰</div>
              <div className="text-base sm:text-lg md:text-xl font-bold mb-1 digital-numbers">7 PM</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-200 digital-text">Daily Aarti</div>
            </div>
          </motion.div>
        </div>
      </section>


        {/* Event Schedule Component */}
        <section id="events" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <EventSchedule 
            userPhone=""
            userFlat=""
            onLogout={() => {}}
          />
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 font-jaf-bernino mb-4"
            >
              📸 Festival Gallery
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto digital-text mb-8"
            >
              Relive the beautiful moments and cherished memories from our Ganesh Pooja Festival
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link 
                href="/gallery"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg digital-text"
              >
                View Gallery
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Participation Overview Section */}
        <section id="overview" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 font-jaf-bernino mb-4"
            >
              📊 Participation Overview
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto digital-text mb-8"
            >
              Track all your festival participations, aarti bookings, and event nominations in one place
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link 
                href="/participation-overview"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg digital-text"
              >
                View Overview
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-8 text-center">
        <p className="text-lg font-medium digital-text">
          🎉 Celebrating Unity, Faith & Joy Together! 🎉
        </p>
        <p className="text-sm mt-2 opacity-90 digital-text">
          © 2025 Ganesh Pooja Festival. Crafted with ❤️ to bring our community closer through divine celebrations.
        </p>
      </footer>
    </div>
  )
}
