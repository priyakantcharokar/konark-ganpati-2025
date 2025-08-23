'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Users, Calendar, Building, Home, Clock, X, Eye } from 'lucide-react'
import { databaseService } from '@/lib/database-service'

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
  const [activeTab, setActiveTab] = useState<'aarti' | 'events' | 'all'>('all')
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

  const getTotalParticipants = () => {
    const uniqueAartiParticipants = new Set(data.aartiBookings.map(b => `${b.building}-${b.flat}-${b.userName}`))
    const uniqueEventParticipants = new Set(data.eventNominations.map(e => `${e.building}-${e.flat}-${e.userName}`))
    return uniqueAartiParticipants.size + uniqueEventParticipants.size
  }

  const getUniqueFlats = () => {
    const aartiFlats = data.aartiBookings.map(b => `${b.building}-${b.flat}`)
    const eventFlats = data.eventNominations.map(e => `${e.building}-${e.flat}`)
    const allFlats = [...aartiFlats, ...eventFlats]
    return new Set(allFlats).size
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
          <p className="text-gray-600">Loading participation data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-3 font-jaf-bernino">
          Participation Overview
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          Track all aarti bookings and event nominations across the Ganesh Pooja celebrations
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, building, or flat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Building</label>
                  <select
                    value={selectedBuilding}
                    onChange={(e) => setSelectedBuilding(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Buildings</option>
                    {buildings.map(building => (
                      <option key={building} value={building}>Building {building}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Events</option>
                    {eventNames.map(event => (
                      <option key={event} value={event}>{event}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Dates</option>
                    <option value="27th August">27th August</option>
                    <option value="28th August">28th August</option>
                    <option value="29th August">29th August</option>
                    <option value="30th August">30th August</option>
                    <option value="31st August">31st August</option>
                    <option value="1st September">1st September</option>
                    <option value="2nd September">2nd September</option>
                    <option value="3rd September">3rd September</option>
                    <option value="4th September">4th September</option>
                    <option value="5th September">5th September</option>
                    <option value="6th September">6th September</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value as 'aarti' | 'events' | 'all')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Registrations</option>
                    <option value="aarti">Aarti Bookings Only</option>
                    <option value="events">Event Nominations Only</option>
                  </select>
                </div>
              </div>
              
              {/* Clear Filters Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedBuilding('')
                    setSelectedEvent('')
                    setSelectedDate('')
                    setActiveTab('all')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 font-medium"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-gray-800 font-mono tracking-wider">{getTotalParticipants()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Flats</p>
                <p className="text-2xl font-bold text-gray-800 font-mono tracking-wider">{getUniqueFlats()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Registrations</p>
                <p className="text-2xl font-bold text-gray-800 font-mono tracking-wider">
                  {data.aartiBookings.length + data.eventNominations.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unique Events</p>
                <p className="text-2xl font-bold text-gray-800 font-mono tracking-wider">
                  {new Set(data.eventNominations.map(e => e.eventTitle)).size}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                activeTab === 'all' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              All Registrations
            </button>
            <button
              onClick={() => setActiveTab('aarti')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                activeTab === 'aarti' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Aarti Bookings
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                activeTab === 'events' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Event Nominations
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'all' || activeTab === 'aarti' ? (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white text-lg">🕉️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 font-jaf-bernino">Aarti Bookings</h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {filteredData.aartiBookings.length} booking{filteredData.aartiBookings.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>
                {filteredData.aartiBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🕉️</span>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No aarti bookings found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.aartiBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Header with Building/Flat and Aarti Type */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                              <span className="text-white text-lg font-bold font-mono tracking-wider">{booking.building}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-800 text-2xl font-jaf-bernino">{booking.flat}</span>
                              <p className="text-base text-gray-500 font-medium">Flat</p>
                            </div>
                          </div>
                          
                          {/* Aarti Type and Time */}
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-800 mt-2 font-jaf-bernino">
                              {booking.aartiSchedule.time === 'Morning' ? 'Morning' : 'Evening'}
                            </p>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-gray-600" />
                            </div>
                            <p className="font-medium text-gray-800 text-lg font-jaf-bernino">{booking.userName}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-gray-600" />
                            </div>
                            <p className="text-gray-600 text-lg font-medium">{booking.aartiSchedule.date}</p>
                          </div>
                        </div>

                        {/* Hover Effect Indicator */}
                        <div className="mt-6 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center justify-center text-sm text-orange-600 font-medium">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {activeTab === 'all' || activeTab === 'events' ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white text-lg">🎉</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 font-jaf-bernino">Event Nominations</h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {filteredData.eventNominations.length} nomination{filteredData.eventNominations.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>
                {filteredData.eventNominations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎉</span>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No event nominations found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(getGroupedEventNominations()).map(([eventTitle, nominations], eventIndex) => (
                      <motion.div
                        key={eventTitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: eventIndex * 0.1 }}
                        className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                      >
                        {/* Event Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                              <span className="text-white text-xl">🎯</span>
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-800 font-jaf-bernino">{eventTitle}</h4>
                              <p className="text-sm text-gray-600 font-medium">
                                {nominations.length} participant{nominations.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg text-gray-600 font-medium">
                              {nominations[0]?.eventDate}
                            </p>
                          </div>
                        </div>

                        {/* Participants Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {nominations.map((nomination, index) => (
                            <motion.div
                              key={nomination.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="group bg-gray-50 rounded-lg p-5 hover:shadow-md hover:bg-green-50/50 transition-all duration-200"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                                  <span className="text-white text-base font-bold font-mono tracking-wider">{nomination.building}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-800 text-base truncate font-jaf-bernino">{nomination.userName}</p>
                                  <p className="text-sm text-gray-600 font-medium">Flat {nomination.flat}</p>
                                </div>
                              </div>
                              
                              {/* Hover Effect */}
                              <div className="mt-4 pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="flex items-center justify-center text-sm text-green-600 font-medium">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
