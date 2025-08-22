'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronDown, ChevronUp, Building, Home, Check, ChevronRight, Users, Calendar, ChevronLeft, X } from 'lucide-react'
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
  const [showAartiSchedule, setShowAartiSchedule] = useState(false)
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

              {/* Compact Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm px-2"
              >
                <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-orange-200">
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-500 rounded-full"></span>
                  <span className="font-semibold text-orange-700 text-xs sm:text-sm" style={{ fontFamily: 'Charter, serif' }}>{eventCount}</span>
                  <span className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Söhne, sans-serif' }}>Events</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-orange-200">
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-red-500 rounded-full"></span>
                  <span className="font-semibold text-red-700 text-xs sm:text-sm" style={{ fontFamily: 'Charter, serif' }}>Aug 23 - Sep 6</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-orange-200">
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-yellow-500 rounded-full"></span>
                  <span className="font-semibold text-yellow-700 text-xs sm:text-sm" style={{ fontFamily: 'Charter, serif' }}>7 PM</span>
                  <span className="text-gray-600 text-xs sm:text-sm" style={{ fontFamily: 'Söhne, sans-serif' }}>Most Events</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Daily Aarti Schedule Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mb-8 sm:mb-12"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-3 sm:mb-4 font-jaf-bernino">
                Daily Aarti Schedule
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4 font-charter">
                Click Morning or Evening slot to book your aarti
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
              {aartiSchedule.map((aarti, index) => {
                const isBooked = isSlotBooked(aarti.date, aarti.time)
                const booking = getSlotBooking(aarti.date, aarti.time)
                
                return (
                  <motion.div
                    key={`${aarti.date}-${aarti.time}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      isBooked 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
                        : 'bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 hover:from-orange-100 hover:to-amber-100'
                    } rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl`}
                    onClick={() => !isBooked && handleAartiCardClick(aarti)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-center sm:text-left">
                          <div className="text-lg sm:text-xl font-bold text-gray-800 mb-2 font-jaf-bernino">
                            {aarti.date}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center sm:justify-start">
                            <div className={`px-4 py-2 rounded-lg font-semibold text-sm sm:text-base ${
                              aarti.time === 'Morning' 
                                ? 'bg-orange-500 text-white' 
                                : 'bg-black text-white'
                            }`}>
                              {aarti.time}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {isBooked && (
                        <div className="flex-shrink-0 ml-4">
                          <div className="bg-green-500 text-white rounded-full p-2 sm:p-3">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Booking Info */}
                    {isBooked && booking && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-green-200"
                      >
                        <div className="text-center text-sm text-green-800 font-medium">
                          <div className="font-semibold">Booked by {booking.userName}</div>
                          <div className="text-xs">Flat {booking.flat} - Building {booking.building}</div>
                        </div>
          </motion.div>
        )}
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* Festival Events Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mb-8 sm:mb-12"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-800 mb-3 sm:mb-4 font-jaf-bernino">
                Festival Events
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4 font-charter">
                Explore all the exciting events and competitions planned for the festival
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4">
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
                    y: -8,
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                >
                  <EventCard key={event.id} event={event} index={index} />
                </motion.div>
              ))}
            </div>
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
