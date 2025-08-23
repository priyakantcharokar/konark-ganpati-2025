'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Home, Calendar, ArrowLeft } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <button 
              onClick={handleBackNavigation}
              className="text-green-600 hover:text-green-700 transition-colors duration-200 mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-4xl font-bold text-gray-800 font-jaf-bernino">
              छप्पन भोग (56) Bhog List
            </h1>
          </div>
          {eventTitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4 font-medium">
              From: {eventTitle}
            </p>
          )}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4 font-medium">
            View all Bhog offerings from our community members
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-green-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bhog Offers</p>
                <p className="text-2xl font-bold text-gray-800 font-mono tracking-wider">{getTotalBhogOffers()}</p>
              </div>
            </div>
          </motion.div>

         
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by name, bhog, or flat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Building Filter */}
            <div className="flex gap-2">
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Buildings</option>
                {buildings.map(building => (
                  <option key={building} value={building}>Building {building}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Bhog Nominations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 font-jaf-bernino">
              Bhog Offerings
            </h3>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🕉️</span>
                </div>
                <p className="text-gray-500 text-lg font-medium">Loading bhog offerings...</p>
              </div>
            ) : filteredNominations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🕉️</span>
                </div>
                <p className="text-gray-500 text-lg font-medium">No bhog offerings found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Serial No.</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Flat Number</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Bhog Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNominations.map((nomination, index) => (
                      <motion.tr
                        key={nomination.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-green-50 transition-colors duration-200"
                      >
                        <td className="py-4 px-4 font-mono text-gray-600">
                          {index + 1}
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-800">
                          {nomination.user_name}
                        </td>
                        <td className="py-4 px-4 font-mono text-green-600 tracking-wider">
                          {nomination.flat}
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {nomination.bhog_name}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
