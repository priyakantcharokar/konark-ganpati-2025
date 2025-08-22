'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building, Home, Check, ChevronRight, Users, Calendar, X } from 'lucide-react'
import { databaseService, type Submission } from '@/lib/database-service'

interface FlatSelectionProps {
  onFlatSelect: (flatNumber: string) => void
}

// Import the actual flats data
const flatsData = {
  "A": ["A101", "A102", "A103", "A104", "A201", "A202", "A203", "A204", "A301", "A302", "A303", "A304", "A401", "A402", "A403", "A404", "A501", "A502", "A503", "A504", "A601", "A602", "A603", "A604", "A701", "A702", "A703", "A704"],
  "B": ["B101", "B102", "B103", "B104", "B201", "B202", "B203", "B204", "B301", "B302", "B303", "B304", "B401", "B402", "B403", "B404", "B501", "B502", "B503", "B504", "B601", "B602", "B603", "B604", "B701", "B702", "B703", "B704"],
  "C": ["C101", "C102", "C103", "C104", "C201", "C202", "C203", "C204", "C301", "C302", "C303", "C304", "C401", "C402", "C403", "C404", "C501", "C502", "C503", "C504", "C601", "C602", "C603", "C604", "C701", "C702", "C703", "C704"],
  "D": ["D101", "D102", "D103", "D104", "D201", "D202", "D203", "D204", "D301", "D302", "D303", "D304", "D401", "D402", "D403", "D404", "D501", "D502", "D503", "D504", "D601", "D602", "D603", "D604", "D701", "D702", "D703", "D704", "D801", "D802", "D803", "D804", "D901", "D902", "D903", "D904", "D1001", "D1002", "D1003", "D1004", "D1101", "D1102", "D1103", "D1104"],
  "E": ["E101", "E102", "E103", "E104", "E201", "E202", "E203", "E204", "E301", "E302", "E303", "E304", "E401", "E402", "E403", "E404", "E501", "E502", "E503", "E504", "E601", "E602", "E603", "E604", "E701", "E702", "E703", "E704"],
  "F": ["F101", "F102", "F103", "F104", "F201", "F202", "F203", "F204", "F301", "F302", "F303", "F304", "F401", "F402", "F403", "F404", "F501", "F502", "F503", "F504", "F601", "F602", "F603", "F604", "F701", "F702", "F703", "F704"],
  "G": ["G101", "G102", "G103", "G104", "G201", "G202", "G203", "G204", "G301", "G302", "G303", "G304", "G401", "G402", "G403", "G404", "G501", "G502", "G503", "G504", "G601", "G602", "G603", "G604", "G701", "G702", "G703", "G704"],
  "H": ["H101", "H102", "H103", "H104", "H201", "H202", "H203", "H204", "H301", "H302", "H303", "H304", "H401", "H402", "H403", "H404", "H501", "H502", "H503", "H504", "H601", "H602", "H603", "H604", "H701", "H702", "H703", "H704"]
}

const buildingInfo = {
  "A": { name: "Building A", floors: 7, totalFlats: 28, color: "from-blue-500 to-blue-600" },
  "B": { name: "Building B", floors: 7, totalFlats: 28, color: "from-green-500 to-green-600" },
  "C": { name: "Building C", floors: 7, totalFlats: 28, color: "from-purple-500 to-purple-600" },
  "D": { name: "Building D", floors: 11, totalFlats: 44, color: "from-orange-500 to-orange-600" },
  "E": { name: "Building E", floors: 7, totalFlats: 28, color: "from-pink-500 to-pink-600" },
  "F": { name: "Building F", floors: 7, totalFlats: 28, color: "from-indigo-500 to-indigo-600" },
  "G": { name: "Building G", floors: 7, totalFlats: 28, color: "from-teal-500 to-teal-600" },
  "H": { name: "Building H", floors: 7, totalFlats: 28, color: "from-red-500 to-red-600" }
}

const FlatSelection: React.FC<FlatSelectionProps> = ({ onFlatSelect }) => {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [selectedFlat, setSelectedFlat] = useState<string>('')
  const [showFlatSelection, setShowFlatSelection] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])

  // Load submissions from Supabase database
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const allBookings = await databaseService.getAllBookings()
        const submissionsFromDB = allBookings.map(booking => 
          databaseService.convertBookingToSubmission(booking)
        )
        setSubmissions(submissionsFromDB)
      } catch (error) {
        console.error('Error loading submissions from database:', error)
        setSubmissions([])
      }
    }

    loadSubmissions()
  }, [])

  const handleBuildingSelect = (building: string) => {
    setSelectedBuilding(building)
    setSelectedFlat('')
    setShowFlatSelection(true)
  }

  const handleFlatSelect = (flatNumber: string) => {
    // Check if flat is already booked
    const isFlatBooked = submissions.some(submission => 
      submission.flat === flatNumber && 
      submission.building === selectedBuilding
    )
    
    if (!isFlatBooked) {
      setSelectedFlat(flatNumber)
      onFlatSelect(flatNumber)
    }
  }

  const handleBackToBuildings = () => {
    setSelectedBuilding('')
    setSelectedFlat('')
    setShowFlatSelection(false)
  }

  if (showFlatSelection && selectedBuilding) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="w-full max-w-4xl mx-auto"
      >
        {/* Compact Hero Section - Show on ALL pages */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center py-8 px-6 rounded-2xl mb-8 shadow-lg border border-orange-200 relative overflow-hidden"
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mb-4"
            >
              <div className="text-3xl mb-2">🕉️</div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-800 bg-clip-text text-transparent mb-2">
                <span className="font-normal text-amber-700" style={{ fontFamily: 'Style Script, cursive', fontSize: '28px' }}>Konark Exotica</span>
                <span className="block text-lg md:text-xl mt-1" style={{ fontFamily: 'Style Script, cursive', fontSize: '20px' }}>Ganesh Pooja 2025</span>
              </h1>
            </motion.div>

            {/* Compact Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="text-sm md:text-base text-gray-800 mb-4 max-w-3xl mx-auto leading-relaxed font-medium"
              style={{ fontFamily: 'Charter, serif' }}
            >
              Experience the divine celebration with our complete festival schedule. From traditional ceremonies to exciting competitions, discover all the events planned for this auspicious occasion.
            </motion.p>

            {/* Compact Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              className="flex flex-wrap justify-center gap-4 text-xs md:text-sm"
            >
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-orange-200">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="font-semibold text-orange-700" style={{ fontFamily: 'Charter, serif' }}>13</span>
                <span className="text-gray-600" style={{ fontFamily: 'Söhne, sans-serif' }}>Events</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-orange-200">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="font-semibold text-red-700" style={{ fontFamily: 'Charter, serif' }}>Aug 23 - Sep 6</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-orange-200">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="font-semibold text-yellow-700" style={{ fontFamily: 'Charter, serif' }}>7 PM</span>
                <span className="text-gray-600" style={{ fontFamily: 'Söhne, sans-serif' }}>Most Events</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.button
            onClick={handleBackToBuildings}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back to Buildings
          </motion.button>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Select Your Flat in {buildingInfo[selectedBuilding as keyof typeof buildingInfo].name}
          </h2>
          <p className="text-gray-600 text-lg">
            Choose your specific flat number to continue
          </p>
        </div>

        {/* Flat Selection Grid */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Flat Availability Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
          >
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-700">
                  Available: {flatsData[selectedBuilding as keyof typeof flatsData].length - submissions.filter(s => s.building === selectedBuilding).length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-red-700">
                  Booked: {submissions.filter(s => s.building === selectedBuilding).length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-blue-700">
                  Total: {flatsData[selectedBuilding as keyof typeof flatsData].length}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
            {flatsData[selectedBuilding as keyof typeof flatsData].map((flatNumber) => {
              const isSelected = selectedFlat === flatNumber
              const floor = flatNumber.slice(1, -2)
              const flat = flatNumber.slice(-2)
              
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
                  whileHover={{ 
                    scale: isFlatBooked ? 1 : 1.05, 
                    y: isFlatBooked ? 0 : -2 
                  }}
                  whileTap={{ scale: isFlatBooked ? 1 : 0.95 }}
                  onClick={isFlatBooked ? undefined : () => handleFlatSelect(flatNumber)}
                  disabled={isFlatBooked}
                  className={`
                    relative p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center
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
                      className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                  
                  {isFlatBooked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                  
                  <span className={`text-xs text-gray-500 mb-1 ${isFlatBooked ? 'text-gray-400' : ''}`}>Floor {floor}</span>
                  <span className={`font-bold text-lg ${isFlatBooked ? 'text-gray-500' : ''}`}>{flat}</span>
                  <span className={`text-xs text-gray-400 mt-1 ${isFlatBooked ? 'text-gray-300' : ''}`}>{flatNumber}</span>
                  
                  {/* Booking Info Tooltip */}
                  {isFlatBooked && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 shadow-lg"
                    >
                      <div className="text-center">
                        <div className="font-semibold">Already Booked</div>
                        <div>{flatBooking?.userName}</div>
                        <div className="text-gray-300">
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

          {selectedFlat && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center p-4 bg-primary-50 rounded-xl border border-primary-200"
            >
              <div className="flex items-center justify-center gap-2 text-primary-700">
                <Home className="w-5 h-5" />
                <span className="font-semibold">Selected: {selectedFlat}</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Compact Hero Section - Show on ALL pages */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center py-8 px-6 rounded-2xl mb-8 shadow-lg border border-orange-200 relative overflow-hidden"
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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mb-4"
          >
            <div className="text-3xl mb-2">🕉️</div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-800 bg-clip-text text-transparent mb-2">
              <span className="font-normal text-amber-700" style={{ fontFamily: 'Style Script, cursive', fontSize: '28px' }}>Konark Exotica</span>
              <span className="block text-lg md:text-xl mt-1" style={{ fontFamily: 'Style Script, cursive', fontSize: '20px' }}>Ganesh Pooja 2025</span>
            </h1>
          </motion.div>

          {/* Compact Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="text-sm md:text-base text-gray-800 mb-4 max-w-3xl mx-auto leading-relaxed font-medium"
            style={{ fontFamily: 'Charter, serif' }}
          >
            Experience the divine celebration with our complete festival schedule. From traditional ceremonies to exciting competitions, discover all the events planned for this auspicious occasion.
          </motion.p>

          {/* Compact Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-4 text-xs md:text-sm"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-orange-200">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span className="font-semibold text-orange-700" style={{ fontFamily: 'Charter, serif' }}>13</span>
              <span className="text-gray-600" style={{ fontFamily: 'Söhne, sans-serif' }}>Events</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-orange-200">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="font-semibold text-red-700" style={{ fontFamily: 'Charter, serif' }}>Aug 23 - Sep 6</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-orange-200">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span className="font-semibold text-yellow-700" style={{ fontFamily: 'Charter, serif' }}>7 PM</span>
              <span className="text-gray-600" style={{ fontFamily: 'Söhne, sans-serif' }}>Most Events</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Select Your Building
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Choose your building first, then select your specific flat number to view the complete festival schedule
        </p>
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(buildingInfo).map(([building, info]) => {
          // Calculate availability for this building
          const totalFlats = flatsData[building as keyof typeof flatsData].length
          const bookedFlats = submissions.filter(s => s.building === building).length
          const availableFlats = totalFlats - bookedFlats
          
          return (
            <motion.div
              key={building}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBuildingSelect(building)}
              className="cursor-pointer group"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-primary-200 transition-all duration-300">
                {/* Building Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 relative`}>
                  <Building className="w-8 h-8 text-white" />
                  
                  {/* Booked Indicator */}
                  {bookedFlats > 0 && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{bookedFlats}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Building Info */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                  {info.name}
                </h3>
                
                <div className="space-y-2 text-center text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{info.totalFlats} Flats</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{info.floors} Floors</span>
                  </div>
                </div>
                
                {/* Availability Badge */}
                <div className="mt-3 text-center">
                  <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                    availableFlats === 0 
                      ? 'bg-red-500 text-white' 
                      : availableFlats < totalFlats * 0.3 
                        ? 'bg-yellow-500 text-white'
                        : 'bg-green-500 text-white'
                  }`}>
                    {availableFlats}/{totalFlats} Available
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className="mt-4 text-center">
                  <div className={`inline-flex items-center gap-2 text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors`}>
                    Select Building
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-center"
      >
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
          <h3 className="text-lg font-semibold text-primary-800 mb-2">
            🏢 Community Layout
          </h3>
          <p className="text-primary-700 text-sm">
            Our society consists of 8 buildings with a total of 256 flats. 
            Building D is our largest with 11 floors, while others have 7 floors each.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default FlatSelection
