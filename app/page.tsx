'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EventSchedule from '../components/EventSchedule'

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl sm:text-8xl lg:text-[130px] font-bold text-amber-800 font-style-script mb-4 leading-none"
          >
            Konark Exotica
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-red-600 font-jaf-bernino mb-6"
          >
            Ganesh Pooja <span className="font-mono tracking-wider">2025</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Experience the divine celebration with our complete festival schedule. From traditional ceremonies to exciting competitions, discover all the events planned for this auspicious occasion.
          </motion.p>

          {/* Information Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {/* Events Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-4"></div>
              <div className="text-4xl font-bold text-gray-800 mb-2 font-jaf-bernino">
                <CountUp end={24} />
              </div>
              <div className="text-gray-600 font-medium">Events</div>
            </motion.div>

            {/* Duration Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-4"></div>
              <div className="text-2xl font-bold text-gray-800 mb-2 font-mono tracking-wider">Aug <span className="font-mono tracking-wider">23</span> - Sep <span className="font-mono tracking-wider">6</span></div>
              <div className="text-gray-600 font-medium">Festival Duration</div>
            </motion.div>

            {/* Timing Card */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-4"></div>
              <div className="text-4xl font-bold text-gray-800 mb-2 font-mono tracking-wider"><span className="font-mono tracking-wider">7</span> PM</div>
              <div className="text-gray-600 font-medium">Most Events</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Daily Aarti Schedule Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
      >
       
      </motion.div>

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
