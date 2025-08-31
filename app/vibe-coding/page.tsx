'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Laptop, Star, Code, Rocket, Sparkles, Sun, Moon, Users } from 'lucide-react'

interface VibeRegistration {
  fullName: string
  ageGroup: string
  flatNumber: string
  websiteIdea: string
  vibeCode: string
  expectations: string
}

interface VibeRegistrationData {
  id: string
  full_name: string
  age_group: string
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
    ageGroup: '',
    flatNumber: '',
    websiteIdea: '',
    vibeCode: '',
    expectations: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showWhatsAppInvite, setShowWhatsAppInvite] = useState(false)
  const [showRegistrationsPopup, setShowRegistrationsPopup] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [registrations, setRegistrations] = useState<VibeRegistrationData[]>([])
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true)

  const [allFlats, setAllFlats] = useState<string[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [flatNumbers, setFlatNumbers] = useState<string[]>([])

  // Load flat numbers from JSON file
  useEffect(() => {
    const loadFlatNumbers = async () => {
      try {
        const response = await fetch('/flats.json')
        const data = await response.json()
        setAllFlats(data.flats || [])
      } catch (error) {
        console.error('Error loading flat numbers:', error)
        // Fallback to default flats if JSON fails to load
        setAllFlats([
          'A101', 'A102', 'A103', 'A104', 'A201', 'A202', 'A203', 'A204',
          'B101', 'B102', 'B103', 'B104', 'B201', 'B202', 'B203', 'B204',
          'C101', 'C102', 'C103', 'C104', 'C201', 'C202', 'C203', 'C204',
          'D101', 'D102', 'D103', 'D104', 'D201', 'D202', 'D203', 'D204'
        ])
      }
    }
    loadFlatNumbers()
  }, [])

  // Get unique buildings from all flats
  const buildings = useMemo(() => {
    const buildingSet = new Set(allFlats.map(flat => flat.charAt(0)))
    return Array.from(buildingSet).sort()
  }, [allFlats])

  // Filter flats based on selected building
  useEffect(() => {
    if (selectedBuilding) {
      const filteredFlats = allFlats.filter(flat => flat.charAt(0) === selectedBuilding)
      setFlatNumbers(filteredFlats)
      // Reset flat number selection when building changes
      handleInputChange('flatNumber', '')
    } else {
      setFlatNumbers([])
    }
  }, [selectedBuilding, allFlats])

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('vibe-coding-theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    } else {
      // Default to dark mode
      setIsDarkMode(true)
    }
  }, [])

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('vibe-coding-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // Load registrations on component mount
  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Component mounted - loading registrations...')
      await loadRegistrations()
    }
    loadData()
  }, [])

  const loadRegistrations = async () => {
    try {
      console.log('📡 Fetching registrations from API...')
      setIsLoadingRegistrations(true)
      
      const response = await fetch('/api/vibe-registrations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache' // Ensure fresh data
      })
      
      console.log('📊 Response status:', response.status, response.statusText)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Successfully loaded registrations:', data.length, 'records')
        setRegistrations(data)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Failed to load registrations:', response.status, response.statusText, errorData)
        
        // If it's an RLS error, show a helpful message
        if (errorData.code === '42501') {
          console.error('🔒 RLS policy is blocking data access. Please run the SQL fix.')
        }
        
        // Set empty array to show no registrations
        setRegistrations([])
      }
    } catch (error) {
      console.error('💥 Network error loading registrations:', error)
      setRegistrations([])
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

    // Optimistically add the new registration to the list
    const optimisticRegistration = {
      id: `temp-${Date.now()}`,
      full_name: formData.fullName,
      age_group: formData.ageGroup,
      building: formData.flatNumber.charAt(0),
      flat: formData.flatNumber.substring(1),
      website_idea: formData.websiteIdea,
      vibe_code: formData.vibeCode,
      expectations: formData.expectations,
      created_at: new Date().toISOString()
    }
    
    // Add to registrations immediately for instant UI update
    setRegistrations(prev => [optimisticRegistration, ...prev])

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
        const result = await response.json()
        console.log('✅ Form submitted successfully:', result)
        
        setSubmitSuccess(true)
        setShowWhatsAppInvite(true)
        setFormData({
          fullName: '',
          ageGroup: '',
          flatNumber: '',
          websiteIdea: '',
          vibeCode: '',
          expectations: ''
        })
        // Reset building selection
        setSelectedBuilding('')
        setFlatNumbers([])
        
        // Immediately reload registrations to get the real data from server
        console.log('🔄 Immediately reloading registrations...')
        await loadRegistrations()
        console.log('✅ Registrations reloaded successfully after submission')
      } else {
        // Remove optimistic registration if submission failed
        setRegistrations(prev => prev.filter(r => r.id !== optimisticRegistration.id))
        const errorData = await response.json()
        setSubmitError(errorData.message || 'Something went wrong! Please try again.')
      }
    } catch (error) {
      // Remove optimistic registration if network error
      setRegistrations(prev => prev.filter(r => r.id !== optimisticRegistration.id))
      console.error('Form submission error:', error)
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

  const handleCountCardClick = () => {
    setShowRegistrationsPopup(true)
  }

  const closeRegistrationsPopup = () => {
    setShowRegistrationsPopup(false)
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
          <div className="flex items-center justify-between mb-6 px-2">
            <button 
              onClick={handleBackClick}
              className="text-white hover:text-yellow-300 transition-colors duration-200 p-2 rounded-full hover:bg-white/20 flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-mono text-center flex-1 px-2 whitespace-nowrap">
              🚀 Vibe Coding
            </h1>
            <button 
              onClick={toggleTheme}
              className="text-white hover:text-yellow-300 transition-colors duration-200 p-2 rounded-full hover:bg-white/20 flex-shrink-0"
            >
              {isDarkMode ? <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" /> : <Moon className="w-5 h-5 md:w-6 md:h-6 text-white" />}
            </button>
          </div>
          
                           <div className={`${themeStyles.cardBg} rounded-2xl p-6 border shadow-xl`}>
                   <p className={`text-lg md:text-xl font-medium leading-relaxed font-mono ${themeStyles.text}`}>
                     🚀 Welcome to <span className={`font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>Exoticas Vibe Coding</span>! 
                     Calling all <span className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>Exoticans kids</span> - imagine building your OWN website idea and bringing your vibe to life online. 
                     No boring theory, only fun + creativity. Register below to join the exclusive Exoticas coding session!
                   </p>
                 </div>
        </motion.div>

        {/* Mobile Count Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:hidden mb-8"
        >
          <div className={`${themeStyles.cardBg} rounded-2xl p-6 border shadow-xl`}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="w-6 h-6 text-purple-600" />
                <h2 className={`text-lg font-bold font-mono ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Awesome Vibers Registered!
                </h2>
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              
              {/* Mobile Count Display */}
              <div 
                onClick={handleCountCardClick}
                className={`bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 count-glow cursor-pointer hover:scale-105 transition-all duration-300 ${
                  isDarkMode 
                    ? 'from-gray-800 to-gray-900 border border-gray-600' 
                    : ''
                }`}
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-4xl font-bold font-mono ${
                    isDarkMode ? 'text-white' : 'text-purple-600'
                  }`}>
                    {registrations.length}
                  </div>
                  <div className={`text-sm mt-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-purple-600'
                  }`}>
                    🚀 Ready to code! 🚀
                  </div>
                  <div className={`text-xs mt-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-purple-600'
                  }`}>
                    👆 Tap to see details
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${themeStyles.cardBg} rounded-3xl p-8 shadow-2xl border min-h-[600px] flex flex-col`}
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
                  onClick={() => {
                    setSubmitSuccess(false)
                    setShowWhatsAppInvite(false)
                  }}
                  className="bg-gradient-to-r from-green-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Register Another Idea! ✨
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                <h2 className={`text-2xl font-bold text-center mb-8 font-mono ${themeStyles.text}`}>
                  <Code className="inline w-8 h-8 text-purple-600 mr-2" />
                  Join the Coding Adventure!
                </h2>

                {/* Full Name */}
                <div className="group">
                  <label className={`block text-sm font-bold mb-3 font-mono ${themeStyles.text} group-hover:text-purple-600 transition-colors duration-200`}>
                    👤 Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your awesome name!"
                      className={`w-full p-4 pl-12 border-2 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 font-mono text-sm md:text-base ${themeStyles.inputBg} hover:border-purple-400 group-hover:shadow-lg`}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Age Group Selection */}
                <div className="group">
                  <label className={`block text-sm font-bold mb-3 font-mono ${themeStyles.text} group-hover:text-purple-600 transition-colors duration-200`}>
                    🎂 What's your age group? *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('ageGroup', '10-13')}
                      className={`px-6 py-4 rounded-2xl font-bold text-lg font-mono transition-all duration-300 hover:scale-105 building-button ${
                        formData.ageGroup === '10-13'
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg building-selected'
                          : isDarkMode 
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-2 border-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                      }`}
                    >
                      🧒 I am between 10 to 13
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('ageGroup', '13+')}
                      className={`px-6 py-4 rounded-2xl font-bold text-lg font-mono transition-all duration-300 hover:scale-105 building-button ${
                        formData.ageGroup === '13+'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg building-selected'
                          : isDarkMode 
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-2 border-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                      }`}
                    >
                      I am 13 to 16
                    </button>
                  </div>
                </div>

                {/* Building Selection */}
                <div className="group">
                  <label className={`block text-sm font-bold mb-3 font-mono ${themeStyles.text} group-hover:text-purple-600 transition-colors duration-200`}>
                    🏢 Select Building *
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-4">
                    {buildings.map(building => (
                                          <button
                      key={building}
                      type="button"
                      onClick={() => setSelectedBuilding(building)}
                      className={`px-3 py-2 rounded-xl font-bold text-sm font-mono building-button ${
                        selectedBuilding === building
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg building-selected'
                          : isDarkMode 
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border-2 border-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                      }`}
                    >
                      {building}
                    </button>
                    ))}
                  </div>
                </div>

                {/* Flat Number */}
                <div className="group">
                  <label className={`block text-sm font-bold mb-3 font-mono ${themeStyles.text} group-hover:text-purple-600 transition-colors duration-200`}>
                    🏠 Select Flat Number *
                  </label>
                  <div className="relative">
                    <select
                      required
                      disabled={!selectedBuilding}
                      value={formData.flatNumber}
                      onChange={(e) => handleInputChange('flatNumber', e.target.value)}
                      className={`w-full p-4 pl-12 border-2 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 font-mono ${themeStyles.inputBg} hover:border-purple-400 group-hover:shadow-lg appearance-none cursor-pointer ${
                        !selectedBuilding ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <option value="">
                        {selectedBuilding ? `Select flat in Building ${selectedBuilding}` : 'Please select a building first'}
                      </option>
                      {flatNumbers.map(flat => (
                        <option key={flat} value={flat}>{flat}</option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-500 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {!selectedBuilding && (
                    <p className="text-sm text-gray-500 mt-2 font-mono">
                      💡 First select your building above, then choose your flat number
                    </p>
                  )}
                </div>

                {/* Website Idea */}
                <div className="group">
                  <label className={`block text-sm font-bold mb-3 font-mono ${themeStyles.text} group-hover:text-green-600 transition-colors duration-200`}>
                    💡 If you want to create your own website, what would it be? *
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      value={formData.websiteIdea}
                      onChange={(e) => handleInputChange('websiteIdea', e.target.value)}
                      placeholder="Describe your amazing website idea! (e.g., A game website, a pet blog, a music player...)"
                      rows={4}
                      className={`w-full p-4 pl-12 border-2 border-green-300 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 font-mono text-sm md:text-base resize-none ${themeStyles.inputBg} hover:border-green-400 group-hover:shadow-lg`}
                    />
                    <div className="absolute left-4 top-6 text-green-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Vibe Code */}
                <div className="group">
                  <label className={`block text-sm font-bold mb-3 font-mono ${themeStyles.text} group-hover:text-yellow-600 transition-colors duration-200`}>
                    🌟 Your vibe code (something that resembles you) / Avatar name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.vibeCode}
                      onChange={(e) => handleInputChange('vibeCode', e.target.value)}
                      placeholder="e.g., cool gamer, nature lover, disco vibe, tech wizard..."
                      className={`w-full p-4 pl-12 border-2 border-yellow-300 rounded-2xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 font-mono text-sm md:text-base ${themeStyles.inputBg} hover:border-yellow-400 group-hover:shadow-lg`}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expectations */}
                <div className="group">
                  <label className={`block text-sm font-bold mb-3 font-mono ${themeStyles.text} group-hover:text-pink-600 transition-colors duration-200`}>
                    🎯 Any other expectations from this session?
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.expectations}
                      onChange={(e) => handleInputChange('expectations', e.target.value)}
                      placeholder="What do you hope to learn or create? (optional)"
                      rows={3}
                      className={`w-full p-4 pl-12 border-2 border-pink-300 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all duration-300 font-mono text-sm md:text-base resize-none ${themeStyles.inputBg} hover:border-pink-400 group-hover:shadow-lg`}
                    />
                    <div className="absolute left-4 top-6 text-pink-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
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
                  className="w-full bg-gradient-to-r from-green-500 via-purple-500 to-yellow-500 text-white py-6 px-8 rounded-2xl font-bold text-xl font-mono shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group rainbow-glow vibe-button-hover mt-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-purple-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm md:text-xl">Launching...</span>
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="text-sm md:text-xl">🚀 Launch My Idea!</span>
                        <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            )}

            {/* WhatsApp Group Invite */}
            {showWhatsAppInvite && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`${themeStyles.cardBg} rounded-3xl p-8 shadow-2xl border border-green-300 mt-6`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className={`text-xl font-bold font-mono mb-3 ${themeStyles.text}`}>
                    🎉 Registration Successful!
                  </h3>
                  <p className={`text-base mb-6 font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Welcome to the Exoticas Vibe Coding community! Join our WhatsApp group to stay connected with fellow coders and get updates about the session.
                  </p>
                  
                  <a
                    href="https://chat.whatsapp.com/J0tp1htbF0j7hVYemqOB6l?mode=ems_copy_c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-2xl font-bold text-lg font-mono shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-2xl">💬</span>
                    Join WhatsApp Group
                    <span className="text-2xl">🚀</span>
                  </a>
                  
                  <p className={`text-sm mt-4 font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Group: <strong>🚀 Exotica Vibe Coders</strong>
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Side - Registrations List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`${themeStyles.cardBg} rounded-3xl p-8 shadow-2xl border hidden lg:block min-h-[600px] flex flex-col`}
          >
            <div className="text-center mb-6">
              <div className="hidden lg:flex items-center justify-center gap-3 mb-4">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                <h2 className={`text-lg md:text-2xl font-bold font-mono ${themeStyles.text}`}>
                  Registered Coders
                </h2>
                <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
              
              {/* Count Display */}
              <div className={`bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 md:p-6 mb-6 count-glow ${
                isDarkMode 
                  ? 'from-gray-800 to-gray-900 border border-gray-600' 
                  : ''
              }`}>
                <div className="text-center mb-3">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className={`text-4xl md:text-6xl font-bold font-mono ${
                    isDarkMode ? 'text-white' : 'text-purple-600'
                  }`}>
                    {registrations.length}
                  </div>
                </div>
                <div className="hidden lg:block text-center">
                  <div className={`text-lg font-medium mb-1 ${
                    isDarkMode ? 'text-gray-200' : 'text-purple-700'
                  }`}>
                    Awesome Vibers Registered!
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-purple-600'
                  }`}>
                    🚀 Ready to code! 🚀
                  </div>
                </div>
              </div>
            </div>

            {isLoadingRegistrations ? (
              <div className="space-y-4 flex-1">
                {/* Skeleton Count Display */}
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-4 md:p-6 mb-6 animate-pulse">
                  <div className="text-center mb-3">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-full mx-auto mb-3 animate-pulse"></div>
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-300 rounded-lg mx-auto animate-pulse"></div>
                  </div>
                  <div className="hidden lg:block text-center">
                    <div className="w-32 h-6 bg-gray-300 rounded mx-auto mb-2 animate-pulse"></div>
                    <div className="w-24 h-4 bg-gray-300 rounded mx-auto animate-pulse"></div>
                  </div>
                </div>
                
                {/* Skeleton Registration Cards */}
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl p-4 border border-gray-300 animate-pulse"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
                          <div className="w-32 h-3 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="w-8 h-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-full h-3 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-3/4 h-3 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🌟</div>
                <p className={`font-mono ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Be the first to register!</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your amazing idea could be next!</p>
              </div>
            ) : (
              <div className="space-y-4 flex-1 overflow-y-auto">
                {registrations.map((registration, index) => {
                  const isOptimistic = registration.id.startsWith('temp-')
                  return (
                    <motion.div
                      key={registration.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 hover:border-purple-300 transition-all duration-300 registration-card-hover ${
                        isDarkMode ? 'from-gray-700 to-gray-800 border-gray-600' : ''
                      } ${isOptimistic ? 'animate-pulse border-yellow-400' : ''}`}
                    >
                     <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                           {registration.vibe_code.charAt(0).toUpperCase()}
                         </div>
                         <div>
                           <h3 className={`font-bold font-mono text-base ${
                             isDarkMode ? 'text-white' : 'text-gray-800'
                           }`}>
                             {registration.vibe_code}
                           </h3>
                           <span className={`text-sm font-mono ${
                             isDarkMode ? 'text-gray-300' : 'text-gray-600'
                           }`}>
                             {registration.full_name} • {registration.building}-{registration.flat}
                           </span>
                         </div>
                       </div>
                       <div className={`text-xs font-mono ${
                         isDarkMode ? 'text-gray-400' : 'text-gray-500'
                       }`}>
                         #{index + 1}
                       </div>
                     </div>
                     <div className="flex items-start gap-2">
                       <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                         isDarkMode ? 'bg-green-800' : 'bg-green-100'
                       }`}>
                         <span className={`text-xs ${isDarkMode ? 'text-green-200' : 'text-green-600'}`}>💡</span>
                       </div>
                       <div className="flex-1">
                         <p className={`text-sm line-clamp-2 ${
                           isDarkMode ? 'text-gray-200' : 'text-gray-800'
                         }`}>{registration.website_idea}</p>
                       </div>
                     </div>
                     {isOptimistic && (
                       <div className="mt-2 text-center">
                         <span className="text-xs text-yellow-600 font-mono animate-pulse">
                           ⏳ Saving...
                         </span>
                       </div>
                     )}
                   </motion.div>
                 )
               })}
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
            <p className={`font-mono text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Ready to code your dreams into reality? Let's make magic happen! ✨
            </p>
          </div>
        </motion.div>
      </div>

      {/* Registrations Popup */}
      {showRegistrationsPopup && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={closeRegistrationsPopup}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <div className={`${themeStyles.cardBg} rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl border`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h2 className={`text-xl font-bold font-mono ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    Registered Vibers
                  </h2>
                </div>
                <button
                  onClick={closeRegistrationsPopup}
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {isLoadingRegistrations ? (
                  <div className="space-y-4">
                    {/* Skeleton Registration Cards for Popup */}
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl p-4 border border-gray-300 animate-pulse"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="space-y-1">
                              <div className="w-16 h-3 bg-gray-300 rounded animate-pulse"></div>
                              <div className="w-24 h-2 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                          </div>
                          <div className="w-6 h-2 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
                          <div className="flex-1 space-y-1">
                            <div className="w-full h-2 bg-gray-300 rounded animate-pulse"></div>
                            <div className="w-2/3 h-2 bg-gray-300 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🌟</div>
                    <p className={`font-mono ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Be the first to register!</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your amazing idea could be next!</p>
                  </div>
                ) : (
                  registrations.map((registration, index) => {
                    const isOptimistic = registration.id.startsWith('temp-')
                    return (
                      <motion.div
                        key={registration.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 hover:border-purple-300 transition-all duration-300 ${
                          isDarkMode ? 'from-gray-700 to-gray-800 border-gray-600' : ''
                        } ${isOptimistic ? 'animate-pulse border-yellow-400' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {registration.vibe_code.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className={`font-bold font-mono text-sm ${
                                isDarkMode ? 'text-white' : 'text-gray-800'
                              }`}>
                                {registration.vibe_code}
                              </h3>
                              <span className={`text-xs font-mono ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>
                                {registration.full_name} • {registration.building}-{registration.flat}
                              </span>
                            </div>
                          </div>
                          <div className={`text-xs font-mono ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            #{index + 1}
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isDarkMode ? 'bg-green-800' : 'bg-green-100'
                          }`}>
                            <span className={`text-xs ${isDarkMode ? 'text-green-200' : 'text-green-600'}`}>💡</span>
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs line-clamp-2 ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>{registration.website_idea}</p>
                          </div>
                        </div>
                        {isOptimistic && (
                          <div className="mt-2 text-center">
                            <span className="text-xs text-yellow-600 font-mono animate-pulse">
                              ⏳ Saving...
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className={`text-sm font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total: <strong>{registrations.length}</strong> vibers registered
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
