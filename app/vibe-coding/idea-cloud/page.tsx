'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, Lightbulb, Users, RefreshCw, Home, Star, Code, Rocket, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import Link from 'next/link'

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

interface WordCloudItem {
  text: string
  count: number
  size: number
  color: string
  participants: VibeRegistrationData[]
}

export default function IdeaCloudPage() {
  const [registrations, setRegistrations] = useState<VibeRegistrationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [wordCloudData, setWordCloudData] = useState<WordCloudItem[]>([])
  const [selectedWord, setSelectedWord] = useState<WordCloudItem | null>(null)
  const [showParticipants, setShowParticipants] = useState(false)
  const { isDarkMode, toggleTheme, themeStyles } = useTheme()

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('')
  const [filteredRegistrations, setFilteredRegistrations] = useState<VibeRegistrationData[]>([])
  
  // Counter animation state
  const [displayCount, setDisplayCount] = useState(0)

  // Load registrations and create word cloud
  useEffect(() => {
    loadRegistrations()
  }, [])

  // Filter registrations based on search term and age group
  useEffect(() => {
    let filtered = registrations

    // Filter by search term (name, vibe code, or idea)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(registration => 
        registration.full_name.toLowerCase().includes(searchLower) ||
        registration.vibe_code.toLowerCase().includes(searchLower) ||
        registration.website_idea.toLowerCase().includes(searchLower) ||
        (registration.expectations && registration.expectations.toLowerCase().includes(searchLower))
      )
    }

    // Filter by age group
    if (selectedAgeGroup) {
      filtered = filtered.filter(registration => registration.age_group === selectedAgeGroup)
    }

    setFilteredRegistrations(filtered)
  }, [registrations, searchTerm, selectedAgeGroup])

  // Counter animation effect
  useEffect(() => {
    if (registrations.length > 0) {
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = registrations.length / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= registrations.length) {
          setDisplayCount(registrations.length)
          clearInterval(timer)
        } else {
          setDisplayCount(Math.floor(current))
        }
      }, duration / steps)
      
      return () => clearInterval(timer)
    }
  }, [registrations.length])

  const loadRegistrations = async () => {
    try {
      console.log('📡 Fetching registrations for word cloud...')
      setIsLoading(true)
      
      const timestamp = Date.now()
      const response = await fetch(`/api/vibe-registrations?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Successfully loaded registrations:', data.length, 'records')
        setRegistrations(data)
        createWordCloud(data)
      } else {
        console.error('❌ Failed to load registrations')
        setRegistrations([])
      }
    } catch (error) {
      console.error('💥 Network error loading registrations:', error)
      setRegistrations([])
    } finally {
      setIsLoading(false)
    }
  }

  const createWordCloud = (data: VibeRegistrationData[]) => {
    // Extract and process website ideas
    const wordMap = new Map<string, VibeRegistrationData[]>()
    
    // Common conjunctions and articles to filter out
    const stopWords = new Set([
      'and', 'or', 'but', 'so', 'yet', 'for', 'nor', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out',
      'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
      'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
      'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'this', 'that', 'these',
      'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his',
      'her', 'its', 'our', 'their', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
      'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'cant', 'wont',
      'dont', 'doesnt', 'didnt', 'havent', 'hasnt', 'hadnt', 'wouldnt', 'couldnt', 'shouldnt', 'mustnt'
    ])
    
    data.forEach(registration => {
      if (registration.website_idea) {
        // Split ideas into words and phrases
        const words = registration.website_idea
          .toLowerCase()
          .replace(/[^\w\s]/g, '') // Remove special characters
          .split(/\s+/)
          .filter(word => 
            word.length > 2 && // Filter short words
            !stopWords.has(word) && // Filter out conjunctions and common words
            /^[a-zA-Z]+$/.test(word) // Only alphabetic words
          )
        
        words.forEach(word => {
          if (!wordMap.has(word)) {
            wordMap.set(word, [])
          }
          wordMap.get(word)!.push(registration)
        })
      }
    })

    // Convert to word cloud items
    const wordCloudItems: WordCloudItem[] = Array.from(wordMap.entries())
      .map(([word, participants]) => ({
        text: word,
        count: participants.length,
        size: Math.min(Math.max(participants.length * 2 + 12, 16), 48), // Size based on frequency
        color: getRandomColor(),
        participants
      }))
      .sort((a, b) => b.count - a.count) // Sort by frequency
      .slice(0, 50) // Limit to top 50 words

    setWordCloudData(wordCloudItems)
  }

  const getRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleWordClick = (word: WordCloudItem) => {
    setSelectedWord(word)
    setShowParticipants(true)
  }

  const handleBackClick = () => {
    window.location.href = '/vibe-coding'
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-green-400 via-purple-500 to-yellow-400'} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Code Elements */}
        <div className={`absolute top-20 left-10 text-xs opacity-60 animate-pulse font-mono font-bold ${isDarkMode ? 'text-green-400' : 'text-green-300'}`}>
          &lt;ideas&gt;✨&lt;/ideas&gt;
        </div>
        <div className={`absolute top-40 right-20 text-xs opacity-60 animate-pulse font-mono font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-300'}`} style={{animationDelay: '1s'}}>
          wordCloud.generate()
        </div>
        <div className={`absolute bottom-40 left-20 text-xs opacity-60 animate-pulse font-mono font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-300'}`} style={{animationDelay: '2s'}}>
          creativity++
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
            
            <button 
              onClick={toggleTheme}
              className="text-white hover:text-yellow-300 transition-colors duration-200 p-2 rounded-full hover:bg-white/20 flex-shrink-0"
            >
              {isDarkMode ? <Sun className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" /> : <Moon className="w-5 h-5 md:w-6 md:h-6 text-white" />}
            </button>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-mono text-center mb-8">
            🌟 Creative Minds & Ideas 🌟
          </h1>
          
          <div className={`${themeStyles.cardBg} rounded-2xl p-6 border shadow-xl max-w-4xl mx-auto`}>
            <div className="relative">
              <p className={`text-xl md:text-2xl lg:text-3xl font-mono leading-relaxed tracking-wider ${themeStyles.text}`}>
                <span className={`${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>🎨</span> 
                <span className={`${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}> Meet our amazing </span>
                <span className={`font-bold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>creative coders</span> 
                <span className={`${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}> and their brilliant website ideas!</span> 
                <span className={`${isDarkMode ? 'text-pink-300' : 'text-pink-600'}`}> Each card showcases a unique mind and their innovative concept!</span> 
                <span className={`${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}> ✨</span>
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg blur-sm"></div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={loadRegistrations}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode 
                    ? 'text-purple-300 hover:text-purple-200 hover:bg-purple-900/30' 
                    : 'text-purple-600 hover:text-purple-700 hover:bg-purple-100'
                }`}
                title={isLoading ? "Refreshing..." : "Refresh ideas"}
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-4xl md:text-5xl lg:text-6xl font-mono font-bold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'} drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse`}>
                  {displayCount}
                </span>
                <span className={`text-lg md:text-xl font-mono tracking-wider ${themeStyles.muted}`}>
                  <span className={`${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>creative minds</span> 
                  <span className={`${isDarkMode ? 'text-green-300' : 'text-green-600'}`}> sharing their amazing ideas</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-8"
        >
          <div className={`${themeStyles.cardBg} rounded-2xl p-6 border shadow-xl max-w-4xl mx-auto`}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-3xl">🚀</span>
                <h3 className={`text-2xl md:text-3xl font-bold font-kievit ${themeStyles.text}`}>
                  Ready to Share Your Ideas?
                </h3>
                <span className="text-3xl">💡</span>
              </div>
              
              <p className={`text-lg md:text-xl font-kievit ${themeStyles.muted} mb-6 leading-relaxed`}>
                Join our amazing community of creative coders and showcase your brilliant website ideas!
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/vibe-coding"
                  className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold font-kievit text-lg transition-all duration-300 hover:scale-105 shadow-lg ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400'
                  }`}
                >
                  <Code className="w-6 h-6" />
                  Register for Vibe Coding
                  <Rocket className="w-6 h-6" />
                </Link>
                
                <div className={`text-sm font-kievit ${themeStyles.muted} px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  ✨ Free Registration • All Ages Welcome
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >

          {/* Creative Minds Gallery */}
          <div className="space-y-8">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className={`text-xl md:text-2xl font-kievit ${themeStyles.text}`}>Loading creative minds...</p>
                </div>
              </div>
            ) : registrations.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌟</div>
                  <p className={`text-xl md:text-2xl font-kievit ${themeStyles.text}`}>No creative minds yet!</p>
                  <p className={`text-lg md:text-xl font-kievit ${themeStyles.muted}`}>Be the first to share your amazing website idea!</p>
                </div>
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className={`text-xl md:text-2xl font-kievit ${themeStyles.text}`}>No results found!</p>
                  <p className={`text-lg md:text-xl font-kievit ${themeStyles.muted}`}>Try adjusting your search or filters</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredRegistrations.map((registration, index) => (
                    <motion.div
                      key={registration.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`${themeStyles.cardBg} rounded-3xl p-6 shadow-2xl border hover:shadow-3xl transition-all duration-300 cursor-pointer`}
                      onClick={() => {
                        setSelectedWord({
                          text: registration.website_idea,
                          count: 1,
                          size: 24,
                          color: getRandomColor(),
                          participants: [registration]
                        })
                        setShowParticipants(true)
                      }}
                    >
                      {/* Person Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                          {registration.vibe_code.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-xl font-bold font-kievit ${themeStyles.text}`}>
                            {registration.vibe_code}
                          </h3>
                          <p className={`text-base font-kievit ${themeStyles.muted}`}>
                            {registration.full_name}
                          </p>
                          <span className={`text-sm px-3 py-1 rounded-full mt-1 inline-block ${
                            registration.age_group === '10-13' 
                              ? (isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700')
                              : registration.age_group === '13-16' || registration.age_group === '13+'
                                ? (isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700')
                                : registration.age_group === 'above-16'
                                  ? (isDarkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-700')
                                  : (isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700')
                          }`}>
                            {registration.age_group === '10-13' ? '10-13 yrs' : 
                             registration.age_group === '13-16' || registration.age_group === '13+' ? '13-16 yrs' : 
                             registration.age_group === 'above-16' ? 'Above 16' : 
                             (registration.age_group || 'Unknown')}
                          </span>
                        </div>
                      </div>

                      {/* Idea Showcase */}
                      <div className={`bg-gradient-to-r ${isDarkMode ? 'from-green-900/30 to-emerald-900/30' : 'from-green-50 to-emerald-50'} rounded-2xl p-4 border-l-4 border-green-500`}>
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">💡</span>
                          <div className="flex-1">
                            {/* <h4 className={`text-lg font-bold font-kievit ${themeStyles.text} mb-2`}>
                              Website Idea
                            </h4> */}
                            <p className={`text-base font-kievit ${themeStyles.text} leading-relaxed`}>
                              {registration.website_idea}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {registration.expectations && (
                        <div className={`mt-4 bg-gradient-to-r ${isDarkMode ? 'from-blue-900/30 to-indigo-900/30' : 'from-blue-50 to-indigo-50'} rounded-xl p-3`}>
                          <div className="flex items-start gap-2">
                            <span className="text-lg flex-shrink-0">🎯</span>
                            <p className={`text-sm font-kievit ${themeStyles.text} leading-relaxed`}>
                              {registration.expectations}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Location */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-lg">🏠</span>
                        <span className={`text-sm font-kievit ${themeStyles.muted}`}>
                          {registration.building}-{registration.flat}
                        </span>
                      </div>

                      {/* Click Hint */}
                      <div className="mt-4 text-center">
                        <span className={`text-xs font-kievit ${themeStyles.muted} opacity-70`}>
                          👆 Click to explore more
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>

        {/* Fun Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <div className={`${themeStyles.cardBg} rounded-2xl p-6 border`}>
            <div className="flex items-center justify-center gap-4 mb-3">
              <Lightbulb className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
              <Star className="w-8 h-8 text-yellow-300" />
              <Code className="w-8 h-8 text-purple-300" />
              <Rocket className="w-8 h-8 text-pink-300" />
            </div>
            <p className={`font-kievit text-xl md:text-2xl lg:text-3xl ${themeStyles.text}`}>
              Every creative mind brings unique ideas that can change the world! ✨
            </p>
          </div>
        </motion.div>
      </div>

      {/* Participants Modal */}
      <AnimatePresence>
        {showParticipants && selectedWord && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowParticipants(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-4 z-50 flex items-center justify-center"
            >
              <div className={`${themeStyles.cardBg} rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: selectedWord.color }}
                    >
                      {selectedWord.text.charAt(0).toUpperCase()}
                    </div>
                    <h2 className={`text-2xl md:text-3xl font-bold font-kievit ${themeStyles.text}`}>
                      "{selectedWord.text}" Ideas
                    </h2>
                    <span className={`text-sm px-2 py-1 rounded-full ${isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
                      {selectedWord.count} creators
                    </span>
                  </div>
                  <button
                    onClick={() => setShowParticipants(false)}
                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Participants List */}
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {selectedWord.participants.map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`${themeStyles.cardBg} rounded-xl p-4 border hover:border-purple-300 transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {participant.vibe_code.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold font-kievit text-lg ${themeStyles.text}`}>
                            {participant.vibe_code}
                          </h3>
                          <p className={`text-base font-kievit ${themeStyles.muted}`}>
                            {participant.full_name} • {participant.building}-{participant.flat}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                            participant.age_group === '10-13' 
                              ? (isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700')
                              : participant.age_group === '13-16' || participant.age_group === '13+'
                                ? (isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700')
                                : participant.age_group === 'above-16'
                                  ? (isDarkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-700')
                                  : (isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700')
                          }`}>
                            {participant.age_group === '10-13' ? '10-13 yrs' : 
                             participant.age_group === '13-16' || participant.age_group === '13+' ? '13-16 yrs' : 
                             participant.age_group === 'above-16' ? 'Above 16' : 
                             (participant.age_group || 'Unknown')}
                          </span>
                        </div>
                      </div>
                      <div className={`mt-3 p-3 rounded-lg bg-gradient-to-r ${isDarkMode ? 'from-green-900/30 to-emerald-900/30' : 'from-green-50 to-emerald-50'} border-l-4 border-green-500`}>
                        <p className={`text-base font-medium font-kievit ${themeStyles.text}`}>
                          💡 {participant.website_idea}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="text-center">
                    <p className={`text-lg font-kievit ${themeStyles.muted}`}>
                      {selectedWord.count} creative minds thinking about "{selectedWord.text}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
