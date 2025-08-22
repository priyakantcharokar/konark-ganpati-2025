'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EventSchedule from '../components/EventSchedule'

export default function Home() {
  const [userData] = useState({ flatNumber: 'Guest', phone: 'Visitor' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Main Content - Event Schedule */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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
        className="bg-white border-t border-gray-200 py-8 mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600" style={{ fontFamily: 'Charter, serif' }}>
            © 2025 Ganesh Pooja Festival. Made with ❤️ for our community.
          </p>
          <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Söhne, sans-serif' }}>
            Most events will be held after 7 PM to ensure maximum participation.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
