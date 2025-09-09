'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Users, Star, Sun, Moon, ArrowUp, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import Link from 'next/link'
import GarbaEnrolmentFlow from '@/components/GarbaEnrolmentFlow'
import { databaseService } from '@/lib/database-service'

export default function GarbaDandiyaPage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showEnrolmentModal, setShowEnrolmentModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showGoToTop, setShowGoToTop] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [isParticipantsCollapsed, setIsParticipantsCollapsed] = useState(true)
  const [loadingParticipants, setLoadingParticipants] = useState(false)
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

  // Handle scroll for go to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowGoToTop(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Fetch Garba & Dandiya participants
  const fetchParticipants = async () => {
    setLoadingParticipants(true)
    try {
      const response = await fetch('/api/event-nominations')
      if (response.ok) {
        const data = await response.json()
        // Filter for Garba & Dandiya workshop participants
        const garbaParticipants = data.filter((participant: any) => 
          participant.event_title === 'Garba & Dandiya Workshop 2025'
        )
        setParticipants(garbaParticipants)
        console.log('🎭 Garba participants found:', garbaParticipants.length)
      }
    } catch (error) {
      console.error('Error fetching participants:', error)
    } finally {
      setLoadingParticipants(false)
    }
  }

  // Fetch participants on component mount
  useEffect(() => {
    fetchParticipants()
  }, [])

  return (
    <div className={`min-h-screen ${themeStyles.background}`}>
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
              <Link href="/navratri-utsav" className={`${themeStyles.text} hover:text-purple-300 transition-colors duration-200 font-medium digital-text`}>
                Navratri Utsav
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
                        className={`absolute right-0 top-12 w-64 ${themeStyles.cardBg} rounded-xl shadow-2xl border ${themeStyles.border} py-2 z-50`}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <span className={`text-sm font-medium ${themeStyles.muted} digital-text`}>Quick Navigation</span>
                        </div>
                        
                        <div className="py-2">
                          <Link 
                            href="/navratri-utsav"
                            onClick={() => setShowMobileMenu(false)}
                            className={`flex items-center px-4 py-3 ${themeStyles.text} hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 digital-text`}
                          >
                            <span className="text-lg mr-3">🕉️</span>
                            <span className="font-medium">Navratri Utsav</span>
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
              backgroundImage: "url('/events/durga-pooja/dandiya1.png')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/50 via-red-800/50 to-pink-900/50"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Dance Elements */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 text-4xl opacity-60"
          >
            💃
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-32 right-16 text-3xl opacity-50"
          >
            🎭
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-40 left-20 text-2xl opacity-40"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 12, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-60 right-12 text-3xl opacity-45"
          >
            🕺
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            {/* Main Title with Enhanced Styling */}
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-xl rounded-full"
              />
              <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[120px] font-bold mb-3 sm:mb-4 font-['Dancing_Script'] leading-tight text-yellow-300 drop-shadow-lg">
                Garba & Dandiya
              </h1>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 font-['Pacifico'] text-orange-200 drop-shadow-md">
              Dance Workshop 2025
            </h2>
            
            {/* Enhanced Description */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/10 to-orange-100/10 blur-lg rounded-2xl" />
              <p className="relative text-base sm:text-lg md:text-xl lg:text-2xl text-yellow-100 max-w-3xl mx-auto font-kievit leading-relaxed px-2 sm:px-0 drop-shadow-sm">
                🌟 Step into the Circle of Joy! 🌟 Learn traditional Gujarati folk dances, master the art of Dandiya sticks, and dance your way through Navratri celebrations!
              </p>
            </motion.div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-orange-500/30 to-red-500/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-orange-300/40 shadow-lg">
              <div className="text-2xl sm:text-3xl mb-2">🎭</div>
              <div className="text-base sm:text-lg md:text-xl font-bold mb-1 font-['Dancing_Script'] text-yellow-200">7 Days</div>
              <div className="text-xs sm:text-sm md:text-base text-orange-100 font-['Quicksand']">Dance Journey</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500/30 to-purple-500/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-pink-300/40 shadow-lg">
              <div className="text-2xl sm:text-3xl mb-2">🕺</div>
              <div className="text-base sm:text-lg md:text-xl font-bold mb-1 font-['Dancing_Script'] text-yellow-200">1.5 Hours</div>
              <div className="text-xs sm:text-sm md:text-base text-pink-100 font-['Quicksand']">Per Session</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-6 border border-yellow-300/40 shadow-lg">
              <div className="text-2xl sm:text-3xl mb-2">👗</div>
              <div className="text-base sm:text-lg md:text-xl font-bold mb-1 font-['Dancing_Script'] text-yellow-200">Traditional</div>
              <div className="text-xs sm:text-sm md:text-base text-yellow-100 font-['Quicksand']">Attire</div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Scroll Down Arrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-white cursor-pointer group"
            onClick={() => document.getElementById('workshop-details')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {/* Animated Scroll Indicator */}
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-12 border-2 border-white rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [4, 16, 4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 h-3 bg-white rounded-full mt-2"
                />
              </motion.div>
            </div>
            
            {/* Scroll Text */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-xs sm:text-sm font-medium font-kievit mt-3 group-hover:text-yellow-300 transition-colors duration-300"
            >
              Discover Workshop
            </motion.div>
            
            {/* Decorative Elements */}
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2 text-lg opacity-60"
            >
              ✨
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Workshop Details Section */}
      <section id="workshop-details" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            
          </motion.div>

          {/* Combined Workshop & Registration Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className={`${themeStyles.cardBg} rounded-3xl p-8 shadow-2xl border ${themeStyles.border}`}>
              {/* Header */}
              <div className="text-center mb-12">
                
                <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 font-kievit ${themeStyles.text} bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent`}>
                  🎭 Join Our Dance Circle! 🎭
                </h3>
                <p className={`text-xl font-kievit ${themeStyles.muted} max-w-2xl mx-auto leading-relaxed`}>
                  Let's dance our way through Navratri celebrations! 💃✨
                </p>
                
                {/* Floating Dance Emojis */}
                <div className="flex justify-center space-x-4 mt-6">
                  <motion.span
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    className="text-2xl"
                  >
                    💃
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="text-2xl"
                  >
                    🕺
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="text-2xl"
                  >
                    ✨
                  </motion.span>
                  <motion.span
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="text-2xl"
                  >
                    🎪
                  </motion.span>
                </div>
              </div>


              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Workshop Information */}
                <div className="space-y-6">
                  <div>
                    <h4 className={`text-xl font-bold font-kievit ${themeStyles.text} mb-4 text-center`}>
                      🎪 Workshop Details
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <span className="text-orange-500 mr-3 mt-1">🎭</span>
                        <div>
                          <p className={`font-medium font-kievit ${themeStyles.text}`}>7-day intensive dance workshop</p>
                          <p className={`text-sm font-kievit ${themeStyles.muted}`}>1.5 hours of pure dance joy per session</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <span className="text-orange-500 mr-3 mt-1">💃</span>
                        <div>
                          <p className={`font-medium font-kievit ${themeStyles.text}`}>Starting from 14th September</p>
                          <p className={`text-sm font-kievit ${themeStyles.muted}`}>Ladies-focused circle dancing</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <span className="text-orange-500 mr-3 mt-1">🎪</span>
                        <div>
                          <p className={`font-medium font-kievit ${themeStyles.text}`}>Expert Garba & Dandiya instructor</p>
                          <p className={`text-sm font-kievit ${themeStyles.muted}`}>Traditional dance mastery guidance</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <span className="text-orange-500 mr-3 mt-1">🌙</span>
                        <div>
                          <p className={`font-medium font-kievit ${themeStyles.text}`}>Evening sessions after 8 PM</p>
                          <p className={`text-sm font-kievit ${themeStyles.muted}`}>Perfect for festive night dancing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Registration */}
                <div className="space-y-6">
                  <div>
                    <h4 className={`text-xl font-bold font-kievit ${themeStyles.text} mb-4 text-center`}>
                      🎫 Dance Pass & Registration
                    </h4>
                    
                    <div className="space-y-4">
                      <div className={`bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 ${isDarkMode ? 'from-purple-900/50 to-pink-900/50' : ''}`}>
                        <p className={`text-lg font-bold font-kievit ${themeStyles.text}`}>
                          Total Fee: ₹10,500
                        </p>
                        <p className={`text-sm font-kievit ${themeStyles.muted}`}>
                          ₹1,500 per session × 7 sessions
                        </p>
                      </div>
                      
                      <div className={`bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 ${isDarkMode ? 'from-green-900/50 to-emerald-900/50' : ''}`}>
                        <p className={`font-medium font-kievit ${themeStyles.text}`}>
                          🎉 Group Discount Available!
                        </p>
                        <p className={`text-sm font-kievit ${themeStyles.muted}`}>
                          If we get 30 participants: ₹350 per person
                        </p>
                        <p className={`text-xs font-kievit ${themeStyles.muted}`}>
                          (₹10,500 ÷ 30 = ₹350)
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-purple-500 mr-3" />
                          <div>
                            <p className={`font-medium font-kievit ${themeStyles.text}`}>Registration Deadline</p>
                            <p className={`text-sm font-kievit ${themeStyles.muted}`}>11th September</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="w-5 h-5 text-pink-500 mr-3" />
                          <div>
                            <p className={`font-medium font-kievit ${themeStyles.text}`}>Male Participants</p>
                            <p className={`text-sm font-kievit ${themeStyles.muted}`}>Separate session if interested</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-500 mr-3" />
                          <div>
                            <p className={`font-medium font-kievit ${themeStyles.text}`}>Payment Required</p>
                            <p className={`text-sm font-kievit ${themeStyles.muted}`}>For confirmation</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className={`${themeStyles.cardBg} rounded-2xl p-8 mt-12 shadow-xl border ${themeStyles.border} backdrop-blur-sm relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                    >
                      <span className="text-2xl">📞</span>
                    </motion.div>
                    <h4 className={`text-2xl font-bold mb-2 font-kievit ${themeStyles.text}`}>
                      Contact Dr. Bharti
                    </h4>
                    <p className={`text-base font-kievit ${themeStyles.muted}`}>
                      For enrolment and payment details
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <motion.a 
                      href="tel:‪9687663916‬" 
                      className={`inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold font-kievit text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-2xl">💬</span>
                      <span>9687663916</span>
                    </motion.a>
                    
                   
                  </div>
                </div>
              </div>

              {/* Enrolment Button */}
              <div className="text-center mt-8">
                <motion.button
                  onClick={() => setShowEnrolmentModal(true)}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.9, 1, 0.9]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold font-kievit shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
                >
                  🎯 Enrol Now
                </motion.button>
                
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Participants List Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`${themeStyles.cardBg} rounded-2xl p-6 shadow-xl border ${themeStyles.border} backdrop-blur-sm`}>
            <motion.button
              onClick={() => setIsParticipantsCollapsed(!isParticipantsCollapsed)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                  <div className="text-left">
                    <h4 className={`text-xl font-bold font-kievit ${themeStyles.text}`}>
                      💃 Dance Circle Participants
                    </h4>
                    <p className={`text-sm font-kievit ${themeStyles.muted}`}>
                      {participants.length} {participants.length === 1 ? 'participant' : 'participants'} enrolled
                    </p>
                  </div>
                  <motion.button
                    onClick={fetchParticipants}
                    disabled={loadingParticipants}
                    className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} ${loadingParticipants ? 'opacity-50 cursor-not-allowed' : ''}`}
                    whileHover={{ scale: loadingParticipants ? 1 : 1.05 }}
                    whileTap={{ scale: loadingParticipants ? 1 : 0.95 }}
                  >
                    <RefreshCw className={`w-5 h-5 ${themeStyles.text} ${loadingParticipants ? 'animate-spin' : ''}`} />
                  </motion.button>
              </div>
              <motion.div
                animate={{ rotate: isParticipantsCollapsed ? 0 : 180 }}
                transition={{ duration: 0.2 }}
              >
                {isParticipantsCollapsed ? (
                  <ChevronDown className={`w-6 h-6 ${themeStyles.text}`} />
                ) : (
                  <ChevronUp className={`w-6 h-6 ${themeStyles.text}`} />
                )}
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {!isParticipantsCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    {loadingParticipants ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        <p className={`mt-2 font-kievit ${themeStyles.muted}`}>Loading participants...</p>
                      </div>
                    ) : participants.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <p className={`text-lg font-kievit ${themeStyles.text}`}>No participants yet</p>
                        <p className={`text-sm font-kievit ${themeStyles.muted}`}>Be the first to join our dance circle!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {participants.map((participant, index) => (
                          <motion.div
                            key={participant.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`${themeStyles.cardBg} rounded-xl p-4 border ${themeStyles.border} hover:shadow-lg transition-all duration-200`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-sm">
                                  {participant.user_name?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium font-kievit ${themeStyles.text} truncate`}>
                                  {participant.user_name || 'Unknown'}
                                </p>
                                <p className={`text-sm font-kievit ${themeStyles.muted}`}>
                                  {participant.building} - {participant.flat}
                                </p>
                                {participant.mobile_number && (
                                  <p className={`text-xs font-kievit ${themeStyles.muted}`}>
                                    📱 {participant.mobile_number}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

      {/* Enrolment Modal */}
      <AnimatePresence>
        {showEnrolmentModal && (
          <GarbaEnrolmentFlow
            onClose={() => setShowEnrolmentModal(false)}
            onSuccess={(message) => {
              setSuccessMessage(message)
              setShowEnrolmentModal(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-lg max-w-sm z-50"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎉</div>
              <div>
                <p className="font-bold font-kievit">Success!</p>
                <p className="text-sm font-kievit">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-white hover:text-gray-200 transition-colors ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Go to Top Button */}
      <AnimatePresence>
        {showGoToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-sm group"
            aria-label="Go to top"
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowUp className="w-6 h-6 group-hover:text-yellow-200 transition-colors duration-200" />
            </motion.div>
            
            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Go to Top
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
