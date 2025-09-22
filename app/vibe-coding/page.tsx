'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Laptop, Star, Code, Rocket, Sparkles, Sun, Moon, Users, RefreshCw } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import Link from 'next/link'

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
  const [registrations, setRegistrations] = useState<VibeRegistrationData[]>([])
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true)
  const { isDarkMode, toggleTheme, themeStyles } = useTheme()

  const [allFlats, setAllFlats] = useState<string[]>([])
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [flatNumbers, setFlatNumbers] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

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

  // Load registrations on component mount with force refresh
  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Component mounted - loading registrations with force refresh...')
      await loadRegistrations(true)
    }
    loadData()
  }, [])

  const loadRegistrations = async (forceRefresh = false) => {
    try {
      console.log('📡 Fetching registrations from API...', forceRefresh ? '(FORCE REFRESH)' : '')
      setIsLoadingRegistrations(true)
      
      // Add multiple cache-busting parameters to prevent any caching
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(7)
      const url = `/api/vibe-registrations?t=${timestamp}&r=${randomId}&_cb=${Date.now()}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': '0',
          'If-None-Match': '*'
        },
        cache: 'no-store', // Ensure fresh data
        credentials: 'omit' // Prevent cookie-based caching
      })
      
      console.log('📊 Response status:', response.status, response.statusText)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Successfully loaded registrations:', data.length, 'records')
        console.log('📊 Sample registration data:', data[0]) // Debug: log first registration
        
        // Validate data structure
        if (Array.isArray(data)) {
          // Clean and normalize data to ensure consistency
          const cleanData = data.map(registration => ({
            ...registration,
            // Ensure all fields are clean strings
            id: String(registration.id || ''),
            full_name: String(registration.full_name || '').trim(),
            age_group: String(registration.age_group || 'Unknown').trim(),
            building: String(registration.building || '').trim(),
            flat: String(registration.flat || '').trim(),
            website_idea: String(registration.website_idea || '').trim(),
            vibe_code: String(registration.vibe_code || '').trim(),
            expectations: String(registration.expectations || '').trim()
          }))
          setRegistrations(cleanData)
        } else {
          console.error('❌ Invalid data format received:', typeof data)
          setRegistrations([])
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ Failed to load registrations:', response.status, response.statusText, errorData)
        
        // If it's an RLS error, show a helpful message
        if (errorData.error?.includes('RLS Policy Error')) {
          console.error('🔒 RLS policy is blocking data access. Please check database policies.')
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
    // Registration is disabled - event completed
    console.log('Form input disabled - event completed')
    return
  }

  // Validation functions
  const validateFullName = (name: string): { isValid: boolean; error: string } => {
    if (!name.trim()) {
      return { isValid: false, error: 'Full name is required' }
    }
    if (name.length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters long' }
    }
    if (name.length > 50) {
      return { isValid: false, error: 'Name must be less than 50 characters' }
    }
    // Only allow letters, spaces, and common name characters (no special symbols)
    const nameRegex = /^[a-zA-Z\s\.\-']+$/
    if (!nameRegex.test(name)) {
      return { isValid: false, error: 'Name can only contain letters, spaces, dots, hyphens, and apostrophes' }
    }
    return { isValid: true, error: '' }
  }

  const validateVibeCode = (vibeCode: string): { isValid: boolean; error: string } => {
    if (!vibeCode.trim()) {
      return { isValid: false, error: 'Vibe code is required' }
    }
    if (vibeCode.length < 3) {
      return { isValid: false, error: 'Vibe code must be at least 3 characters long' }
    }
    if (vibeCode.length > 30) {
      return { isValid: false, error: 'Vibe code must be less than 30 characters' }
    }
    // Allow letters, numbers, spaces, and some special characters for creative names
    const vibeCodeRegex = /^[a-zA-Z0-9\s\-_!@#$%^&*()]+$/
    if (!vibeCodeRegex.test(vibeCode)) {
      return { isValid: false, error: 'Vibe code can contain letters, numbers, spaces, and common symbols' }
    }
    return { isValid: true, error: '' }
  }

  const validateWebsiteIdea = (idea: string): { isValid: boolean; error: string } => {
    if (!idea.trim()) {
      return { isValid: false, error: 'Website idea is required' }
    }
    if (idea.length < 5) {
      return { isValid: false, error: 'Website idea must be at least 5 characters long' }
    }
    if (idea.length > 100) {
      return { isValid: false, error: 'Website idea must be less than 100 characters' }
    }
    // Allow most characters except potentially harmful ones
    const ideaRegex = /^[a-zA-Z0-9\s\-_!@#$%^&*()\[\]{}|\\:;"'<>?,.\/+=]+$/
    if (!ideaRegex.test(idea)) {
      return { isValid: false, error: 'Website idea contains invalid characters' }
    }
    return { isValid: true, error: '' }
  }

  const validateExpectations = (expectations: string): { isValid: boolean; error: string } => {
    if (expectations.length > 300) {
      return { isValid: false, error: 'Expectations must be less than 300 characters' }
    }
    // Allow most characters except potentially harmful ones
    const expectationsRegex = /^[a-zA-Z0-9\s\-_!@#$%^&*()\[\]{}|\\:;"'<>?,.\/+=]+$/
    if (expectations && !expectationsRegex.test(expectations)) {
      return { isValid: false, error: 'Expectations contains invalid characters' }
    }
    return { isValid: true, error: '' }
  }

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}
    
    const nameValidation = validateFullName(formData.fullName)
    if (!nameValidation.isValid) {
      errors.fullName = nameValidation.error
    }
    
    if (!formData.ageGroup) {
      errors.ageGroup = 'Age group is required'
    }
    
    if (!formData.flatNumber) {
      errors.flatNumber = 'Flat number is required'
    }
    
    const vibeCodeValidation = validateVibeCode(formData.vibeCode)
    if (!vibeCodeValidation.isValid) {
      errors.vibeCode = vibeCodeValidation.error
    }
    
    const websiteIdeaValidation = validateWebsiteIdea(formData.websiteIdea)
    if (!websiteIdeaValidation.isValid) {
      errors.websiteIdea = websiteIdeaValidation.error
    }
    
    const expectationsValidation = validateExpectations(formData.expectations)
    if (!expectationsValidation.isValid) {
      errors.expectations = expectationsValidation.error
    }
    
    return { isValid: Object.keys(errors).length === 0, errors }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Registration is disabled - event completed
    console.log('Registration disabled - event completed')
    return
  }

  const handleBackClick = () => {
    window.location.href = '/'
  }

  const closeRegistrationsPopup = () => {
    setShowRegistrationsPopup(false)
  }

  // Add keyboard shortcut for force refresh (Ctrl/Cmd + R)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault()
        console.log('🔄 Keyboard shortcut triggered - force refreshing data...')
        loadRegistrations(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-green-400 via-purple-500 to-yellow-400'} relative`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Code Elements - Enhanced visibility */}
        <div className={`absolute top-20 left-10 text-xs opacity-80 animate-pulse font-orbitron font-bold floating-code ${isDarkMode ? 'text-green-400' : 'text-green-300'}`}>
          &lt;div&gt;Hello World!&lt;/div&gt;
        </div>
        <div className={`absolute top-40 right-20 text-xs opacity-80 animate-pulse font-orbitron font-bold floating-code ${isDarkMode ? 'text-purple-400' : 'text-purple-300'}`} style={{animationDelay: '1s'}}>
          function createMagic() {`{`}
        </div>
        <div className={`absolute bottom-40 left-20 text-xs opacity-80 animate-pulse font-orbitron font-bold floating-code ${isDarkMode ? 'text-yellow-400' : 'text-yellow-300'}`} style={{animationDelay: '2s'}}>
          const vibe = "awesome";
        </div>
        <div className={`absolute bottom-20 right-10 text-xs opacity-80 animate-pulse font-orbitron font-bold floating-code ${isDarkMode ? 'text-pink-400' : 'text-pink-300'}`} style={{animationDelay: '3s'}}>
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
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => loadRegistrations(true)}
                disabled={isLoadingRegistrations}
                className="text-white hover:text-yellow-300 transition-colors duration-200 p-2 rounded-full hover:bg-white/20 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                title={isLoadingRegistrations ? "Refreshing..." : "Force refresh data (Ctrl/Cmd + R)"}
              >
                <RefreshCw className={`w-5 h-5 md:w-6 md:h-6 ${isLoadingRegistrations ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={toggleTheme}
                className="text-white hover:text-yellow-300 transition-colors duration-200 p-2 rounded-full hover:bg-white/20 flex-shrink-0"
              >
                {isDarkMode ? <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" /> : <Moon className="w-5 h-5 md:w-6 md:h-6 text-white" />}
              </button>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-orbitron text-center mb-6 whitespace-nowrap">
            🚀 Vibe Coding{' '}
            <Link 
              href="/about-me"
              className="text-yellow-300 hover:text-yellow-200 transition-colors duration-200 underline decoration-2 underline-offset-4 hover:decoration-yellow-200"
              title="Click to know why me?"
            > 
            </Link>
          </h1>
          
          {/* Event Completed Banner */}
          <div className={`${themeStyles.cardBg} rounded-2xl p-6 border shadow-xl mb-6 border-green-300`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h2 className={`text-2xl font-bold font-orbitron mb-3 ${themeStyles.text}`}>
                🎉 Event Completed Successfully!
              </h2>
              <p className={`text-lg font-orbitron ${themeStyles.text} mb-4`}>
                Thank you to all the amazing creative minds who participated in our Vibe Coding session!
              </p>
              <div className={`text-sm font-orbitron ${themeStyles.muted}`}>
                Registration is now closed. You can still view the creative ideas and community we built together.
              </div>
            </div>
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
                <h2 className={`text-lg font-bold font-orbitron ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Your friends are joining! 👥
                </h2>
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              
              {/* Mobile Count Display */}
              <div className={`${themeStyles.cardBg} rounded-2xl p-4 count-glow ${isLoadingRegistrations ? 'animate-pulse' : ''}`}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className={`w-6 h-6 text-white ${isLoadingRegistrations ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className={`text-4xl font-bold font-orbitron transition-all duration-300 ${
                    isDarkMode ? 'text-white' : 'text-purple-600'
                  } ${isLoadingRegistrations ? 'animate-pulse' : ''}`}>
                    {isLoadingRegistrations ? '...' : registrations.length}
                  </div>
                  <div className={`text-sm mt-2 ${themeStyles.text}`}>
                    🚀 Ready to code! 🚀
                  </div>
                  {isLoadingRegistrations && (
                    <div className="text-xs text-gray-500 mt-2 font-orbitron animate-pulse">
                      🔄 Loading...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Side - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${themeStyles.cardBg} rounded-3xl p-8 shadow-2xl border min-h-[600px] flex flex-col`}
          >
            {/* Nominations Closed - Event Completed */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-6">🚫</div>
              <h2 className="text-3xl font-bold text-red-600 mb-4 font-orbitron">
                Nominations Closed
              </h2>
              <p className={`text-lg mb-6 ${themeStyles.text}`}>
                The Vibe Coding event nominations are now closed! Thank you to all participants.
              </p>
              <div className={`text-sm ${themeStyles.muted} mb-6`}>
                You can still explore the creative ideas shared by our amazing community.
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/vibe-coding/idea-cloud"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-orbitron"
                >
                  <span>View Idea Cloud</span>
                  <span>🌟</span>
                </Link>
                
                <Link 
                  href="/vibe-coding/wall-of-fame"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-orbitron"
                >
                  <span>Wall of Fame</span>
                  <span>🏆</span>
                </Link>
              </div>
            </motion.div>
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
                <h2 className={`text-lg md:text-2xl font-bold font-orbitron ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Registered Coders
                </h2>
                <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                <button
                  onClick={() => loadRegistrations(true)}
                  disabled={isLoadingRegistrations}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDarkMode 
                      ? 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/30' 
                      : 'text-purple-600 hover:text-purple-700 hover:bg-purple-100'
                  }`}
                  title={isLoadingRegistrations ? "Refreshing..." : "Force refresh data"}
                >
                  <RefreshCw className={`w-5 h-5 ${isLoadingRegistrations ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              {/* Mobile/Tablet Refresh Button */}
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <Users className="w-4 h-4 text-purple-600" />
                <h2 className={`text-sm font-bold font-orbitron ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Registered Coders
                </h2>
                <Users className="w-4 h-4 text-purple-600" />
                <button
                  onClick={() => loadRegistrations(true)}
                  disabled={isLoadingRegistrations}
                  className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDarkMode 
                      ? 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/30' 
                      : 'text-purple-600 hover:text-purple-700 hover:bg-purple-100'
                  }`}
                  title={isLoadingRegistrations ? "Refreshing..." : "Force refresh data"}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRegistrations ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              {/* Count Display */}
              <div className={`${themeStyles.cardBg} rounded-2xl p-4 md:p-6 mb-6 count-glow ${isLoadingRegistrations ? 'animate-pulse' : ''}`}>
                <div className="text-center mb-3">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className={`w-6 h-6 md:w-8 md:h-8 text-white ${isLoadingRegistrations ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className={`text-4xl md:text-6xl font-bold font-orbitron transition-all duration-300 ${
                    isDarkMode ? 'text-white' : 'text-purple-600'
                  } ${isLoadingRegistrations ? 'animate-pulse' : ''}`}>
                    {isLoadingRegistrations ? '...' : registrations.length}
                  </div>
                  {isLoadingRegistrations && (
                    <div className="text-xs text-gray-500 mt-2 font-orbitron animate-pulse">
                      🔄 Fetching latest data...
                    </div>
                  )}
                </div>
                <div className="hidden lg:block text-center">
                  <div className={`text-lg font-medium mb-1 ${themeStyles.text}`}>
                    Your friends are joining! 👥
                  </div>
                  <div className={`text-sm ${themeStyles.muted}`}>
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
                <p className={`font-orbitron ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Be the first to register!</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your amazing idea could be next!</p>
              </div>
            ) : (
              <div className="space-y-4 flex-1 overflow-hidden">
                {registrations.slice(0, 7).map((registration, index) => {
                  const isOptimistic = registration.id.startsWith('temp-')
                  return (
                    <motion.div
                      key={`${registration.id}-${registration.vibe_code}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`${themeStyles.cardBg} rounded-xl p-4 border hover:border-purple-300 transition-all duration-300 registration-card-hover ${
                        isOptimistic ? 'animate-pulse border-yellow-400' : ''
                      }`}
                    >
                     <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                           {registration.vibe_code.charAt(0).toUpperCase()}
                         </div>
                         <div>
                           <h3 className={`font-bold font-orbitron text-base ${themeStyles.text}`}>
                             {registration.vibe_code}
                           </h3>
                           <span className={`text-sm font-orbitron ${themeStyles.muted}`}>
                             {registration.full_name} • {registration.building}-{registration.flat}
                           </span>
                         </div>
                       </div>
                       
                     </div>
                     <div className="flex items-start gap-2">
                       <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                         isDarkMode ? 'bg-green-800' : 'bg-green-100'
                       }`}>
                         <span className={`text-xs ${isDarkMode ? 'text-green-200' : 'text-green-600'}`}>💡</span>
                       </div>
                       <div className="flex-1">
                         <p className={`text-sm line-clamp-2 ${themeStyles.text}`}>{registration.website_idea}</p>
                       </div>
                     </div>
                     {isOptimistic && (
                       <div className="mt-2 text-center">
                         <span className="text-xs text-yellow-600 font-orbitron animate-pulse">
                           ⏳ Saving...
                         </span>
                       </div>
                     )}
                   </motion.div>
                 )
               })}
               
               {/* View More Link */}
               {registrations.length > 7 && (
                 <div className="text-center mt-6 pt-4 border-t border-gray-200">
                   <Link 
                     href="/vibe-coding/idea-cloud"
                     className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-orbitron font-medium transition-all duration-300 hover:scale-105 ${
                       isDarkMode 
                         ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl' 
                         : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                     }`}
                   >
                     <span className="text-lg">🌟</span>
                     View more ideas
                     <span className="text-lg">✨</span>
                   </Link>
                   <p className={`text-sm mt-2 font-orbitron ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                     See all {registrations.length} creative minds and their amazing ideas!
                   </p>
                 </div>
               )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Fun Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16 mb-8"
        >
          <div className={`${themeStyles.cardBg} rounded-xl p-4 border relative z-10`}>
            <div className="flex items-center justify-center gap-3 mb-2">
              <Laptop className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
              <Star className="w-5 h-5 text-yellow-300" />
              <Code className="w-5 h-5 text-purple-300" />
            </div>
            <p className={`font-orbitron text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
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
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <h2 className={`text-sm sm:text-lg font-bold font-orbitron ${
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
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-container">
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
                    <p className={`font-orbitron ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Be the first to register!</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Your amazing idea could be next!</p>
                  </div>
                ) : (
                  registrations.slice(0, 7).map((registration, index) => {
                    const isOptimistic = registration.id.startsWith('temp-')
                    return (
                      <motion.div
                        key={`mobile-${registration.id}-${registration.vibe_code}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`${themeStyles.cardBg} rounded-lg p-3 border hover:border-purple-300 transition-all duration-300 ${
                          isOptimistic ? 'animate-pulse border-yellow-400' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Left Side - User Info */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                              {registration.vibe_code.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h3 className={`font-bold font-orbitron text-xs sm:text-sm ${themeStyles.text} truncate`}>
                                {registration.vibe_code}
                              </h3>
                              <span className={`text-xs font-orbitron ${themeStyles.muted} truncate block`}>
                                {registration.full_name} • {registration.building}-{registration.flat}
                              </span>
                              <span className={`text-xs font-orbitron px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full mt-1 inline-block ${
                                registration.age_group === '10-13' 
                                  ? (isDarkMode ? 'bg-blue-600 text-blue-100' : 'bg-blue-100 text-blue-700')
                                  : (registration.age_group === '13-16' || registration.age_group === '13+')
                                    ? (isDarkMode ? 'bg-purple-600 text-purple-100' : 'bg-purple-100 text-purple-700')
                                    : registration.age_group === 'above-16'
                                      ? (isDarkMode ? 'bg-orange-600 text-orange-100' : 'bg-orange-100 text-orange-700')
                                      : (isDarkMode ? 'bg-gray-600 text-gray-100' : 'bg-gray-100 text-gray-700')
                              }`}>
                                {registration.age_group === '10-13' ? '10-13 yrs' : 
                                 registration.age_group === '13-16' || registration.age_group === '13+' ? '13-16 yrs' : 
                                 registration.age_group === 'above-16' ? 'Above 16 yrs' : 
                                 (registration.age_group || 'Unknown')}
                              </span>
                            </div>
                          </div>
                          
                          {/* Right Side - Idea */}
                          <div className="flex-1 min-w-0">
                            <div className={`rounded-md p-2 sm:p-3 border-l-3 ${
                              isDarkMode 
                                ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-400' 
                                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500'
                            }`}>
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className="text-xs sm:text-sm flex-shrink-0">💡</span>
                                <p className={`text-xs sm:text-sm font-medium ${themeStyles.text} leading-relaxed`}>
                                  {registration.website_idea}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {isOptimistic && (
                          <div className="mt-2 text-center">
                            <span className="text-xs text-yellow-600 font-orbitron animate-pulse">
                              ⏳ Saving...
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )
                  })
                )}
                
                {/* View More Link for Mobile */}
                {registrations.length > 7 && (
                  <div className="text-center mt-4 pt-4 border-t border-gray-200">
                    <Link 
                      href="/vibe-coding/idea-cloud"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-orbitron font-medium transition-all duration-300 hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <span className="text-sm">🌟</span>
                      View Idea Cloud
                      <span className="text-sm">✨</span>
                    </Link>
                    <p className={`text-xs mt-1 font-orbitron ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      See all {registrations.length} creative minds!
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className={`text-sm font-orbitron ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total: <strong>{registrations.length}</strong> vibers registered
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
      
      <style jsx>{`
        .scrollbar-container::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-container::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#374151' : '#f3f4f6'};
          border-radius: 4px;
        }
        
        .scrollbar-container::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#8b5cf6' : '#a855f7'};
          border-radius: 4px;
        }
        
        .scrollbar-container::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#7c3aed' : '#9333ea'};
        }
        
        .scrollbar-container {
          scrollbar-width: thin;
          scrollbar-color: ${isDarkMode ? '#8b5cf6 #374151' : '#a855f7 #f3f4f6'};
        }
      `}</style>
    </div>
  )
}
