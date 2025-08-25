'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Home, Calendar, ArrowLeft, Search, Filter, Flame, Heart, Star, Flower2 } from 'lucide-react'
import { databaseService, type BhogNomination } from '@/lib/database-service'

export default function BhogList() {
  const [bhogNominations, setBhogNominations] = useState<BhogNomination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const searchParams = useSearchParams()

  const buildings = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

  // Get source information from URL parameters
  const source = searchParams.get('source')
  const eventTitle = searchParams.get('event')

  useEffect(() => {
    loadBhogNominations()
  }, [])

  const loadBhogNominations = async () => {
    setIsLoading(true)
    try {
      const nominations = await databaseService.getAllBhogNominations()
      setBhogNominations(nominations)
    } catch (error) {
      console.error('Error loading bhog nominations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNominations = bhogNominations.filter(nomination => {
    const matchesSearch = nomination.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nomination.bhog_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nomination.flat.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBuilding = !selectedBuilding || nomination.building === selectedBuilding
    return matchesSearch && matchesBuilding
  })

  const getTotalBhogOffers = () => bhogNominations.length
  const getUniqueFlats = () => new Set(bhogNominations.map(n => `${n.building}-${n.flat}`)).size

  // Handle back navigation based on source
  const handleBackNavigation = () => {
    if (source === 'events') {
      // Go back to the events page (landing page)
      window.location.href = '/'
    } else if (source === 'event-detail') {
      // Go back to the event detail page
      window.history.back()
    } else {
      // Default back to landing page
      window.location.href = '/'
    }
  }

  // Generate a beautiful gradient based on index
  const getCardGradient = (index: number) => {
    const gradients = [
      'from-orange-50 via-amber-50 to-yellow-50',
      'from-green-50 via-emerald-50 to-teal-50',
      'from-blue-50 via-indigo-50 to-purple-50',
      'from-pink-50 via-rose-50 to-red-50',
      'from-cyan-50 via-sky-50 to-blue-50',
      'from-lime-50 via-green-50 to-emerald-50',
      'from-violet-50 via-purple-50 to-indigo-50',
      'from-orange-50 via-red-50 to-pink-50'
    ]
    return gradients[index % gradients.length]
  }

  // Generate a spiritual icon based on bhog name
  const getBhogIcon = (bhogName: string) => {
    const lowerBhog = bhogName.toLowerCase()
    if (lowerBhog.includes('modak') || lowerBhog.includes('sweet')) return '🍯'
    if (lowerBhog.includes('fruit') || lowerBhog.includes('phal')) return '🍎'
    if (lowerBhog.includes('milk') || lowerBhog.includes('doodh')) return '🥛'
    if (lowerBhog.includes('rice') || lowerBhog.includes('chawal')) return '🍚'
    if (lowerBhog.includes('bread') || lowerBhog.includes('roti')) return '🫓'
    if (lowerBhog.includes('water') || lowerBhog.includes('jal')) return '💧'
    return '🕉️'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-festival-gold/20 to-festival-orange/20 rounded-full blur-3xl float-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-festival-red/20 to-festival-orange/20 rounded-full blur-3xl float-slower"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-festival-gold/10 to-festival-red/10 rounded-full blur-3xl float-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <button 
              onClick={handleBackNavigation}
              className="text-festival-orange hover:text-festival-red transition-colors duration-200 mr-6 p-2 rounded-full hover:bg-white/50"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <h1 className="text-5xl font-bold font-jaf-bernino mb-2">
                <span className="text-festival-gold">छप्पन भोग</span>
                <span className="text-gray-800"> (56 Bhog)</span>
              </h1>
              <div className="flex items-center justify-center gap-2 text-2xl mb-2">
                <span>🕉️</span>
                <span>🙏</span>
                <span>🪔</span>
              </div>
            </div>
          </div>
          {eventTitle && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-gray-700 max-w-3xl mx-auto px-4 font-medium bg-white/70 backdrop-blur-sm rounded-full py-3 px-6 shadow-lg border border-white/20"
            >
              From: <span className="text-festival-orange font-semibold">{eventTitle}</span>
            </motion.p>
          )}
          <p className="text-lg text-gray-600 max-w-3xl mx-auto px-4 font-medium mt-4">
            View all divine Bhog offerings from our blessed community members
          </p>
        </motion.div>

        {/* Enhanced Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden bg-gradient-to-br from-festival-gold/90 to-festival-orange/90 rounded-3xl p-8 shadow-2xl border border-festival-gold/30 spiritual-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="relative flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Total Bhog Offers</p>
                <p className="text-4xl font-bold text-white font-mono tracking-wider">{getTotalBhogOffers()}</p>
                <p className="text-white/80 text-sm">Divine offerings</p>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden bg-gradient-to-br from-festival-red/90 to-festival-maroon/90 rounded-3xl p-8 shadow-2xl border border-festival-red/30 spiritual-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="relative flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">Active Flats</p>
                <p className="text-4xl font-bold text-white font-mono tracking-wider">{getUniqueFlats()}</p>
                <p className="text-white/80 text-sm">Blessed homes</p>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </motion.div>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Enhanced Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, bhog, or flat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-festival-gold focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-700 placeholder-gray-500"
              />
            </div>

            {/* Enhanced Building Filter */}
            <div className="flex gap-3">
              <Filter className="w-5 h-5 text-gray-500 mt-3" />
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-festival-gold focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-700 font-medium"
              >
                <option value="">All Buildings</option>
                {buildings.map(building => (
                  <option key={building} value={building}>Building {building}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Bhog Nominations Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 font-jaf-bernino flex items-center gap-3">
              <Flower2 className="w-8 h-8 text-festival-gold" />
              Divine Bhog Offerings
              <Flower2 className="w-8 h-8 text-festival-gold" />
            </h3>
          </div>
          
          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-festival-gold to-festival-orange rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <span className="text-3xl">🕉️</span>
              </div>
              <p className="text-gray-600 text-xl font-medium">Loading divine offerings...</p>
              <p className="text-gray-400 text-sm mt-2">Please wait while we gather the blessings</p>
            </motion.div>
          ) : filteredNominations.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🕉️</span>
              </div>
              <p className="text-gray-600 text-xl font-medium">No bhog offerings found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNominations.map((nomination, index) => (
                <motion.div
                  key={nomination.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                                     className={`group relative overflow-hidden bg-gradient-to-br ${getCardGradient(index)} rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 card-hover-lift spiritual-glow`}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl"></div>
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl"></div>
                  
                  {/* Serial Number Badge */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-festival-gold to-festival-orange rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>

                  {/* Bhog Icon */}
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{getBhogIcon(nomination.bhog_name)}</div>
                    <h4 className="text-lg font-semibold text-gray-800 font-jaf-bernino line-clamp-2">
                      {nomination.bhog_name}
                    </h4>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-festival-red to-festival-maroon rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Offered by</p>
                        <p className="font-semibold text-gray-800">{nomination.user_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-festival-gold to-festival-orange rounded-full flex items-center justify-center">
                        <Home className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-mono text-festival-orange tracking-wider">
                          {nomination.building}-{nomination.flat}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Blessing Quote */}
                  <div className="mt-4 pt-4 border-t border-white/30">
                    <p className="text-xs text-gray-600 text-center italic">
                      "ॐ गणेशाय नमः" - May Lord Ganesha bless this offering
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Footer Blessing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center py-8"
        >
          <div className="bg-gradient-to-r from-festival-gold/20 via-festival-orange/20 to-festival-red/20 rounded-2xl p-6 border border-festival-gold/30">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-2xl">🕉️</span>
              <span className="text-2xl">🙏</span>
              <span className="text-2xl">🪔</span>
            </div>
            <p className="text-gray-700 font-medium">
              May all these divine offerings bring peace, prosperity, and blessings to our community
            </p>
            <p className="text-sm text-gray-600 mt-2">
              जय श्री गणेश 🕉️
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
