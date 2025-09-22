'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Users, Calendar, Star, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export default function Home() {
  const { isDarkMode, toggleTheme, themeStyles } = useTheme()

  return (
    <div className={`min-h-screen relative`} style={{
      background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/konark.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div></div>
            <div className="text-center flex-1">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-style-script text-white leading-tight">
                Konark Exotica
              </h1>
              <h2 className="text-lg md:text-2xl lg:text-3xl font-medium font-style-script text-white leading-relaxed">
                Where Love Resides
              </h2>
            </div>
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full hover:bg-white/10 transition-all duration-200 ${themeStyles.cardBg} border ${themeStyles.border}`}
            >
              {isDarkMode ? <Sun className={`w-5 h-5 ${themeStyles.text}`} /> : <Moon className={`w-5 h-5 ${themeStyles.text}`} />}
            </button>
          </div>
          
          <div className={`${themeStyles.cardBg} rounded-xl p-6 border shadow-lg max-w-2xl mx-auto`}>
            <p className={`text-base md:text-lg font-medium leading-relaxed font-kievit ${themeStyles.text}`}>
              Welcome to <span className={`font-bold ${isDarkMode ? 'text-yellow-400' : 'text-purple-600'}`}>Konark Exotica Events</span>! 
              Choose from our community events below.
            </p>
          </div>
        </motion.div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Ganesh Pooja Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative"
          >
            <Link href="/ganesh-pooja" className="block">
              <div className={`${themeStyles.cardBg} rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                {/* Status Ribbon */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                  Event Completed
                </div>
                
                {/* Card Header */}
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">🕉️</span>
                  </div>
                  <h2 className={`text-xl font-bold mb-1 font-kievit ${themeStyles.text}`}>
                    Ganesh Pooja
                  </h2>
                  <p className={`text-sm font-kievit ${themeStyles.muted}`}>
                    Spiritual Celebration
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`text-sm font-kievit ${themeStyles.text}`}>Daily Aarti Booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`text-sm font-kievit ${themeStyles.text}`}>Event Participation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <span className={`text-sm font-kievit ${themeStyles.text}`}>Photo Gallery</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 font-kievit">
                    <span>Explore Events</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Vibe Coding Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="group relative"
          >
            <div className={`${themeStyles.cardBg} rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                {/* Status Ribbon */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Event Completed
                </div>
                
                {/* Card Header */}
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">🚀</span>
                  </div>
                  <h2 className={`text-xl font-bold mb-1 font-kievit ${themeStyles.text}`}>
                    Vibe Coding
                  </h2>
                  <p className={`text-sm font-kievit ${themeStyles.muted}`}>
                    Creative Coding for Kids 
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <span className={`text-sm font-kievit ${themeStyles.text}`}>Creative Ideas Shared</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`text-sm font-kievit ${themeStyles.text}`}>Community Built</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`text-sm font-kievit ${themeStyles.text}`}>Session Completed</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="text-center space-y-2">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <Link 
                      href="/vibe-coding/idea-cloud"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg font-medium text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-kievit"
                    >
                      <span>Idea Cloud</span>
                      <span>🌟</span>
                    </Link>
                    
                    <Link 
                      href="/vibe-coding/wall-of-fame"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-2 rounded-lg font-medium text-sm hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-kievit"
                    >
                      <span>Wall of Fame</span>
                      <span>🏆</span>
                    </Link>
                  </div>
                </div>
            </div>
          </motion.div>

          {/* Navratri Utsav Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="group relative"
          >
            <Link href="/navratri-utsav" className="block">
              <div className={`${themeStyles.cardBg} rounded-xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                {/* Status Ribbon */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                  Coming Soon
                </div>
                
                {/* Card Header */}
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">🕉️</span>
                  </div>
                  <h2 className={`text-xl font-bold mb-1 font-kievit ${themeStyles.text}`}>
                    Navratri Utsav
                  </h2>
                  <p className={`text-sm font-kievit ${themeStyles.muted}`}>
                    Nine Nights Celebration
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <span className={`text-sm font-kievit ${themeStyles.text}`}>Daily Pooja</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className={`w-4 h-4 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                    <span className={`text-sm font-kievit ${themeStyles.text}`}>Garba & Dandiya</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <span className={`text-sm font-kievit ${themeStyles.text}`}>Cultural Events</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-kievit">
                    <span>Explore Festival</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className={`${themeStyles.cardBg} rounded-xl p-4 border`}>
            <p className={`text-sm font-kievit ${themeStyles.muted}`}>
              Click on any event card above to explore and participate in our community activities.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}