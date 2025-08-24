'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronDown, ChevronUp, Building, Home, Check, ChevronRight, Users, Calendar, ChevronLeft, X, ArrowUp } from 'lucide-react'
import EventCard from './EventCard'
import AartiBookingFlow from './AartiBookingFlow'

import { databaseService, type Submission } from '@/lib/database-service'

interface Event {
  id: string
  title: string
  date: string
  time: string
  description?: string
  organizers: string
  category: string
}

interface EventScheduleProps {
  userPhone: string
  userFlat: string
  onLogout: () => void
}

const EventSchedule: React.FC<EventScheduleProps> = ({ userPhone, userFlat, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'aarti' | 'festival' | 'past'>('aarti') // Default to aarti tab
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [showReusableBooking, setShowReusableBooking] = useState(false)
  const [selectedAarti, setSelectedAarti] = useState<{ date: string; time: string } | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [submissions, setSubmissions] = useState<Array<{
    id: string
    aartiSchedule: { date: string; time: string }
    building: string
    flat: string
    userName: string
    mobileNumber?: string | null
    timestamp: Date
  }>>([])

  // Data from JSON files
  const [aartiSchedule, setAartiSchedule] = useState<Array<{ date: string; time: string }>>([])
  const [flatsData, setFlatsData] = useState<{ [key: string]: string[] }>({})
  const [buildingInfo, setBuildingInfo] = useState<{ [key: string]: { name: string; floors: number; totalFlats: number; color: string } }>({})
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Load data from JSON files
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setLoadError(null)
      
      try {
        // Load aarti schedule
        const aartiResponse = await fetch('/aarti.json')
        if (!aartiResponse.ok) throw new Error('Failed to load aarti schedule')
        const aartiData = await aartiResponse.json()
        setAartiSchedule(aartiData)

        // Initialize aarti schedule in Supabase
        await databaseService.initializeAartiSchedule(aartiData)

        // Load flats data
        const flatsResponse = await fetch('/flats.json')
        if (!flatsResponse.ok) throw new Error('Failed to load flats data')
        const flatsRawData = await flatsResponse.json()
        
        // Group flats by building (A, B, C, D, E, F, G, H)
        const flatsData: { [key: string]: string[] } = {}
        const buildingInfoData: { [key: string]: { name: string; floors: number; totalFlats: number; color: string } } = {}
        const colors = [
          "from-blue-500 to-blue-600",
          "from-green-500 to-green-600", 
          "from-purple-500 to-purple-600",
          "from-orange-500 to-orange-600",
          "from-pink-500 to-pink-600",
          "from-indigo-500 to-indigo-600",
          "from-teal-500 to-teal-600",
          "from-red-500 to-red-600"
        ]
        
        // Extract flats array and group by building
        const allFlats = flatsRawData.flats || flatsRawData
        allFlats.forEach((flat: string) => {
          const building = flat.charAt(0)
          if (!flatsData[building]) {
            flatsData[building] = []
            buildingInfoData[building] = {
              name: `Building ${building}`,
              floors: 0,
              totalFlats: 0,
              color: colors[building.charCodeAt(0) - 65] || "from-gray-500 to-gray-600"
            }
          }
          flatsData[building].push(flat)
          buildingInfoData[building].totalFlats++
          
          // Calculate floors based on flat numbers
          const floor = parseInt(flat.slice(1, -2))
          if (floor > buildingInfoData[building].floors) {
            buildingInfoData[building].floors = floor
          }
        })
        
        setFlatsData(flatsData)
        setBuildingInfo(buildingInfoData)

        // Load events data
        const eventsResponse = await fetch('/coord.json')
        if (!eventsResponse.ok) throw new Error('Failed to load events data')
        const eventsData = await eventsResponse.json()
        setEvents(eventsData.events.map((event: any, index: number) => ({
          id: index.toString(),
          title: event.event,
          date: event.date,
          time: '',
          description: '',
          organizers: event.contact,
          category: 'festival'
        })))

        // Load existing submissions
        await loadSubmissions()
        
      } catch (error) {
        console.error('Error loading data:', error)
        setLoadError(error instanceof Error ? error.message : 'Unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Scroll listener for go to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Load existing submissions
  const loadSubmissions = async () => {
    try {
      const existingBookings = await databaseService.getAllBookings()
      setSubmissions(existingBookings.map(booking => databaseService.convertBookingToSubmission(booking)))
    } catch (error) {
      console.error('Error loading submissions:', error)
    }
  }

  // Check if a slot is booked
  const isSlotBooked = (date: string, time: string) => {
    return submissions.some(submission => 
      submission.aartiSchedule.date === date && submission.aartiSchedule.time === time
    )
  }

  // Get booking details for a slot
  const getSlotBooking = (date: string, time: string) => {
    return submissions.find(submission => 
      submission.aartiSchedule.date === date && submission.aartiSchedule.time === time
    )
  }

  // Handle aarti card click
  const handleAartiCardClick = (slot: { date: string; time: string }) => {
    setSelectedAarti(slot)
    setShowReusableBooking(true)
  }

  // Handle booking success
  const handleBookingSuccess = async (message: string) => {
    setShowReusableBooking(false)
    setSelectedAarti(null)
    
    // Reload submissions
    await loadSubmissions()
    
    // Show success toast
    setToastMessage(message)
    setToastType('success')
    setShowToast(true)
    
    setTimeout(() => setShowToast(false), 5000)
  }

  // Helper function to parse date strings like "23rd August" to Date objects
  const parseEventDate = (dateStr: string): Date => {
    // Handle special cases
    if (dateStr === 'Daily' || dateStr === 'Throughout Festival') {
      return new Date('2099-12-31') // Far future date to keep them in current events
    }
    
    // Handle date ranges like "30th and 31st August"
    if (dateStr.includes(' and ')) {
      const parts = dateStr.split(' and ')
      const firstDate = parts[0] // Take the first date
      return parseEventDate(firstDate)
    }
    
    // Handle dates like "23rd August", "27th August", etc.
    const match = dateStr.match(/(\d+)(?:st|nd|rd|th)\s+(\w+)/)
    if (match) {
      const day = parseInt(match[1])
      const month = match[2]
      const monthMap: { [key: string]: number } = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
        'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
      }
      
      if (monthMap[month] !== undefined) {
        // Assume year 2025 for the festival
        return new Date(2025, monthMap[month], day)
      }
    }
    
    // Fallback: return a far future date if parsing fails
    return new Date('2099-12-31')
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-charter">Loading festival schedule...</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 font-jaf-bernino">Error Loading Data</h2>
          <p className="text-gray-600 mb-4 font-charter">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Tab Navigation */}
      <motion.div
        id="schedule-tabs"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="mb-8 sm:mb-12"
      >
        {/* Tab Headers */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200">
            <div className="flex flex-wrap gap-2 justify-center">
              {/* Aarti Tab */}
              <button
                onClick={() => setActiveTab('aarti')}
                data-tab="aarti"
                className={`px-4 sm:px-6 py-3 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 ${
                  activeTab === 'aarti'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                🙏 Book Aarti
              </button>
              
              {/* Festival Events Tab */}
              <button
                onClick={() => setActiveTab('festival')}
                className={`px-4 sm:px-6 py-3 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 ${
                  activeTab === 'festival'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                🎉 Participate in Events
              </button>
              
              {/* Past Events Tab */}
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 sm:px-6 py-3 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 ${
                  activeTab === 'past'
                    ? 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                📸 Past Events
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Aarti Tab Content */}
          {activeTab === 'aarti' && (
            <motion.div
              key="aarti"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
              data-aarti-section
            >
              

              <div className="grid gap-3 sm:gap-4 max-w-4xl mx-auto px-4">
                {(() => {
                  // Group aarti slots by date
                  const groupedByDate = aartiSchedule.reduce((acc, aarti) => {
                    if (!acc[aarti.date]) {
                      acc[aarti.date] = [];
                    }
                    acc[aarti.date].push(aarti);
                    return acc;
                  }, {} as { [key: string]: typeof aartiSchedule });

                  return Object.entries(groupedByDate).map(([date, slots], index) => {
                    const morningSlot = slots.find(slot => slot.time === 'Morning');
                    const eveningSlot = slots.find(slot => slot.time === 'Evening');
                    
                    const isMorningBooked = morningSlot ? isSlotBooked(morningSlot.date, morningSlot.time) : false;
                    const isEveningBooked = eveningSlot ? isSlotBooked(eveningSlot.date, eveningSlot.time) : false;
                    
                    const morningBooking = morningSlot ? getSlotBooking(morningSlot.date, morningSlot.time) : null;
                    const eveningBooking = eveningSlot ? getSlotBooking(eveningSlot.date, eveningSlot.time) : null;
                    
                    return (
                      <motion.div
                        key={date}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.8, 
                          delay: index * 0.15,
                          ease: "easeOut"
                        }}
                        whileHover={{ 
                          y: -5, 
                          scale: 1.02,
                          transition: { duration: 0.3, ease: "easeOut" }
                        }}
                        className="relative bg-gradient-to-br from-white via-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-500 transform"
                      >
                        {/* Date Header */}
                        <motion.div 
                          className="text-center mb-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
                        >
                          <motion.div 
                            className="text-lg sm:text-xl font-bold text-gray-800 mb-2 font-mono tracking-wider"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {date}
                          </motion.div>
                          <motion.div 
                            className="w-12 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mx-auto"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 48, opacity: 1 }}
                            transition={{ delay: index * 0.15 + 0.4, duration: 0.6, ease: "easeOut" }}
                          />
                        </motion.div>

                        {/* Time Slots */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Morning Slot */}
                          {morningSlot && (
                            <motion.div
                              initial={{ opacity: 0, x: -30, scale: 0.9 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              transition={{ 
                                delay: index * 0.15 + 0.3, 
                                duration: 0.6,
                                ease: "easeOut"
                              }}
                              whileHover={{ 
                                x: -5, 
                                scale: 1.03,
                                transition: { duration: 0.3, ease: "easeOut" }
                              }}
                              className={`relative group ${
                                isMorningBooked 
                                  ? 'cursor-not-allowed opacity-75 pointer-events-none' 
                                  : 'cursor-pointer'
                              }`}
                              onClick={() => !isMorningBooked && morningSlot && handleAartiCardClick(morningSlot)}
                            >
                              <motion.div 
                                className={`relative p-4 rounded-lg min-h-[80px] flex items-center justify-center ${
                                  isMorningBooked 
                                    ? 'bg-gradient-to-r from-gray-300 to-slate-300' 
                                    : 'bg-gradient-to-r from-green-100 to-emerald-100'
                                }`}
                                whileHover={!isMorningBooked ? {
                                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                                  transition: { duration: 0.3 }
                                } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                {/* Slot Content */}
                                <motion.div 
                                  className="text-center"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.15 + 0.6, duration: 0.5 }}
                                >
                                  <motion.div 
                                    className="text-lg font-bold text-gray-800 mb-2 font-sohne"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    Morning Aarti
                                  </motion.div>
                                  <motion.div 
                                    className="text-base font-bold text-green-700 font-circular"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    Click to Book
                                  </motion.div>
                                </motion.div>
                                
                                {/* Booking Status */}
                                {isMorningBooked && morningBooking && (
                                  <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center opacity-95"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.95 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                  >
                                    <div className="text-center px-4 py-3 w-full h-full flex flex-col justify-center items-center">
                                      <div className="text-center">
                                        <div className="text-xl font-bold text-white mb-3">Booked by</div>
                                        <div className="flex items-center justify-center gap-3 text-white">
                                          <span className="text-lg font-bold">{morningBooking.userName}</span>
                                          <span className="text-lg font-bold text-white font-mono tracking-wider">{morningBooking.flat}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                          </motion.div>
                        </motion.div>
                      )}

                          {/* Evening Slot */}
                          {eveningSlot && (
                            <motion.div
                              initial={{ opacity: 0, x: 30, scale: 0.9 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              transition={{ 
                                delay: index * 0.15 + 0.5, 
                                duration: 0.6,
                                ease: "easeOut"
                              }}
                              whileHover={{ 
                                x: 5, 
                                scale: 1.03,
                                transition: { duration: 0.3, ease: "easeOut" }
                              }}
                              className={`relative group ${
                                isEveningBooked 
                                  ? 'cursor-not-allowed opacity-75 pointer-events-none' 
                                  : 'cursor-pointer'
                              }`}
                              onClick={() => !isEveningBooked && eveningSlot && handleAartiCardClick(eveningSlot)}
                            >
                              <motion.div 
                                className={`relative p-4 rounded-lg min-h-[80px] flex items-center justify-center ${
                                  isEveningBooked 
                                    ? 'bg-gradient-to-r from-gray-300 to-slate-300' 
                                    : 'bg-gradient-to-r from-green-100 to-emerald-100'
                                }`}
                                whileHover={!isEveningBooked ? {
                                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                                  transition: { duration: 0.3 }
                                } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                {/* Slot Content */}
                                <motion.div 
                                  className="text-center"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.15 + 0.7, duration: 0.5 }}
                                >
                                  <motion.div 
                                    className="text-base font-semibold text-gray-800 mb-2 font-sohne"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    Evening Aarti
                                  </motion.div>
                                  <motion.div 
                                    className="text-base font-bold text-green-700 font-circular"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    Click to Book
                                  </motion.div>
                                </motion.div>
                                
                                {/* Booking Status */}
                                {isEveningBooked && eveningBooking && (
                                  <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center opacity-95"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.95 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                  >
                                    <div className="text-center px-4 py-3 w-full h-full flex flex-col justify-center items-center">
                                      <div className="text-center">
                                        <div className="text-xl font-bold text-white mb-3">Booked by</div>
                                        <div className="flex items-center justify-center gap-3 text-white">
                                          <span className="text-lg font-bold">{eveningBooking.userName}</span>
                                          <span className="text-lg font-bold text-white font-mono tracking-wider">{eveningBooking.flat}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </motion.div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  });
                })()}
              </div>
            </motion.div>
          )}

          {/* Festival Events Tab Content */}
          {activeTab === 'festival' && (
            <motion.div
              key="festival"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-6 border border-orange-200"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-800 mb-3 font-style-script">
                  Festival Events
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4 font-charter">
                  Plan your participation day by day. Events are organized by date for easy planning!
                </p>
              </div>

              {/* Events Organized by Date */}
              <div className="space-y-8 max-w-7xl mx-auto">
                
                {/* Group events by date (show only current/future events, filter out past events) */}
                {(() => {
                  const currentDate = new Date()
                  
                  // Group events by date (show only current/future events, filter out past events)
                  const currentEvents = events.filter(event => {
                    const eventDate = parseEventDate(event.date)
                    return eventDate >= currentDate
                  })
                  
                  const eventsByDate = currentEvents.reduce((acc, event) => {
                    const date = event.date
                    if (!acc[date]) {
                      acc[date] = []
                    }
                    acc[date].push(event)
                    return acc
                  }, {} as { [key: string]: typeof currentEvents })

                  // Sort dates chronologically using parsed dates
                  const sortedDates = Object.keys(eventsByDate).sort((a, b) => {
                    const dateA = parseEventDate(a)
                    const dateB = parseEventDate(b)
                    return dateA.getTime() - dateB.getTime()
                  })

                  if (currentEvents.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                          No upcoming events at the moment.
                        </div>
                        <div className="text-gray-400 text-sm mt-2">
                          Check the Past Events tab to see completed events.
                        </div>
                      </div>
                    )
                  }

                  return sortedDates.map((date, dateIndex) => (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: dateIndex * 0.1 }}
                      className="space-y-4"
                    >
                      {/* Date Header */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-amber-200 shadow-lg">
                          <span className="text-2xl">📅</span>
                          <h3 className="text-lg font-bold text-amber-800 font-sohne">
                            {date}
                          </h3>
                          <span className="text-sm text-amber-600 font-medium">
                            {eventsByDate[date].length} event{eventsByDate[date].length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="w-32 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto mt-3"></div>
                      </div>
                      
                      {/* Events for this date */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {eventsByDate[date].map((event, eventIndex) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: dateIndex * 0.1 + eventIndex * 0.05 }}
                          >
                            <EventCard key={event.id} event={event} index={eventIndex} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                })()}

                {/* Quick Action Guide */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200 shadow-lg">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-amber-800 mb-3 font-sohne">
                      💡 How to Participate
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <span>Click <strong>Details</strong> to learn more</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <span>Click <strong>Nominate</strong> to participate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <span>Click <strong>Nominations</strong> to see others</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Past Events Tab Content */}
          {activeTab === 'past' && (
            <motion.div
              key="past"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 rounded-2xl p-6 border border-gray-200"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 mb-3 font-style-script">
                  Past Events
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4 font-charter">
                  Relive the memories of completed events. Click Photos to view event galleries!
                </p>
              </div>

              {/* Past Events Organized by Date */}
              <div className="space-y-8 max-w-7xl mx-auto">
                
                {/* Group past events by date */}
                {(() => {
                  // For testing purposes, we can set a specific date to see past events
                  // In production, this would be the actual current date
                  const currentDate = new Date(2025, 7, 25) // August 25, 2025 for testing
                  
                  // Filter events that have passed
                  const pastEvents = events.filter(event => {
                    const eventDate = parseEventDate(event.date)
                    return eventDate < currentDate
                  })

                  // Group past events by date
                  const pastEventsByDate = pastEvents.reduce((acc, event) => {
                    const date = event.date
                    if (!acc[date]) {
                      acc[date] = []
                    }
                    acc[date].push(event)
                    return acc
                  }, {} as { [key: string]: typeof events })

                  // Sort dates chronologically (most recent first)
                  const sortedDates = Object.keys(pastEventsByDate).sort((a, b) => {
                    const dateA = parseEventDate(a)
                    const dateB = parseEventDate(b)
                    return dateB.getTime() - dateA.getTime() // Reverse order for past events
                  })

                  if (pastEvents.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                          No past events yet.
                        </div>
                        <div className="text-gray-400 text-sm mt-2">
                          All events are currently upcoming or ongoing.
                        </div>
                      </div>
                    )
                  }

                  return sortedDates.map((date, dateIndex) => (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: dateIndex * 0.1 }}
                      className="space-y-4"
                    >
                      {/* Date Header */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 shadow-lg">
                          <span className="text-2xl">📅</span>
                          <h3 className="text-lg font-bold text-gray-700 font-sohne">
                            {date}
                          </h3>
                          <span className="text-sm text-gray-500 font-medium">
                            {pastEventsByDate[date].length} event{pastEventsByDate[date].length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="w-32 h-0.5 bg-gradient-to-r from-gray-400 to-slate-500 rounded-full mx-auto mt-3"></div>
                      </div>
                      
                      {/* Past Events for this date */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pastEventsByDate[date].map((event, eventIndex) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: dateIndex * 0.1 + eventIndex * 0.05 }}
                            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            {/* Event Title */}
                            <div className="text-center mb-4">
                              <h4 className="text-lg font-bold text-gray-800 mb-2 font-sohne">
                                {event.title}
                              </h4>
                              <div className="w-16 h-1 bg-gradient-to-r from-gray-400 to-slate-500 rounded-full mx-auto"></div>
                            </div>
                            
                            {/* Event Details */}
                            <div className="space-y-3 mb-6">
                              <div className="flex items-center gap-2 text-gray-600">
                                <span className="text-lg">📅</span>
                                <span className="font-medium">{event.date}</span>
                              </div>
                              {event.organizers && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span className="text-lg">👥</span>
                                  <span className="font-medium">Contact: {event.organizers}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Photos Button */}
                            <div className="text-center">
                              <button
                                onClick={() => window.location.href = '/gallery'}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                              >
                                📸 View Photos
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

     
      {/* Go to Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.3 }}
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg font-medium ${
              toastType === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aarti Booking Flow Modal */}
      {showReusableBooking && selectedAarti && (
        <AartiBookingFlow
          selectedSlot={selectedAarti}
          onClose={() => {
            setShowReusableBooking(false)
            setSelectedAarti(null)
          }}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  )
}

export default EventSchedule
