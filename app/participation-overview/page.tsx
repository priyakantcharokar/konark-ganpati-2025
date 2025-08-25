'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Users, Calendar, Building, Clock, X } from 'lucide-react'
import { databaseService } from '@/lib/database-service'
import Link from 'next/link'

interface AartiBooking {
  id: string
  aartiSchedule: { date: string; time: string }
  building: string
  flat: string
  userName: string
  mobileNumber?: string | null
  timestamp: Date
}

interface EventNomination {
  id: string
  eventTitle: string
  eventDate: string
  building: string
  flat: string
  userName: string
  mobileNumber?: string | null
  timestamp: Date
}

interface DatabaseEventNomination {
  id: string
  event_title: string
  event_date: string
  user_name: string
  mobile_number?: string | null
  building: string
  flat: string
  created_at: string
  updated_at: string
}

interface ParticipationData {
  aartiBookings: AartiBooking[]
  eventNominations: EventNomination[]
}

interface GroupedEventNominations {
  [eventTitle: string]: EventNomination[]
}

export default function ParticipationOverview() {
  const [data, setData] = useState<ParticipationData>({ aartiBookings: [], eventNominations: [] })
  const [filteredData, setFilteredData] = useState<ParticipationData>({ aartiBookings: [], eventNominations: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [selectedEvent, setSelectedEvent] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'all' | 'aarti' | 'events'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const buildings = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const eventNames = [
    'Idol Making', 
    'Modak Competition', 
    'Best Out of Waste', 
    'Duo Dynamics', 
    'Group Singing', 
    'Solo Singing', 
    'Anchoring', 
    'Arti Prasad Seva',
    'Ganpati Utsav Hosting',
    'Satyanarayan Pooja',
    'Ganapati Sthapana',
    'Recitation',
    'Fashion Show'
  ]

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [data, searchTerm, selectedBuilding, selectedEvent, selectedDate, activeTab])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load aarti bookings
      const aartiBookings = await databaseService.getAllBookings()
      const aartiData = aartiBookings.map(booking => databaseService.convertBookingToSubmission(booking))

      // Load event nominations
      const eventNominations = await databaseService.getAllEventNominations()
      const eventData = eventNominations.map((nomination: DatabaseEventNomination) => ({
        id: nomination.id,
        eventTitle: nomination.event_title,
        eventDate: nomination.event_date,
        building: nomination.building,
        flat: nomination.flat,
        userName: nomination.user_name,
        mobileNumber: nomination.mobile_number || '',
        timestamp: new Date(nomination.created_at)
      }))
      
      setData({
        aartiBookings: aartiData,
        eventNominations: eventData
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = { ...data }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered.aartiBookings = filtered.aartiBookings.filter(booking =>
        booking.userName.toLowerCase().includes(term) ||
        booking.flat.toLowerCase().includes(term) ||
        booking.building.toLowerCase().includes(term)
      )
      filtered.eventNominations = filtered.eventNominations.filter(nomination =>
        nomination.userName.toLowerCase().includes(term) ||
        nomination.flat.toLowerCase().includes(term) ||
        nomination.building.toLowerCase().includes(term) ||
        nomination.eventTitle.toLowerCase().includes(term)
      )
    }

    // Filter by building
    if (selectedBuilding) {
      filtered.aartiBookings = filtered.aartiBookings.filter(booking => booking.building === selectedBuilding)
      filtered.eventNominations = filtered.eventNominations.filter(nomination => nomination.building === selectedBuilding)
    }

    // Filter by event
    if (selectedEvent) {
      filtered.eventNominations = filtered.eventNominations.filter(nomination => nomination.eventTitle === selectedEvent)
    }

    // Filter by date
    if (selectedDate) {
      filtered.aartiBookings = filtered.aartiBookings.filter(booking => booking.aartiSchedule.date === selectedDate)
      filtered.eventNominations = filtered.eventNominations.filter(nomination => nomination.eventDate === selectedDate)
    }

    // Filter by active tab
    if (activeTab === 'aarti') {
      filtered.eventNominations = []
    } else if (activeTab === 'events') {
      filtered.aartiBookings = []
    }

    setFilteredData(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedBuilding('')
    setSelectedEvent('')
    setSelectedDate('')
    setActiveTab('all')
  }

  // Helper function to get unique events
  const getUniqueEvents = () => {
    return new Set(data.eventNominations.map(e => e.eventTitle)).size
  }

  // Helper function to get total registrations
  const getTotalRegistrations = () => {
    return data.aartiBookings.length + data.eventNominations.length
  }

  // Group event nominations by event title
  const getGroupedEventNominations = () => {
    const grouped: GroupedEventNominations = {}
    filteredData.eventNominations.forEach(nomination => {
      if (!grouped[nomination.eventTitle]) {
        grouped[nomination.eventTitle] = []
      }
      grouped[nomination.eventTitle].push(nomination)
    })
    return grouped
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Participants Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <img
          src="./memories/GaneshaBlessings.png"
          alt="Ganesha Blessings Background"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="relative z-10">
        {/* Navigation Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl">🕉️</span>
                <Link 
                  href="/" 
                  className="text-lg sm:text-xl font-bold text-gray-800 font-style-script hover:text-orange-600 transition-colors duration-200 cursor-pointer"
                >
                  Konark Exotica
                </Link>
                <span className="text-gray-400 mx-1 sm:mx-2">•</span>
                <span className="text-sm sm:text-lg font-semibold text-gray-700">Participation Overview</span>
              </div>
              
              <Link 
                href="/"
                className="text-sm sm:text-base text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </nav>
        </header>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 font-jaf-bernino">
              Participation Overview
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto font-medium digital-text">
              Track all aarti bookings and event nominations across the Ganesh Pooja celebrations
            </p>
          </motion.div>

          {/* Main Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-white/60 shadow-xl shadow-black/20 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'all'
                      ? 'bg-blue-500 text-white border-2 border-blue-600 shadow-lg shadow-blue-200'
                      : 'bg-white/90 text-gray-800 hover:bg-white hover:text-gray-900 border border-gray-300'
                  }`}
                >
                  📊 All Registrations
                </button>
                <button
                  onClick={() => setActiveTab('aarti')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'aarti'
                      ? 'bg-green-500 text-white border-2 border-green-600 shadow-lg shadow-green-200'
                      : 'bg-white/90 text-gray-800 hover:bg-white hover:text-gray-900 border border-gray-300'
                  }`}
                >
                  🕉️ Aarti Bookings
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'events'
                      ? 'bg-purple-500 text-white border-2 border-purple-600 shadow-lg shadow-purple-200'
                      : 'bg-white/90 text-gray-800 hover:bg-white hover:text-gray-900 border border-gray-300'
                  }`}
                >
                  🎉 Event Nominations
                </button>
              </div>
              
              {activeTab !== 'all' && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1.5 bg-white/90 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent digital-text shadow-lg shadow-black/10 text-sm"
                  />
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 bg-white/90 hover:bg-white text-gray-800 hover:text-gray-900 border border-gray-300 rounded-lg transition-all duration-200 shadow-lg shadow-black/10 hover:shadow-black/20 text-sm whitespace-nowrap"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Content Tabs */}
          <div className="space-y-6">
            {/* Aarti Bookings Tab */}
            {activeTab === 'aarti' && (
              <motion.div
                key="aarti"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-white/60 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6 font-jaf-bernino">
                  🕉️ Aarti Bookings
                </h3>
                
                {filteredData.aartiBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-800 text-lg">No aarti bookings found.</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.aartiBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-white/70 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 ${
                          index % 4 === 0 ? 'border-l-8 border-l-blue-500' :
                          index % 4 === 1 ? 'border-l-8 border-l-green-500' :
                          index % 4 === 2 ? 'border-l-8 border-l-orange-500' :
                          'border-l-8 border-l-purple-500'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* First Line: Date - Time */}
                          <div className="text-center">
                            <span className="text-gray-800 font-bold text-sm">
                              {booking.aartiSchedule.date} - {booking.aartiSchedule.time}
                            </span>
                          </div>
                          
                          {/* Second Line: Name - Flat */}
                          <div className="text-center">
                            <span className="text-gray-700 font-semibold text-sm">
                              {booking.userName} - {booking.flat}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Event Nominations Tab */}
            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-white/60 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6 font-jaf-bernino">
                  🎉 Event Nominations
                </h3>
                
                {filteredData.eventNominations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-800 text-lg">No event nominations found.</div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {(() => {
                      // Group nominations by event title
                      const groupedNominations: { [key: string]: EventNomination[] } = {}
                      filteredData.eventNominations.forEach(nomination => {
                        if (!groupedNominations[nomination.eventTitle]) {
                          groupedNominations[nomination.eventTitle] = []
                        }
                        groupedNominations[nomination.eventTitle].push(nomination)
                      })

                      return Object.entries(groupedNominations).map(([eventTitle, nominations]) => (
                        <div key={eventTitle} className="space-y-4">
                          {/* Category Header */}
                          <div className="text-center">
                            <h4 className="text-xl font-semibold text-gray-800 mb-2 font-sohne">
                              {eventTitle}
                            </h4>
                            <div className="w-24 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
                            <p className="text-sm text-gray-600 mt-2">
                              {nominations.length} participant{nominations.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          
                          {/* Nominations Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {nominations.map((nomination, index) => (
                              <motion.div
                                key={nomination.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-white/70 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 ${
                                  index % 4 === 0 ? 'border-l-8 border-l-purple-500' :
                                  index % 4 === 1 ? 'border-l-8 border-l-cyan-500' :
                                  index % 4 === 2 ? 'border-l-8 border-l-emerald-500' :
                                  'border-l-8 border-l-yellow-500'
                                }`}
                              >
                                <div className="text-center">
                                  <span className="text-gray-800 font-bold text-sm">
                                    {nomination.userName}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                )}
              </motion.div>
            )}

            {/* All Registrations Tab */}
            {activeTab === 'all' && (
              <motion.div
                key="all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-white/60 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6 font-jaf-bernino">
                  📊 All Registrations
                </h3>
                
                <div className="space-y-6">
                  {/* Aarti Bookings Section */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-4 font-sohne">
                      🕉️ Aarti Bookings ({filteredData.aartiBookings.length})
                    </h4>
                    {filteredData.aartiBookings.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="text-gray-800">No aarti bookings found.</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredData.aartiBookings.map((booking, index) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-white/70 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 ${
                              index % 4 === 0 ? 'border-l-8 border-l-blue-500' :
                              index % 4 === 1 ? 'border-l-8 border-l-green-500' :
                              index % 4 === 2 ? 'border-l-8 border-l-orange-500' :
                              'border-l-8 border-l-purple-500'
                            }`}
                          >
                            <div className="space-y-3">
                              {/* First Line: Date - Time */}
                              <div className="text-center">
                                <span className="text-gray-800 font-bold text-sm">
                                  {booking.aartiSchedule.date} - {booking.aartiSchedule.time}
                                </span>
                              </div>
                              
                              {/* Second Line: Name - Flat */}
                              <div className="text-center">
                                <span className="text-gray-700 font-semibold text-sm">
                                  {booking.userName} - {booking.flat}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Event Nominations Section */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-4 font-sohne">
                      🎉 Event Nominations ({filteredData.eventNominations.length})
                    </h4>
                    {filteredData.eventNominations.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="text-gray-800">No event nominations found.</div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {(() => {
                          // Group nominations by event title
                          const groupedNominations: { [key: string]: EventNomination[] } = {}
                          filteredData.eventNominations.forEach(nomination => {
                            if (!groupedNominations[nomination.eventTitle]) {
                              groupedNominations[nomination.eventTitle] = []
                            }
                            groupedNominations[nomination.eventTitle].push(nomination)
                          })

                          return Object.entries(groupedNominations).map(([eventTitle, nominations]) => (
                            <div key={eventTitle} className="space-y-4">
                              {/* Category Header */}
                              <div className="text-center">
                                <h5 className="text-lg font-semibold text-gray-800 mb-2 font-sohne">
                                  {eventTitle}
                                </h5>
                                <div className="w-20 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
                                <p className="text-xs text-gray-600 mt-2">
                                  {nominations.length} participant{nominations.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                              
                              {/* Nominations Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {nominations.map((nomination, index) => (
                                  <motion.div
                                    key={nomination.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className={`bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-white/70 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 ${
                                      index % 4 === 0 ? 'border-l-8 border-l-purple-500' :
                                      index % 4 === 1 ? 'border-l-8 border-l-cyan-500' :
                                      index % 4 === 2 ? 'border-l-8 border-l-emerald-500' :
                                      'border-l-8 border-l-yellow-500'
                                    }`}
                                  >
                                    <div className="text-center">
                                      <span className="text-gray-800 font-bold text-sm">
                                        {nomination.userName}
                                      </span>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
