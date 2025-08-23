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
              <a 
                href="/" 
                className="text-xl font-bold text-gray-800 font-style-script hover:text-orange-600 transition-colors duration-200 cursor-pointer"
              >
                Konark Exotica
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a 
                href="#aarti-schedule" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('aarti-schedule')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 font-circular hover:scale-105 transform"
              >
                Daily Aarti Schedule
              </a>
              <a 
                href="#festival-events" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('festival-events')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                className="text-gray-600 hover:text-orange-600 transition-colors duration-200 font-circular hover:scale-105 transform"
              >
                Festival Events
              </a>
            </div>
          </div>
          
          {/* Mobile Breadcrumb Navigation */}
          <div className="md:hidden pb-3 border-t border-gray-100 mt-3">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500 flex items-center font-circular">
                <span className="text-xs mr-1">📍</span>
                Navigate:
              </span>
              <div className="flex items-center space-x-1">
                <a 
                  href="#aarti-schedule" 
                  className="text-orange-600 hover:text-orange-700 transition-all duration-200 font-medium px-2 py-1 rounded-md hover:bg-orange-50 active:scale-95 font-circular"
                >
                  Aarti Schedule
                </a>
                <span className="text-gray-400 mx-1">•</span>
                <a 
                  href="#festival-events" 
                  className="text-orange-600 hover:text-orange-700 transition-all duration-200 font-medium px-2 py-1 rounded-md hover:bg-orange-50 active:scale-95 font-circular"
                >
                  Festival Events
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Event Schedule */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pb-12 lg:pb-16">
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
        </div>
      </motion.footer>
    </div>
  )
}
