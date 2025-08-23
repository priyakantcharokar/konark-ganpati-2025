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
  const [showAartiSchedule, setShowAartiSchedule] = useState(false) // Default to collapsed
  const [showFestivalEvents, setShowFestivalEvents] = useState(false) // Default to collapsed
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
    mobileNumber: string
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

  const loadSubmissions = async () => {
    try {
      const existingSubmissions = await databaseService.getAllBookings()
      setSubmissions(existingSubmissions.map(booking => databaseService.convertBookingToSubmission(booking)))
    } catch (error) {
      console.error('Error loading submissions:', error)
    }
  }

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setShowToast(false)
    }, 5000)
  }

  // Festival events data
  const handleAartiCardClick = (aarti: { date: string; time: string }) => {
    setSelectedAarti(aarti)
    setShowReusableBooking(true)
  }

  // Calculate event count
  const eventCount = events.length

  // Check if a slot is booked
  const isSlotBooked = (date: string, time: string) => {
    return submissions.some(sub => 
      sub.aartiSchedule.date === date && sub.aartiSchedule.time === time
    )
  }

  // Get booking details for a slot
  const getSlotBooking = (date: string, time: string) => {
    return submissions.find(sub => 
      sub.aartiSchedule.date === date && sub.aartiSchedule.time === time
    )
  }

  return (
    <div className="w-full">
      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Söhne, sans-serif' }}>
            Loading Ganesh Pooja Schedule...
          </p>
        </motion.div>
      )}

      {/* Error State */}
      {loadError && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 px-4"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-red-500">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Charter, serif' }}>
            Failed to Load Data
          </h2>
          <p className="text-gray-600 mb-4" style={{ fontFamily: 'Söhne, sans-serif' }}>
            {loadError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            style={{ fontFamily: 'Söhne, sans-serif' }}
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Main Content - Only show when data is loaded */}
      {!isLoading && !loadError && (
        <>
          {/* Compact Hero Section - Show on ALL pages */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-center py-4 sm:py-6 md:py-8 px-4 sm:px-6 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 shadow-lg border border-orange-200 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(254, 215, 170, 0.9) 50%, rgba(251, 191, 36, 0.85) 100%), url('/konark.jpeg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Background Overlay for Better Text Readability */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
            
            {/* Content with Relative Positioning */}
            <div className="relative z-10">
              {/* Compact Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-3 sm:mb-4"
              >
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3">🕉️</div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-800 bg-clip-text text-transparent mb-3">
                  <span className="font-normal text-amber-700 font-style-script" style={{ fontSize: 'clamp(20px, 4vw, 90px)' }}>Konark Exotica</span>
                  <span className="block text-sm sm:text-base md:text-lg lg:text-xl mt-1 font-style-script" style={{ fontSize: 'clamp(16px, 3.5vw, 20px)' }}>Ganesh Pooja 2025</span>
                </h1>
              </motion.div>

              {/* Compact Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xs sm:text-sm md:text-base text-gray-800 mb-3 sm:mb-4 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed font-medium px-2"
                style={{ fontFamily: 'Charter, serif' }}
              >
                Experience the divine celebration with our complete festival schedule. From traditional ceremonies to exciting competitions, discover all the events planned for this auspicious occasion.
              </motion.p>

              {/* Big Animated Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 px-2"
              >
                <motion.div 
                  className="flex flex-col items-center bg-white/90 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-orange-200 shadow-lg"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8, type: "spring", bounce: 0.4 }}
                    className="w-3 h-3 bg-orange-500 rounded-full mb-2"
                  ></motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-700 mb-1"
                    style={{ fontFamily: 'Charter, serif' }}
                  >
                    {eventCount}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    className="text-sm sm:text-base md:text-lg font-semibold text-gray-700"
                    style={{ fontFamily: 'Söhne, sans-serif' }}
                  >
                    Events
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="flex flex-col items-center bg-white/90 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-red-200 shadow-lg"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.9, type: "spring", bounce: 0.4 }}
                    className="w-3 h-3 bg-red-500 rounded-full mb-2"
                  ></motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="text-lg sm:text-xl md:text-2xl font-bold text-red-700 mb-1"
                    style={{ fontFamily: 'Charter, serif' }}
                  >
                    Aug 23 - Sep 6
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.3 }}
                    className="text-sm sm:text-base font-semibold text-gray-700"
                    style={{ fontFamily: 'Söhne, sans-serif' }}
                  >
                    Festival Duration
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="flex flex-col items-center bg-white/90 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-yellow-200 shadow-lg"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.0, type: "spring", bounce: 0.4 }}
                    className="w-3 h-3 bg-yellow-500 rounded-full mb-2"
                  ></motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-700 mb-1"
                    style={{ fontFamily: 'Charter, serif' }}
                  >
                    7 PM
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.5 }}
                    className="text-sm sm:text-base md:text-lg font-semibold text-gray-700"
                    style={{ fontFamily: 'Söhne, sans-serif' }}
                  >
                    Most Events
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Daily Aarti Schedule Section */}
          <motion.section
            id="aarti-schedule"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mb-8 sm:mb-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
          >
            {/* Collapsible Header */}
            <div className="text-center mb-6 sm:mb-8">
              <button
                onClick={() => setShowAartiSchedule(!showAartiSchedule)}
                className="group flex items-center justify-center gap-3 mx-auto text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-800 mb-3 sm:mb-4 font-style-script hover:text-indigo-600 transition-colors duration-200"
              >
                <span>Daily Aarti Schedule</span>
                                  <motion.div
                    animate={{ rotate: showAartiSchedule ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-indigo-600 group-hover:text-indigo-700"
                  >
                    ▼
                  </motion.div>
              </button>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4 font-charter">
                Click Morning or Evening slot to book your aarti
              </p>
            </div>

            {/* Collapsible Content */}
            <AnimatePresence>
              {showAartiSchedule && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
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
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="relative bg-gradient-to-br from-white via-orange-50 to-amber-50 border border-orange-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-101"
                    >
                      {/* Date Header */}
                      <div className="text-center mb-3">
                        <div className="text-base sm:text-lg font-bold text-gray-800 mb-1 font-jaf-bernino">
                          {date}
                        </div>
                        <div className="w-10 h-0.5 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mx-auto"></div>
                      </div>

                      {/* Time Slots */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Morning Slot */}
                        {morningSlot && (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className={`relative group transition-all duration-300 ${
                              isMorningBooked 
                                ? 'cursor-not-allowed opacity-75 pointer-events-none' 
                                : 'cursor-pointer hover:scale-105'
                            }`}
                            onClick={() => !isMorningBooked && morningSlot && handleAartiCardClick(morningSlot)}
                          >
                            <div className={`relative p-3 rounded-lg border-2 transition-all duration-300 ${
                              isMorningBooked 
                                ? 'bg-gradient-to-r from-gray-200 to-slate-200 border-gray-400' 
                                : 'bg-gradient-to-r from-orange-100 to-amber-100 border-orange-300 hover:border-orange-400 hover:shadow-md'
                            }`}>
                              {/* Time Badge */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    isMorningBooked ? 'bg-gray-500' : 'bg-orange-500'
                                  }`}></div>
                                  <span className={`text-sm font-semibold ${
                                    isMorningBooked ? 'text-gray-600' : 'text-orange-700'
                                  }`}>Morning</span>
                                </div>
                                {isMorningBooked && (
                                  <div className="bg-red-500 text-white rounded-full p-1.5">
                                    <span className="text-xs font-bold">BOOKED</span>
                                  </div>
                                )}
                              </div>

                              {/* Time Display */}
                              <div className="text-center">
                                <div className={`text-2xl font-bold mb-1 ${
                                  isMorningBooked ? 'text-gray-500' : 'text-orange-600'
                                }`}>7 AM onwards</div>
                              </div>

                              {/* Booking Status */}
                              {isMorningBooked && morningBooking && (
                                <div className="mt-3 p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                                  <div className="text-center">
                                    <div className="text-red-800 font-bold text-sm mb-1">🚫 BOOKED</div>
                                    <div className="text-red-700 font-bold text-base">{morningBooking.userName}</div>
                                    <div className="text-red-600 font-semibold text-xs">Flat {morningBooking.flat} - Building {morningBooking.building}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Evening Slot */}
                        {eveningSlot && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className={`relative group transition-all duration-300 ${
                              isEveningBooked 
                                ? 'cursor-not-allowed opacity-75 pointer-events-none' 
                                : 'cursor-pointer hover:scale-105'
                            }`}
                            onClick={() => !isEveningBooked && eveningSlot && handleAartiCardClick(eveningSlot)}
                          >
                            <div className={`relative p-3 rounded-lg border-2 transition-all duration-300 ${
                              isEveningBooked 
                                ? 'bg-gradient-to-r from-gray-200 to-slate-200 border-gray-400' 
                                : 'bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300 hover:border-gray-400 hover:shadow-md'
                            }`}>
                              {/* Time Badge */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    isEveningBooked ? 'bg-gray-500' : 'bg-gray-600'
                                  }`}></div>
                                  <span className={`text-sm font-semibold ${
                                    isEveningBooked ? 'text-gray-600' : 'text-gray-700'
                                  }`}>Evening</span>
                                </div>
                                {isEveningBooked && (
                                  <div className="bg-red-500 text-white rounded-full p-1.5">
                                    <span className="text-xs font-bold">BOOKED</span>
                                  </div>
                                )}
                              </div>

                              {/* Time Display */}
                              <div className="text-center">
                                <div className={`text-2xl font-bold mb-1 ${
                                  isEveningBooked ? 'text-gray-500' : 'text-gray-600'
                                }`}>7 PM onwards</div>
                              </div>

                              {/* Booking Status */}
                              {isEveningBooked && eveningBooking && (
                                <div className="mt-3 p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                                  <div className="text-center">
                                    <div className="text-red-800 font-bold text-sm mb-1">🚫 BOOKED</div>
                                    <div className="text-red-700 font-bold text-base">{eveningBooking.userName}</div>
                                    <div className="text-red-600 font-semibold text-xs">Flat {eveningBooking.flat} - Building {eveningBooking.building}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="mt-4 text-center">
                        <div className="text-xs text-gray-500 font-medium">
                          {isMorningBooked && isEveningBooked ? 'Both slots booked' : 
                           isMorningBooked || isEveningBooked ? 'One slot available' : 'Both slots available'}
                        </div>
                      </div>
                    </motion.div>
                  );
                });
              })()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Festival Events Section */}
          <motion.section
            id="festival-events"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mb-8 sm:mb-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-6 border border-orange-200"
          >
            <div className="text-center mb-6 sm:mb-8">
              <button
                onClick={() => setShowFestivalEvents(!showFestivalEvents)}
                className="group flex items-center justify-center gap-3 mx-auto text-2xl sm:text-3xl md:text-4xl font-bold text-amber-800 mb-3 sm:mb-4 font-style-script hover:text-amber-600 transition-colors duration-200"
              >
                <span>Festival Events</span>
                <motion.div
                  animate={{ rotate: showFestivalEvents ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-amber-600 group-hover:text-amber-700"
                >
                  ▼
                </motion.div>
              </button>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4 font-charter">
                {showFestivalEvents 
                  ? "Explore all the exciting events and competitions planned for the festival"
                  : "Click above to explore all the exciting events and competitions planned for the festival"
                }
              </p>
            </div>

            {/* Collapsible Content */}
            <AnimatePresence>
              {showFestivalEvents && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mx-auto px-4">
                    {events.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: index * 0.1,
                          ease: "easeOut"
                        }}
                        whileHover={{ 
                          y: -4,
                          transition: { duration: 0.4, ease: "easeOut" }
                        }}
                      >
                        <EventCard key={event.id} event={event} index={index} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
            className="mt-8 sm:mt-12 bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 text-center border border-gray-100"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                <span className="text-xl sm:text-2xl">ℹ️</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 font-jaf-bernino">
            Important Information
          </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-600" style={{ fontFamily: 'Söhne, sans-serif' }}>
                <div className="bg-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
                  <span className="font-semibold text-blue-600 block mb-1.5 sm:mb-2 text-xs sm:text-sm">⏰ Timing</span>
                  <p className="text-gray-700 text-xs sm:text-sm">Most events after 7 PM for maximum participation</p>
            </div>
                <div className="bg-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
                  <span className="font-semibold text-green-600 block mb-1.5 sm:mb-2 text-xs sm:text-sm">📅 Duration</span>
                  <p className="text-gray-700 text-xs sm:text-sm">August 23 - September 6, 2025</p>
            </div>
                <div className="bg-white/60 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 sm:col-span-2 lg:col-span-1">
                  <span className="font-semibold text-purple-600 block mb-1.5 sm:mb-2 text-xs sm:text-sm">📝 Note</span>
                  <p className="text-gray-700 text-xs sm:text-sm">This is a tentative plan and may change if required</p>
            </div>
          </div>
        </motion.div>
          </motion.div>
        </>
      )}

      {/* Go to Top Button - Bottom Right */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={scrollToTop}
            className={`fixed ${showToast ? 'bottom-20' : 'bottom-4'} right-4 z-40 w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-amber-700 transition-all duration-200 transform hover:scale-110 flex items-center justify-center`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toast Notification - Bottom Right */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed bottom-4 right-4 z-50 max-w-sm w-full sm:max-w-md lg:max-w-lg ${
              toastType === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 border border-green-400' 
                : 'bg-gradient-to-r from-red-500 to-red-600 border border-red-400'
            } text-white rounded-xl shadow-2xl backdrop-blur-sm`}
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  toastType === 'success' ? 'bg-green-400/30' : 'bg-red-400/30'
                }`}>
                  {toastType === 'success' ? (
                    <span className="text-green-100 text-lg">✅</span>
                  ) : (
                    <span className="text-red-100 text-lg">⚠️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm sm:text-base font-medium leading-relaxed ${
                    toastType === 'success' ? 'text-green-50' : 'text-red-50'
                  }`}>
                    {toastMessage}
                  </p>
                </div>
                <button
                  onClick={() => setShowToast(false)}
                  className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </button>
              </div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aarti Booking Flow */}
      {showReusableBooking && selectedAarti && (
        <AartiBookingFlow
          selectedSlot={selectedAarti}
          onClose={() => {
            setShowReusableBooking(false)
            setSelectedAarti(null)
          }}
          onSuccess={(message: string) => {
            setShowReusableBooking(false)
            setSelectedAarti(null)
            showToastMessage(message, 'success')
            // Refresh submissions
            loadSubmissions()
          }}
        />
      )}
      
    </div>
  )
}

export default EventSchedule
