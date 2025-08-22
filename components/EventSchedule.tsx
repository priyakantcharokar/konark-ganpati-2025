'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronDown, ChevronUp, Building, Home, Check, ChevronRight, Users, Calendar, ChevronLeft, X } from 'lucide-react'
import EventCard from './EventCard'

interface Event {
  id: string
  title: string
  date: string
  time: string
  description: string
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
  const [showFlatSelection, setShowFlatSelection] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [selectedFlat, setSelectedFlat] = useState<string>('')
  const [selectedAarti, setSelectedAarti] = useState<{ date: string; time: string } | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [submissions, setSubmissions] = useState<Array<{
    id: string
    aartiSchedule: { date: string; time: string }
    building: string
    flat: string
    userName: string
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
          const building = flat.charAt(0) // Extract building letter (A, B, C, D, E, F, G, H)
          if (!flatsData[building]) {
            flatsData[building] = []
          }
          flatsData[building].push(flat)
        })
        
        setFlatsData(flatsData)
        
        // Generate building info
        Object.entries(flatsData).forEach(([building, flats], index) => {
          const maxFloor = Math.max(...flats.map(f => parseInt(f.slice(1, -2))))
          buildingInfoData[building] = {
            name: `Building ${building}`,
            floors: maxFloor,
            totalFlats: flats.length,
            color: colors[index % colors.length]
          }
        })
        setBuildingInfo(buildingInfoData)

        // Load events data
        const eventsResponse = await fetch('/events.json')
        if (!eventsResponse.ok) throw new Error('Failed to load events data')
        const eventsData = await eventsResponse.json()
        setEvents(eventsData)
      } catch (error) {
        console.error('Error loading data:', error)
        setLoadError(error instanceof Error ? error.message : 'Failed to load data')
        // Set empty defaults if loading fails
        setAartiSchedule([])
        setFlatsData({})
        setBuildingInfo({})
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Initialize submissions from localStorage only (no hardcoded data)
  useEffect(() => {
    // Clear any existing bookings to start fresh
    localStorage.removeItem('ganeshPoojaBookings')
    setSubmissions([])
  }, [])

  // Save submissions to localStorage whenever they change
  useEffect(() => {
    if (submissions.length > 0) {
      localStorage.setItem('ganeshPoojaBookings', JSON.stringify(submissions))
    }
  }, [submissions])

  const [eventCount, setEventCount] = useState(0)

  // Counting animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setEventCount(prev => {
          if (prev < 13) {
            return prev + 1
          } else {
            clearInterval(interval)
            return 13
          }
        })
      }, 300) // Count every 300ms for subtle animation
      
      return () => clearInterval(interval)
    }, 1500) // Start counting after 1.5 second delay
    
    return () => clearTimeout(timer)
  }, []) // Remove showFlatSelection dependency

  // Mobile navigation helpers
  const handleMobileBack = () => {
    if (selectedFlat && selectedBuilding) {
      setSelectedFlat('')
    } else if (selectedBuilding) {
      setSelectedBuilding('')
    } else if (showFlatSelection) {
      setShowFlatSelection(false)
      setSelectedAarti(null)
    }
  }

  const getMobileBackText = () => {
    if (selectedFlat && selectedBuilding) {
      return 'Back to Building'
    } else if (selectedBuilding) {
      return 'Back to Aarti'
    } else if (showFlatSelection) {
      return 'Back to Schedule'
    }
    return 'Back'
  }

  const getMobileTitle = () => {
    if (selectedFlat && selectedBuilding) {
      return `Flat ${selectedFlat}`
    } else if (selectedBuilding) {
      return `Building ${selectedBuilding}`
    } else if (showFlatSelection) {
      return 'Select Building'
    }
    return 'Ganesh Pooja 2025'
  }

  // Festival events data
  const handleAartiCardClick = (aarti: { date: string; time: string }) => {
    setSelectedAarti(aarti)
    setShowFlatSelection(true)
  }

  const handleBuildingSelect = (building: string) => {
    setSelectedBuilding(building)
    setSelectedFlat('')
  }

  const handleFlatSelect = (flatNumber: string) => {
    setSelectedFlat(flatNumber)
    // Here you can add logic to handle flat selection
    console.log('Selected flat:', flatNumber)
  }

  const handleBackToAarti = () => {
    setShowFlatSelection(false)
    setSelectedBuilding('')
    setSelectedFlat('')
    setSelectedAarti(null)
    setUserName('')
    setIsSubmitted(false)
  }

  const handleBackToBuildings = () => {
    setSelectedBuilding('')
    setSelectedFlat('')
    setUserName('')
    setIsSubmitted(false)
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

  const handleSubmit = () => {
    if (!userName.trim()) {
      showToastMessage('Please enter your name', 'error');
      return;
    }

    const submission = {
      id: Date.now().toString(),
      aartiSchedule: selectedAarti!,
      building: selectedBuilding!,
      flat: selectedFlat!,
      userName: userName.trim(),
      timestamp: new Date()
    };

    setSubmissions(prev => [...prev, submission]);
    showToastMessage(`Pooja slot confirmed! ${userName} from Flat ${selectedFlat} in Building ${selectedBuilding} has booked ${selectedAarti!.time} Aarti on ${selectedAarti!.date}`);
    
    // Reset all states to return to landing page
    setTimeout(() => {
      setShowFlatSelection(false);
      setSelectedBuilding('');
      setSelectedFlat('');
      setSelectedAarti(null);
      setUserName('');
      setIsSubmitted(false);
    }, 2000); // Wait 2 seconds for toast to be visible
  };



  // Selected Aarti Display Component
  const SelectedAartiDisplay = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-200"
    >
      <div className="text-center mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <span className="text-xl sm:text-2xl">🕉️</span>
          </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Charter, serif' }}>
          Selected Aarti Schedule
          </h3>
      </div>
      
      <div className="space-y-2 sm:space-y-3 text-center">
        <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-yellow-200">
          <div className="text-xs sm:text-sm text-gray-600 mb-1" style={{ fontFamily: 'Söhne, sans-serif' }}>Date</div>
          <div className="font-semibold text-gray-800 text-sm sm:text-base" style={{ fontFamily: 'Charter, serif' }}>{selectedAarti?.date}</div>
        </div>
        
        <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-yellow-200">
          <div className="text-xs sm:text-sm text-gray-600 mb-1" style={{ fontFamily: 'Söhne, sans-serif' }}>Time</div>
          <div className="font-semibold text-gray-800 text-sm sm:text-base" style={{ fontFamily: 'Charter, serif' }}>{selectedAarti?.time}</div>
        </div>
      </div>
    </motion.div>
    )

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
          {/* Mobile Navigation Header - Only show on mobile when navigating */}
          {(showFlatSelection || selectedBuilding || selectedFlat) && (
            <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
              className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
            >
              <div className="flex items-center justify-between p-3 sm:p-4">
                <button
                  onClick={handleMobileBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {getMobileBackText()}
                </button>
                <h1 className="text-base font-semibold text-gray-800 truncate max-w-32" style={{ fontFamily: 'Charter, serif' }}>
                  {getMobileTitle()}
                </h1>
                <div className="w-8"></div> {/* Spacer for centering */}
              </div>
            </motion.div>
          )}

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
                <div className="text-2xl sm:text-3xl mb-2">🕉️</div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-800 bg-clip-text text-transparent mb-2">
                  <span className="font-normal text-amber-700" style={{ fontFamily: 'Style Script, cursive', fontSize: 'clamp(20px, 4vw, 90px)' }}>Konark Exotica</span>
                  <span className="block text-sm sm:text-base md:text-lg lg:text-xl mt-1" style={{ fontFamily: 'Style Script, cursive', fontSize: 'clamp(16px, 3.5vw, 20px)' }}>Ganesh Pooja 2025</span>
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

          {/* Conditional Content - Aarti Schedule, Building Selection, or Flat Selection */}
          {showFlatSelection ? (
            selectedBuilding ? (
              // Flat Selection Page
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                {/* Main Content - Flat Selection */}
                <div className="flex-1 order-2 lg:order-1">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="w-full max-w-4xl mx-auto"
                  >
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                      <motion.button
                        onClick={() => setSelectedBuilding('')}
                        className="mb-3 sm:mb-4 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm sm:text-base"
                        style={{ fontFamily: 'Söhne, sans-serif' }}
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Back to Building Selection</span>
                        <span className="sm:hidden">Back</span>
                      </motion.button>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4" style={{ fontFamily: 'Style Script, cursive' }}>
                        Select Your Flat in Building {selectedBuilding}
                      </h2>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4" style={{ fontFamily: 'Söhne, sans-serif' }}>
                        Choose your specific flat number from the available options
                      </p>
                    </div>

                    {/* Flat Selection Grid */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8">
                      {/* Flat Availability Summary */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                      >
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-green-700" style={{ fontFamily: 'Söhne, sans-serif' }}>
                              Available: {flatsData[selectedBuilding as keyof typeof flatsData].length - submissions.filter(s => s.building === selectedBuilding).length}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-red-500 rounded-full"></div>
                            <span className="font-medium text-red-700" style={{ fontFamily: 'Söhne, sans-serif' }}>
                              Booked: {submissions.filter(s => s.building === selectedBuilding).length}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-blue-700" style={{ fontFamily: 'Söhne, sans-serif' }}>
                              Total: {flatsData[selectedBuilding as keyof typeof flatsData].length}
                            </span>
          </div>
        </div>
                      </motion.div>

                      <div className="flex flex-col-reverse gap-3 sm:gap-4">
                        {Array.from({ length: Math.max(...flatsData[selectedBuilding as keyof typeof flatsData].map(f => parseInt(f.slice(1, -2)))) }, (_, floorIndex) => {
                          const floor = Math.max(...flatsData[selectedBuilding as keyof typeof flatsData].map(f => parseInt(f.slice(1, -2)))) - floorIndex
                          const floorFlats = flatsData[selectedBuilding as keyof typeof flatsData].filter(f => f.slice(1, -2) === floor.toString())
                          
                          return (
                            <motion.div
                              key={floor}
                              className="flex flex-col items-center gap-2 sm:gap-3"
                            >
                              {/* Floor Number */}
                              <div className="text-center mb-2">
                                <span className="text-sm sm:text-lg font-semibold text-gray-700 bg-gray-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">Floor {floor}</span>
                              </div>
                              
                              {/* Flats Row */}
                              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-full">
                                {floorFlats.map((flatNumber, index) => {
                                  const isSelected = selectedFlat === flatNumber
                                  
                                  // Check if this flat is already booked for any aarti session
                                  const isFlatBooked = submissions.some(submission => 
                                    submission.flat === flatNumber && 
                                    submission.building === selectedBuilding
                                  )
                                  
                                  // Get booking details for this flat
                                  const flatBooking = submissions.find(submission => 
                                    submission.flat === flatNumber && 
                                    submission.building === selectedBuilding
                                  )
                                  
                                  return (
                                    <motion.button
                                      key={flatNumber}
                                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      transition={{ 
                                        delay: index * 0.05, 
                                        duration: 0.5, 
                                        ease: "easeOut" 
                                      }}
                                      whileHover={{ 
                                        scale: isFlatBooked ? 1 : 1.03, 
                                        y: isFlatBooked ? 0 : -2,
                                        transition: { duration: 0.3, ease: "easeOut" }
                                      }}
                                      whileTap={{ 
                                        scale: isFlatBooked ? 1 : 0.97,
                                        transition: { duration: 0.1 }
                                      }}
                                      onClick={isFlatBooked ? undefined : () => handleFlatSelect(flatNumber)}
                                      disabled={isFlatBooked}
                                      className={`
                                        w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl border-2 transition-all duration-500 ease-out flex items-center justify-center relative
                                        ${isSelected 
                                          ? 'border-primary-500 bg-primary-50 text-primary-600 shadow-lg' 
                                          : isFlatBooked
                                            ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-75'
                                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                        }
                                      `}
                                    >
                                      {isSelected && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-primary-500 rounded-full flex items-center justify-center"
                                        >
                                          <Check className="w-2 h-2 sm:w-4 sm:h-4 text-white" />
                                        </motion.div>
                                      )}
                                      
                                      {isFlatBooked && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center"
                                        >
                                          <X className="w-2 h-2 sm:w-4 sm:h-4 text-white" />
                                        </motion.div>
                                      )}
                                      
                                      <span className={`font-bold text-sm sm:text-lg md:text-2xl ${isFlatBooked ? 'text-gray-500' : ''}`}>
                                        {flatNumber}
                                      </span>
                                      
                                      {/* Booking Info Tooltip */}
                                      {isFlatBooked && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 sm:px-3 py-2 rounded-lg whitespace-nowrap z-10 shadow-lg max-w-32 sm:max-w-none"
                                        >
                                          <div className="text-center">
                                            <div className="font-semibold">Already Booked</div>
                                            <div className="truncate">{flatBooking?.userName}</div>
                                            <div className="text-gray-300 text-xs">
                                              {flatBooking?.aartiSchedule.date} - {flatBooking?.aartiSchedule.time}
                                            </div>
                                          </div>
                                          {/* Arrow pointing up */}
                                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                                        </motion.div>
                                      )}
                                    </motion.button>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>

                      {selectedFlat && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 sm:mt-6 text-center p-3 sm:p-4 bg-primary-50 rounded-xl border border-primary-200"
                        >
                          <div className="flex items-center justify-center gap-2 text-primary-700">
                            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="font-semibold text-sm sm:text-base">Selected: {selectedFlat}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Right Side - Selected Aarti Display */}
                <div className="w-full lg:w-80 flex-shrink-0 order-1 lg:order-2">
                  <div className="sticky top-4 sm:top-8 space-y-4 sm:space-y-6">
                    {/* Building Overview - Show Booked Flats */}
        

                                        {/* Name Input and Submit Button */}
                    {selectedFlat && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-primary-200"
                      >
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 text-center" style={{ fontFamily: 'Charter, serif' }}>
                          👤 Enter Your Details
                        </h3>
                        
                        {/* Selected Flat Display - Prominent */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mb-4 sm:mb-6 text-center p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl border border-blue-200 shadow-lg"
                        >
                          <div className="flex items-center justify-center gap-2 text-white">
                            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="text-lg sm:text-xl font-bold">Selected: {selectedFlat}</span>
                          </div>
                          <div className="text-sm sm:text-base text-blue-100 mt-1">
                            Building {selectedBuilding}
                          </div>
                        </motion.div>
                        
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2" style={{ fontFamily: 'Söhne, sans-serif' }}>
                              Full Name *
                            </label>
              <input
                type="text"
                              placeholder="Enter your name"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                              style={{ fontFamily: 'Söhne, sans-serif' }}
                              required
              />
            </div>

                          <button
                            onClick={handleSubmit}
                            disabled={!userName.trim()}
                            className={`w-full font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base ${
                              userName.trim()
                                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            style={{ fontFamily: 'Söhne, sans-serif' }}
                          >
                            🎯 Confirm Pooja Slot
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Selected Aarti Display */}
                    <SelectedAartiDisplay />
                  </div>
                </div>
              </div>
            ) : (
              // Building Selection Page
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                {/* Main Content - Building Selection */}
                <div className="flex-1 order-2 lg:order-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-6xl mx-auto"
                  >
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                      <motion.button
                        onClick={() => setShowFlatSelection(false)}
                        className="mb-3 sm:mb-4 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm sm:text-base"
                        style={{ fontFamily: 'Söhne, sans-serif' }}
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Back to Aarti Schedule</span>
                        <span className="sm:hidden">Back</span>
                      </motion.button>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4" style={{ fontFamily: 'Style Script, cursive' }}>
                        Select Your Building
                      </h2>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4" style={{ fontFamily: 'Söhne, sans-serif' }}>
                        Choose the building where your flat is located
                      </p>
            </div>

                    {/* Buildings Grid - Show A, B, C, D, E, F, G, H */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0 p-6 sm:p-8 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 rounded-2xl sm:rounded-3xl border border-white/20 backdrop-blur-sm">
                      {Object.entries(buildingInfo).map(([building, info], index) => {
                        // Calculate availability for this building
                        const totalFlats = flatsData[building as keyof typeof flatsData].length
                        const bookedFlats = submissions.filter(s => s.building === building).length
                        const availableFlats = totalFlats - bookedFlats
                        
                        return (
                          <motion.button
                            key={building}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ 
                              delay: index * 0.1, 
                              duration: 0.6, 
                              ease: "easeOut" 
                            }}
                            whileHover={{ 
                              scale: 1.03, 
                              y: -3,
                              transition: { duration: 0.4, ease: "easeOut" }
                            }}
                            whileTap={{ 
                              scale: 0.97,
                              transition: { duration: 0.1 }
                            }}
                            onClick={() => handleBuildingSelect(building)}
                            className="w-full aspect-square bg-white/20 backdrop-blur-md border border-white/30 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 ease-out flex flex-col items-center justify-center text-white font-bold hover:bg-white/30 hover:border-white/50 relative overflow-hidden"
                          >
                            {/* Main Building Letter */}
                            <span className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl mb-1 sm:mb-2 font-bold drop-shadow-lg filter ${
                              building === 'A' ? 'text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]' :
                              building === 'B' ? 'text-green-600 drop-shadow-[0_0_20px_rgba(22,163,74,0.4)]' :
                              building === 'C' ? 'text-purple-600 drop-shadow-[0_0_20px_rgba(147,51,234,0.4)]' :
                              building === 'D' ? 'text-orange-600 drop-shadow-[0_0_20px_rgba(234,88,12,0.4)]' :
                              building === 'E' ? 'text-pink-600 drop-shadow-[0_0_20px_rgba(219,39,119,0.4)]' :
                              building === 'F' ? 'text-indigo-600 drop-shadow-[0_0_20px_rgba(79,70,229,0.4)]' :
                              building === 'G' ? 'text-teal-600 drop-shadow-[0_0_20px_rgba(13,148,136,0.4)]' :
                              building === 'H' ? 'text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'text-gray-800'
                            }`}>{building}</span>
                            
                                                        {/* Availability Badge */}
                            

                            {/* Booked Indicator */}
                            {bookedFlats > 0 && (
                              <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500/90 border border-red-600/50 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                                  <span className="text-white text-xs font-bold">{bookedFlats}</span>
                                </div>
                              </div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </motion.div>
                </div>

                {/* Right Side - Selected Aarti Display */}
                <div className="w-full lg:w-80 flex-shrink-0 order-1 lg:order-2">
                  <div className="sticky top-4 sm:top-8">
                    <SelectedAartiDisplay />
                  </div>
                </div>
              </div>
            )
          ) : (
            // Aarti Schedule Page (Landing Page)
            <>
              {/* Aarti Schedule Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100"
              >
                {/* Header with Toggle Button */}
                <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                    <div className="text-center flex-1">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4" style={{ fontFamily: 'Style Script, cursive' }}>
                        Daily Aarti Schedule
                      </h2>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4" style={{ fontFamily: 'Söhne, sans-serif' }}>
                        Select your preferred aarti session to proceed with flat booking
            </p>
          </div>
                    
                    <motion.button
                      onClick={() => setShowAartiSchedule(!showAartiSchedule)}
                      className="w-full sm:w-auto p-2.5 sm:p-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-sm font-medium" style={{ fontFamily: 'Söhne, sans-serif' }}>
                        {showAartiSchedule ? 'Hide Schedule' : 'Show Schedule'}
                      </span>
                      {showAartiSchedule ? (
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </motion.button>
                  </div>
        </div>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {showAartiSchedule && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-6 lg:p-8">
                        {/* Aarti Schedule Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                          {(() => {
                            // Group aarti schedule by date
                            const groupedAarti = Object.entries(
                              aartiSchedule.reduce((acc, aarti) => {
                                if (!acc[aarti.date]) {
                                  acc[aarti.date] = [];
                                }
                                acc[aarti.date].push(aarti);
                                return acc;
                              }, {} as Record<string, typeof aartiSchedule>)
                            );

                            return groupedAarti.map(([date, sessions], dateIndex) => {
                              // Check if any session for this date is booked
                              const isAnyBooked = sessions.some(session => 
                                submissions.some(submission => 
                                  submission.aartiSchedule.date === session.date && 
                                  submission.aartiSchedule.time === session.time
                                )
                              );

                              // Get booking details for this date
                              const dateBookings = sessions.map(session => 
                                submissions.find(submission => 
                                  submission.aartiSchedule.date === session.date && 
                                  submission.aartiSchedule.time === session.time
                                )
                              ).filter(Boolean);

                              return (
          <motion.div
                                  key={date}
                                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{ 
                                    delay: dateIndex * 0.1, 
                                    duration: 0.6, 
                                    ease: "easeOut" 
                                  }}
                                  className={`bg-white rounded-lg sm:rounded-xl border transition-all duration-300 ${
                                    isAnyBooked
                                      ? 'border-gray-300 bg-gray-50'
                                      : 'border-yellow-200 hover:border-yellow-300 hover:shadow-md'
                                  }`}
                                >
                                  {/* Date Header - Always Visible */}
                                  <div className="p-2.5 sm:p-3 border-b border-gray-100">
                                    <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 text-center leading-tight" style={{ fontFamily: 'Charter, serif' }}>
                                      {date}
                                    </h3>
                                  </div>

                                  {/* Time Slots - Collapsible */}
                                  <div className="p-2.5 sm:p-3">
                                    {sessions.map((session, sessionIndex) => {
                                      const isBooked = submissions.some(submission => 
                                        submission.aartiSchedule.date === session.date && 
                                        submission.aartiSchedule.time === session.time
                                      );
                                      
                                      const booking = submissions.find(submission => 
                                        submission.aartiSchedule.date === session.date && 
                                        submission.aartiSchedule.time === session.time
                                      );

                                      return (
                                        <motion.button
                                          key={`${date}-${session.time}`}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: sessionIndex * 0.1 }}
                                          onClick={isBooked ? undefined : () => handleAartiCardClick(session)}
                                          disabled={isBooked}
                                          className={`w-full mb-2 last:mb-0 p-2 sm:p-2.5 rounded-lg transition-all duration-200 ${
                                            isBooked
                                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                              : 'bg-yellow-50 hover:bg-yellow-100 cursor-pointer border border-yellow-200 hover:border-yellow-300'
                                          }`}
                                        >
                                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                            <div className="flex items-center gap-2">
                                              <Clock className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                                isBooked ? 'text-gray-400' : 'text-yellow-600'
                                              }`} />
                                              <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                                                session.time === 'Morning' 
                                                  ? isBooked 
                                                    ? 'text-blue-500 bg-blue-100' 
                                                    : 'text-blue-700 bg-blue-200'
                                                  : isBooked 
                                                    ? 'text-yellow-500 bg-yellow-100' 
                                                    : 'text-yellow-700 bg-yellow-200'
                                              }`}>
                                                {session.time}
                                              </span>
                                            </div>

                                            {isBooked ? (
                                              <div className="text-xs text-gray-500 text-center sm:text-right">
                                                <div className="font-medium">Booked by:</div>
                                                <div className="truncate">{booking?.userName}</div>
                                                <div>Flat {booking?.flat}</div>
                                              </div>
                                            ) : (
                                              <div className="text-xs text-yellow-600 text-center sm:text-right opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                Click to select
                                              </div>
                                            )}
                                          </div>
                                        </motion.button>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              );
                            });
                          })()}
                        </div>
            </div>
          </motion.div>
        )}
                </AnimatePresence>
              </motion.div>

              {/* Events Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100"
              >
                <div className="text-center mb-8 sm:mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mb-4 sm:mb-6"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <span className="text-2xl sm:text-3xl">🎉</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-800 bg-clip-text text-transparent mb-3 sm:mb-4" style={{ fontFamily: 'Style Script, cursive' }}>
                      Festival Events
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4" style={{ fontFamily: 'Söhne, sans-serif' }}>
                      Discover all the exciting events planned for this auspicious occasion. From traditional ceremonies to thrilling competitions, experience the magic of Ganesh Pooja 2025.
                    </p>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1, 
                        duration: 0.7, 
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
              </motion.div>

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
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6" style={{ fontFamily: 'Style Script, cursive' }}>
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
    </div>
  )
}

export default EventSchedule
