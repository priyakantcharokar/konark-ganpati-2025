'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Laptop, Star, Code, Rocket, Sparkles, Sun, Moon, Users } from 'lucide-react'

interface VibeRegistration {
  fullName: string
  flatNumber: string
  websiteIdea: string
  vibeCode: string
  expectations: string
}

interface VibeRegistrationData {
  id: string
  full_name: string
  building: string
  flat: string
  website_idea: string
  vibe_code: string
  expectations: string
  created_at: string
}

export default function VibeCodingPage() {
  const [formData, setFormData] = useState<VibeRegistration>({
    fullName: '',
    flatNumber: '',
    websiteIdea: '',
    vibeCode: '',
    expectations: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [registrations, setRegistrations] = useState<VibeRegistrationData[]>([])
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true)

  const flatNumbers = [
    'A-101', 'A-102', 'A-103', 'A-104', 'A-105', 'A-106', 'A-107', 'A-108',
    'B-101', 'B-102', 'B-103', 'B-104', 'B-105', 'B-106', 'B-107', 'B-108',
    'C-101', 'C-102', 'C-103', 'C-104', 'C-105', 'C-106', 'C-107', 'C-108',
    'D-101', 'D-102', 'D-103', 'D-104', 'D-105', 'D-106', 'D-107', 'D-108',
    'E-101', 'E-102', 'E-103', 'E-104', 'E-105', 'E-106', 'E-107', 'E-108',
    'F-101', 'F-102', 'F-103', 'F-104', 'F-105', 'F-106', 'F-107', 'F-108',
    'G-101', 'G-102', 'G-103', 'G-104', 'G-105', 'G-106', 'G-107', 'G-108',
    'H-101', 'H-102', 'H-103', 'H-104', 'H-105', 'H-106', 'H-107', 'H-108'
  ]

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('vibe-coding-theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    } else {
      // Default to light mode
      setIsDarkMode(false)
    }
  }, [])

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('vibe-coding-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // Load registrations on component mount
  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      const response = await fetch('/api/vibe-registrations')
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data)
      }
    } catch (error) {
      console.error('Error loading registrations:', error)
    } finally {
      setIsLoadingRegistrations(false)
    }
  }

  const handleInputChange = (field: keyof VibeRegistration, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          eventType: 'vibe_coding'
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setFormData({
          fullName: '',
          flatNumber: '',
          websiteIdea: '',
          vibeCode: '',
          expectations: ''
        })
        // Reload registrations to show the new one
        loadRegistrations()
      } else {
        const errorData = await response.json()
        setSubmitError(errorData.message || 'Something went wrong! Please try again.')
      }
    } catch (error) {
      setSubmitError('Network error! Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackClick = () => {
    window.location.href = '/'
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Theme-based styles
  const themeStyles = {
    background: isDarkMode 
      ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' 
      : 'bg-gradient-to-br from-green-400 via-purple-500 to-yellow-400',
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    cardBg: isDarkMode 
      ? 'bg-gray-800/90 backdrop-blur-md border-gray-700' 
      : 'bg-white/90 backdrop-blur-md border-white/30',
    inputBg: isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white/50 border-gray-200 text-gray-700 placeholder-gray-500',
    floatingCode: isDarkMode 
      ? 'text-green-400 text-yellow-400 text-purple-400 text-pink-400' 
      : 'text-green-300 text-yellow-300 text-purple-300 text-pink-300'
  }

  return (
    <div className={`min-h-screen ${themeStyles.background} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Code Elements - Enhanced visibility */}
        <div className={`absolute top-20 left-10 text-xs opacity-80 animate-pulse font-mono font-bold floating-code ${isDarkMode ? 'text-green-400' : 'text-green-300'}`}>
          &lt;div&gt;Hello World!&lt;/div&gt;
        </div>
        <div className={`absolute top-40 right-20 text-xs opacity-80 animate-pulse font-mono font-bold floating-code ${isDarkMode ? 'text-purple-400' : 'text-purple-300'}`} style={{animationDelay: '1s'}}>
          function createMagic() {`{`}
        </div>
        <div className={`absolute bottom-40 left-20 text-xs opacity-80 animate-pulse font-mono font-bold floating-code ${isDarkMode ? 'text-yellow-400' : 'text-yellow-300'}`} style={{animationDelay: '2s'}}>
          const vibe = "awesome";
        </div>
        <div className={`absolute bottom-20 right-10 text-xs opacity-80 animate-pulse font-mono font-bold floating-code ${isDarkMode ? 'text-pink-400' : 'text-pink-300'}`} style={{animationDelay: '3s'}}>
          return &lt;✨/&gt;;
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <button 
              onClick={handleBackClick}
              className="text-white hover:text-yellow-300 transition-colors duration-200 mr-6 p-2 rounded-full hover:bg-white/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-white font-mono">
              🚀 Vibe Coding
            </h1>
            <button 
              onClick={toggleTheme}
              className="ml-6 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
            >
              {isDarkMode ? <Sun className="w-6 h-6 text-yellow-300" /> : <Moon className="w-6 h-6 text-white" />}
            </button>
          </div>
          
          <div className={`${themeStyles.cardBg} rounded-2xl p-6 border shadow-xl`}>
            <p className={`text-lg md:text-xl font-medium leading-relaxed font-mono ${themeStyles.text}`}>
              🚀 Welcome to Vibe Coding! Imagine building your OWN website idea and bringing your vibe to life online. 
              No boring theory, only fun + creativity. Register below to join the session!
            </p>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${themeStyles.cardBg} rounded-3xl p-8 shadow-2xl border`}
          >
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-6">🎉</div>
                <h2 className="text-3xl font-bold text-green-600 mb-4 font-mono">
                  Registration Successful!
                </h2>
                <p className={`text-lg mb-6 ${themeStyles.text}`}>
                  Your vibe has been captured! We'll see you at the coding session! 🚀
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-gradient-to-r from-green-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Register Another Idea! ✨
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className={`text-2xl font-bold text-center mb-8 font-mono ${themeStyles.text}`}>
                  <Code className="inline w-8 h-8 text-purple-600 mr-2" />
                  Join the Coding Adventure!
                </h2>

                {/* Full Name */}
                <div>
                  <label className={`block text-sm font-bold mb-2 font-mono ${themeStyles.text}`}>
                    👤 Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your awesome name!"
                    className={`w-full p-4 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 font-mono ${themeStyles.inputBg}`}
                  />
                </div>

                {/* Flat Number */}
                <div>
                  <label className={`block text-sm font-bold mb-2 font-mono ${themeStyles.text}`}>
                    🏠 Flat Number *
                  </label>
                  <select
                    required
                    value={formData.flatNumber}
                    onChange={(e) => handleInputChange('flatNumber', e.target.value)}
                    className={`w-full p-4 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-200 font-mono ${themeStyles.inputBg}`}
                  >
                    <option value="">Select your flat number</option>
                    {flatNumbers.map(flat => (
                      <option key={flat} value={flat}>{flat}</option>
                    ))}
                  </select>
                </div>

                {/* Website Idea */}
                <div>
                  <label className={`block text-sm font-bold mb-2 font-mono ${themeStyles.text}`}>
                    💡 If you want to create your own website, what would it be? *
                  </label>
                  <textarea
                    required
                    value={formData.websiteIdea}
                    onChange={(e) => handleInputChange('websiteIdea', e.target.value)}
                    placeholder="Describe your amazing website idea! (e.g., A game website, a pet blog, a music player...)"
                    rows={4}
                    className={`w-full p-4 border-2 border-green-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-200 font-mono resize-none ${themeStyles.inputBg}`}
                  />
                </div>

                {/* Vibe Code */}
                <div>
                  <label className={`block text-sm font-bold mb-2 font-mono ${themeStyles.text}`}>
                    🌟 Your vibe code (something that resembles you) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vibeCode}
                    onChange={(e) => handleInputChange('vibeCode', e.target.value)}
                    placeholder="e.g., cool gamer, nature lover, disco vibe, tech wizard..."
                    className={`w-full p-4 border-2 border-yellow-300 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-200 font-mono ${themeStyles.inputBg}`}
                  />
                </div>

                {/* Expectations */}
                <div>
                  <label className={`block text-sm font-bold mb-2 font-mono ${themeStyles.text}`}>
                    🎯 Any other expectations from this session?
                  </label>
                  <textarea
                    value={formData.expectations}
                    onChange={(e) => handleInputChange('expectations', e.target.value)}
                    placeholder="What do you hope to learn or create? (optional)"
                    rows={3}
                    className={`w-full p-4 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all duration-200 font-mono resize-none ${themeStyles.inputBg}`}
                  />
                </div>

                {/* Error Message */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg font-mono"
                  >
                    ⚠️ {submitError}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-green-500 via-purple-500 to-yellow-500 text-white py-6 px-8 rounded-2xl font-bold text-xl font-mono shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group rainbow-glow vibe-button-hover"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-purple-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Launching...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-6 h-6" />
                        🚀 Launch My Idea!
                        <Sparkles className="w-6 h-6" />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Right Side - Registrations List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`${themeStyles.cardBg} rounded-3xl p-8 shadow-2xl border`}
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                <h2 className={`text-lg md:text-2xl font-bold font-mono ${themeStyles.text}`}>
                  Registered Coders
                </h2>
                <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
              
              {/* Count Display */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-3 md:p-4 mb-6 count-glow">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 font-mono">
                  {registrations.length}
                </div>
                <div className="hidden md:block text-lg text-purple-700 font-medium">
                  Awesome Ideas Registered! 🚀
                </div>
              </div>
            </div>

            {isLoadingRegistrations ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className={`${themeStyles.text}`}>Loading registrations...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🌟</div>
                <p className={`font-mono ${themeStyles.text}`}>Be the first to register!</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your amazing idea could be next!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {registrations.map((registration, index) => (
                  <motion.div
                    key={registration.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                         className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 hover:border-purple-300 transition-all duration-200 registration-card-hover"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-bold font-mono ${themeStyles.text}`}>
                        {registration.full_name}
                      </h3>
                      <span className={`text-sm font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {registration.building}-{registration.flat}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className={`text-sm ${themeStyles.text}`}>
                        <span className="font-semibold">💡 Idea:</span> {registration.website_idea}
                      </p>
                      <p className={`text-sm ${themeStyles.text}`}>
                        <span className="font-semibold">🌟 Vibe:</span> {registration.vibe_code}
                      </p>
                      {registration.expectations && (
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span className="font-semibold">🎯 Expectations:</span> {registration.expectations}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Fun Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <div className={`${themeStyles.cardBg} rounded-2xl p-6 border`}>
            <div className="flex items-center justify-center gap-4 mb-3">
              <Laptop className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
              <Star className="w-8 h-8 text-yellow-300" />
              <Code className="w-8 h-8 text-purple-300" />
            </div>
            <p className={`font-mono text-lg ${themeStyles.text}`}>
              Ready to code your dreams into reality? Let's make magic happen! ✨
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
