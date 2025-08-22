'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EventSchedule from '../components/EventSchedule'

export default function Home() {
  const [userData] = useState({ flatNumber: 'Guest', phone: 'Visitor' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
            {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🕉️</span>
              <span className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Style Script, cursive' }}>
                Konark Exotica
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="#aarti-schedule" className="text-gray-600 hover:text-orange-600 transition-colors duration-200">
                Daily Aarti Schedule
              </a>
              <a href="#festival-events" className="text-gray-600 hover:text-orange-600 transition-colors duration-200">
                Festival Events
              </a>
            </div>
          </div>
          
          {/* Mobile Breadcrumb Navigation */}
          <div className="md:hidden pb-3 border-t border-gray-100 mt-3">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500 flex items-center">
                <span className="text-xs mr-1">📍</span>
                Navigate:
              </span>
              <div className="flex items-center space-x-1">
                <a 
                  href="#aarti-schedule" 
                  className="text-orange-600 hover:text-orange-700 transition-all duration-200 font-medium px-2 py-1 rounded-md hover:bg-orange-50 active:scale-95"
                >
                  Aarti Schedule
                </a>
                <span className="text-gray-400 mx-1">•</span>
                <a 
                  href="#festival-events" 
                  className="text-orange-600 hover:text-orange-700 transition-all duration-200 font-medium px-2 py-1 rounded-md hover:bg-orange-50 active:scale-95"
                >
                  Festival Events
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Event Schedule */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
        <EventSchedule 
          userPhone={userData.phone}
          userFlat={userData.flatNumber}
          onLogout={() => {}}
        />
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-white border-t border-gray-200 py-6 sm:py-8 mt-8 sm:mt-12 lg:mt-16"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: 'Charter, serif' }}>
            © 2025 Ganesh Pooja Festival. Made with ❤️ for our community.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2" style={{ fontFamily: 'Söhne, sans-serif' }}>
            Most events will be held after 7 PM to ensure maximum participation.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
