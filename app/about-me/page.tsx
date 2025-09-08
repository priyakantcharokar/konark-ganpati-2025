'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sun, Moon, Code, Heart, Star, Rocket, Users, Award, GraduationCap, Building, Lightbulb } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutMePage() {
  const { isDarkMode, toggleTheme, themeStyles } = useTheme()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const images = [
    '/about-me/iimc-pics/iimc.jpg',
    '/about-me/iimc-pics/iimc1.jpg',
    '/about-me/iimc-pics/iimc award.jpg'
  ]

  // Auto-rotate carousel every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [images.length])

  const handleBackClick = () => {
    window.location.href = '/vibe-coding'
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-green-400 via-purple-500 to-yellow-400'} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Code Elements */}
        <div className={`absolute top-20 left-10 text-xs opacity-80 animate-pulse font-mono font-bold floating-code ${isDarkMode ? 'text-green-400' : 'text-green-300'}`}>
          &lt;about&gt;Hello!&lt;/about&gt;
        </div>
        <div className={`absolute top-40 right-20 text-xs opacity-80 animate-pulse font-mono font-bold floating-code ${isDarkMode ? 'text-purple-400' : 'text-purple-300'}`} style={{animationDelay: '1s'}}>
          const passion = "coding";
        </div>
        <div className={`absolute bottom-40 left-20 text-xs opacity-80 animate-pulse font-mono font-bold floating-code ${isDarkMode ? 'text-yellow-400' : 'text-yellow-300'}`} style={{animationDelay: '2s'}}>
          return &lt;inspiration/&gt;;
        </div>
        
        {/* Floating Stars */}
        <div className="absolute top-1/4 left-1/4 text-yellow-300 text-2xl float-gentle">
          ⭐
        </div>
        <div className="absolute top-1/3 right-1/3 text-purple-300 text-xl float-gentle" style={{animationDelay: '0.5s'}}>
          ✨
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-green-300 text-2xl float-gentle" style={{animationDelay: '1s'}}>
          🌟
        </div>
        <div className="absolute bottom-1/4 right-1/4 text-pink-300 text-xl float-gentle" style={{animationDelay: '1.5s'}}>
          💫
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-6 px-2">
            <button 
              onClick={handleBackClick}
              className="text-white hover:text-yellow-300 transition-colors duration-200 p-2 rounded-full hover:bg-white/20 flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            
            {/* Konark Exotica Logo */}
            <div className="flex-1 text-center">
              <Link href="/" className="inline-block">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-style-script text-white leading-tight hover:text-yellow-300 transition-colors duration-200">
                  Konark Exotica
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium font-style-script text-white leading-relaxed">
                  Where Love Resides
                </p>
              </Link>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="text-white hover:text-yellow-300 transition-colors duration-200 p-2 rounded-full hover:bg-white/20 flex-shrink-0"
            >
              {isDarkMode ? <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" /> : <Moon className="w-5 h-5 md:w-6 md:h-6 text-white" />}
            </button>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-mono text-center mb-6 whitespace-nowrap">
            👨‍💻 About Me
          </h1>
        </motion.div>

        {/* Hero Section with Photo Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Photo Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`${themeStyles.cardBg} rounded-3xl p-6 shadow-2xl border overflow-hidden`}
          >
            <div className="relative h-80 lg:h-96">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[currentImageIndex]}
                    alt={`IIMC Photo ${currentImageIndex + 1}`}
                    fill
                    className="object-cover rounded-2xl"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
            
            
          </motion.div>

          {/* Personal Introduction */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`${themeStyles.cardBg} rounded-3xl p-8 shadow-2xl border flex flex-col justify-center`}
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍💻</span>
              </div>
              <h2 className={`text-2xl font-bold font-mono mb-3 ${themeStyles.text}`}>
                Hi, I'm Priyakant! 👋
              </h2>
              <p className={`text-lg font-mono ${themeStyles.muted}`}>
                Your coding mentor and community builder
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`${themeStyles.cardBg} rounded-xl p-4 border text-center`}>
                <GraduationCap className={`w-6 h-6 mx-auto mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                <div className={`text-lg font-bold font-mono ${themeStyles.text}`}>IIM Calcutta</div>
                <div className={`text-xs font-mono ${themeStyles.muted}`}>Alumnus</div>
              </div>
              <div className={`${themeStyles.cardBg} rounded-xl p-4 border text-center`}>
                <Building className={`w-6 h-6 mx-auto mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
                <div className={`text-lg font-bold font-mono ${themeStyles.text}`}>21+ Years</div>
                <div className={`text-xs font-mono ${themeStyles.muted}`}>IT Experience</div>
              </div>
              <div className={`${themeStyles.cardBg} rounded-xl p-4 border text-center`}>
                <Users className={`w-6 h-6 mx-auto mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                <div className={`text-lg font-bold font-mono ${themeStyles.text}`}>9+ Years</div>
                <div className={`text-xs font-mono ${themeStyles.muted}`}>Leadership</div>
              </div>
              <div className={`${themeStyles.cardBg} rounded-xl p-4 border text-center`}>
                <Award className={`w-6 h-6 mx-auto mb-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`} />
                <div className={`text-lg font-bold font-mono ${themeStyles.text}`}>Multiple</div>
                <div className={`text-xs font-mono ${themeStyles.muted}`}>Awards</div>
              </div>
            </div>

            
          </motion.div>
        </motion.div>

        {/* Detailed Story Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Education & Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`${themeStyles.cardBg} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-xl font-bold font-mono ${themeStyles.text}`}>
                Education & Experience
              </h3>
            </div>
            <p className={`text-base leading-relaxed font-mono ${themeStyles.text}`}>
              I am an <span className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>IIM Calcutta alumnus</span> with <span className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>21 years in IT</span> and over <span className={`font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>9 years in leadership roles</span>, recognized with multiple leadership awards.
            </p>
          </motion.div>

          {/* Passion & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className={`${themeStyles.cardBg} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-xl font-bold font-mono ${themeStyles.text}`}>
                Passion & Mission
              </h3>
            </div>
            <p className={`text-base leading-relaxed font-mono ${themeStyles.text}`}>
              An avid learner with a passion for giving back, I actively volunteer to help <span className={`font-bold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>underprivileged kids and students</span> understand corporate culture.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className={`${themeStyles.cardBg} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-xl font-bold font-mono ${themeStyles.text}`}>
                My Vision
              </h3>
            </div>
            <p className={`text-base leading-relaxed font-mono ${themeStyles.text}`}>
              My zeal lies in <span className={`font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>building communities</span>, <span className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>sharing knowledge</span>, and <span className={`font-bold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>inspiring the next generation</span>.
            </p>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className={`${themeStyles.cardBg} rounded-3xl p-8 border shadow-2xl bg-gradient-to-r ${isDarkMode ? 'from-purple-900/30 to-pink-900/30' : 'from-purple-100 to-pink-100'} mt-8`}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Code className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
              <Star className="w-8 h-8 text-yellow-300" />
              <Rocket className="w-8 h-8 text-purple-300" />
            </div>
            <h3 className={`text-2xl font-bold font-mono mb-3 ${themeStyles.text}`}>
              Ready to Code Together? 🚀
            </h3>
            <p className={`font-mono text-lg mb-6 ${themeStyles.muted}`}>
              Let's build something amazing and learn together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/vibe-coding"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold font-mono transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                <span>←</span>
                <span>Back to Vibe Coding</span>
                <span>💻</span>
              </Link>
              <Link 
                href="/"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold font-mono transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                }`}
              >
                <span>🏠</span>
                <span>Home</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
