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

// Aarti schedule data from aarti.json
const aartiSchedule = [
  { date: "Wednesday, 27th August", time: "Morning" },
  { date: "Wednesday, 27th August", time: "Evening" },
  { date: "Thursday, 28th August", time: "Morning" },
  { date: "Thursday, 28th August", time: "Evening" },
  { date: "Friday, 29th August", time: "Morning" },
  { date: "Friday, 29th August", time: "Evening" },
  { date: "Saturday, 30th August", time: "Morning" },
  { date: "Saturday, 30th August", time: "Evening" },
  { date: "Sunday, 31st August", time: "Morning" },
  { date: "Sunday, 31st August", time: "Evening" },
  { date: "Monday, 1st September", time: "Morning" },
  { date: "Monday, 1st September", time: "Evening" },
  { date: "Tuesday, 2nd September", time: "Morning" },
  { date: "Tuesday, 2nd September", time: "Evening" },
  { date: "Wednesday, 3rd September", time: "Morning" },
  { date: "Wednesday, 3rd September", time: "Evening" },
  { date: "Thursday, 4th September", time: "Morning" },
  { date: "Thursday, 4th September", time: "Evening" },
  { date: "Friday, 5th September", time: "Morning" },
  { date: "Friday, 5th September", time: "Evening" },
  { date: "Saturday, 6th September", time: "Morning" }
]

// Flats data from flats.json
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

const EventSchedule: React.FC<EventScheduleProps> = ({ userPhone, userFlat, onLogout }) => {
  const [showAartiSchedule, setShowAartiSchedule] = useState(false)
  const [showFlatSelection, setShowFlatSelection] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [selectedFlat, setSelectedFlat] = useState<string>('')
  const [selectedAarti, setSelectedAarti] = useState<{ date: string; time: string } | null>(null)
  const [userName, setUserName] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissions, setSubmissions] = useState<Array<{
    id: string
    aartiSchedule: { date: string; time: string }
    building: string
    flat: string
    userName: string
    timestamp: Date
  }>>([])

  // Initialize submissions from localStorage and add sample data
  useEffect(() => {
    // Load existing submissions from localStorage
    const savedSubmissions = localStorage.getItem('ganeshPoojaBookings')
    let existingSubmissions: Array<{
      id: string
      aartiSchedule: { date: string; time: string }
      building: string
      flat: string
      userName: string
      timestamp: Date
    }> = []
    
    if (savedSubmissions) {
      try {
        existingSubmissions = JSON.parse(savedSubmissions)
        // Convert timestamp strings back to Date objects
        existingSubmissions = existingSubmissions.map(sub => ({
          ...sub,
          timestamp: new Date(sub.timestamp)
        }))
      } catch (error) {
        console.error('Error parsing saved submissions:', error)
        existingSubmissions = []
      }
    }

    // Add sample data if no existing submissions
    if (existingSubmissions.length === 0) {
      const sampleSubmissions = [
        {
          id: 'sample-1',
          aartiSchedule: { date: "Wednesday, 27th August", time: "Morning" },
          building: 'A',
          flat: 'A101',
          userName: 'Priya Sharma',
          timestamp: new Date('2025-08-20T10:00:00Z')
        },
        {
          id: 'sample-2',
          aartiSchedule: { date: "Wednesday, 27th August", time: "Evening" },
          building: 'B',
          flat: 'B203',
          userName: 'Rajesh Patel',
          timestamp: new Date('2025-08-20T11:00:00Z')
        },
        {
          id: 'sample-3',
          aartiSchedule: { date: "Thursday, 28th August", time: "Morning" },
          building: 'C',
          flat: 'C305',
          userName: 'Meera Singh',
          timestamp: new Date('2025-08-20T12:00:00Z')
        },
        {
          id: 'sample-4',
          aartiSchedule: { date: "Friday, 29th August", time: "Evening" },
          building: 'D',
          flat: 'D401',
          userName: 'Amit Kumar',
          timestamp: new Date('2025-08-20T13:00:00Z')
        }
      ]
      existingSubmissions = sampleSubmissions
      // Save sample data to localStorage
      localStorage.setItem('ganeshPoojaBookings', JSON.stringify(sampleSubmissions))
    }

    setSubmissions(existingSubmissions)
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

  // Festival events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Idol Making',
      date: 'Saturday, 23rd August',
      time: 'After 7 PM',
      description: 'Creative idol making session where participants can showcase their artistic skills in creating beautiful Ganpati idols.',
      organizers: 'Society Committee',
      category: 'competition'
    },
    {
      id: '2',
      title: 'Ganapati Sthapana',
      date: 'Wednesday, 27th August',
      time: 'Morning',
      description: 'Sacred ceremony to install and consecrate the Ganpati idol with traditional rituals and prayers.',
      organizers: 'Religious Committee',
      category: 'ceremony'
    },
    {
      id: '3',
      title: 'Karaoke & Modak Making Competition',
      date: 'Wednesday, 27th August',
      time: 'Evening (After 7 PM)',
      description: 'Fun-filled evening with karaoke performances and traditional modak making competition.',
      organizers: 'Sneha, Nitin',
      category: 'competition'
    },
    {
      id: '4',
      title: 'Group & Solo Performances',
      date: 'Thursday, 28th August',
      time: 'After 7 PM',
      description: 'Cultural evening featuring group and solo performances including dance, music, and drama.',
      organizers: 'Bhagyashree, Shraddha',
      category: 'performance'
    },
    {
      id: '5',
      title: 'Fancy Dress & Fashion Show',
      date: 'Friday, 29th August',
      time: 'After 7 PM',
      description: 'Exciting fancy dress competition for kids and adults, followed by a glamorous fashion show.',
      organizers: 'Bharati, Rohini',
      category: 'competition'
    },
    {
      id: '6',
      title: 'Couple Games & Team Building',
      date: 'Saturday, 30th August',
      time: 'After 7 PM',
      description: 'Fun couple games, team building activities, and classic musical chair competition.',
      organizers: 'Priya, Pooja',
      category: 'game'
    },
    {
      id: '7',
      title: 'Antakshari & Cooking Competition',
      date: 'Sunday, 31st August',
      time: 'After 7 PM',
      description: 'Musical antakshari competition and cooking competition for both male and female participants.',
      organizers: 'Society Committee',
      category: 'competition'
    },
    {
      id: '8',
      title: 'Tambola & Stalls',
      date: 'Monday, 1st September',
      time: 'After 7 PM',
      description: 'Exciting tambola game with various stalls including in-house and outside vendors.',
      organizers: 'Society Committee',
      category: 'game'
    },
    {
      id: '9',
      title: 'Sundarkand & 56 Bhog',
      date: 'Tuesday, 2nd September',
      time: 'After 7 PM',
      description: 'Sacred recitation of Sundarkand and preparation of 56 different types of offerings.',
      organizers: 'Deepika, Swati',
      category: 'ceremony'
    },
    {
      id: '10',
      title: 'Best Out of Waste & Recitation',
      date: 'Wednesday, 3rd September',
      time: 'After 7 PM',
      description: 'Creative competition using waste materials and recitation competitions.',
      organizers: 'Society Committee',
      category: 'competition'
    },
    {
      id: '11',
      title: 'Anandmela & Drawing Competition',
      date: 'Thursday, 4th September',
      time: 'After 7 PM',
      description: 'Joyful celebration with drawing competition for all age groups.',
      organizers: 'Society Committee',
      category: 'competition'
    },
    {
      id: '12',
      title: 'Prize Distribution & Mahaprasad',
      date: 'Friday, 5th September',
      time: 'After 7 PM',
      description: 'Grand finale with prize distribution, mahaprasad, Atharvshirsh recitation, and Ganapati Naam Pathan.',
      organizers: 'Society Committee',
      category: 'ceremony'
    },
    {
      id: '13',
      title: 'Ganapati Visarjan',
      date: 'Saturday, 6th September',
      time: 'Evening',
      description: 'Emotional farewell ceremony to bid goodbye to Lord Ganapati with traditional visarjan rituals.',
      organizers: 'Religious Committee',
      category: 'ceremony'
    }
  ]

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

  const handleSubmit = () => {
    if (!userName.trim()) {
      alert('Please enter your name');
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
    alert(`Pooja slot confirmed! ${userName} from Flat ${selectedFlat} has booked ${selectedAarti!.time} Aarti on ${selectedAarti!.date}`);
    
    // Reset all states to return to landing page
    setShowFlatSelection(false);
    setSelectedBuilding('');
    setSelectedFlat('');
    setSelectedAarti(null);
    setUserName('');
    setIsSubmitted(false);
  };

  // Selected Aarti Display Component
  const SelectedAartiDisplay = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200"
    >
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">��️</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Charter, serif' }}>
          Selected Aarti Schedule
        </h3>
      </div>
      
      <div className="space-y-3 text-center">
        <div className="bg-white rounded-xl p-3 border border-yellow-200">
          <div className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Söhne, sans-serif' }}>Date</div>
          <div className="font-semibold text-gray-800" style={{ fontFamily: 'Charter, serif' }}>{selectedAarti?.date}</div>
        </div>
        
        <div className="bg-white rounded-xl p-3 border border-yellow-200">
          <div className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Söhne, sans-serif' }}>Time</div>
          <div className="font-semibold text-gray-800" style={{ fontFamily: 'Charter, serif' }}>{selectedAarti?.time}</div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="w-full">
      {/* Compact Hero Section - Show on ALL pages */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm md:text-base text-gray-800 mb-4 max-w-3xl mx-auto leading-relaxed font-medium"
            style={{ fontFamily: 'Charter, serif' }}
          >
            Experience the divine celebration with our complete festival schedule. From traditional ceremonies to exciting competitions, discover all the events planned for this auspicious occasion.
          </motion.p>

          {/* Compact Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4 text-xs md:text-sm"
          >
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-orange-200">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span className="font-semibold text-orange-700" style={{ fontFamily: 'Charter, serif' }}>{eventCount}</span>
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

      {/* Conditional Content - Aarti Schedule, Building Selection, or Flat Selection */}
      {showFlatSelection ? (
        selectedBuilding ? (
          // Flat Selection Page
          <div className="flex gap-8">
            {/* Main Content - Flat Selection */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full max-w-4xl mx-auto"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.button
                    onClick={() => setSelectedBuilding('')}
                    className="mb-4 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    style={{ fontFamily: 'Söhne, sans-serif' }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Building Selection
                  </motion.button>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Charter, serif' }}>
                    Select Your Flat in Building {selectedBuilding}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Söhne, sans-serif' }}>
                    Choose your specific flat number from the available options
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
                        <span className="font-medium text-green-700" style={{ fontFamily: 'Söhne, sans-serif' }}>
                          Available: {flatsData[selectedBuilding as keyof typeof flatsData].length - submissions.filter(s => s.building === selectedBuilding).length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-medium text-red-700" style={{ fontFamily: 'Söhne, sans-serif' }}>
                          Booked: {submissions.filter(s => s.building === selectedBuilding).length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-blue-700" style={{ fontFamily: 'Söhne, sans-serif' }}>
                          Total: {flatsData[selectedBuilding as keyof typeof flatsData].length}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <div className="flex flex-col-reverse gap-4">
                    {Array.from({ length: Math.max(...flatsData[selectedBuilding as keyof typeof flatsData].map(f => parseInt(f.slice(1, -2)))) }, (_, floorIndex) => {
                      const floor = Math.max(...flatsData[selectedBuilding as keyof typeof flatsData].map(f => parseInt(f.slice(1, -2)))) - floorIndex
                      const floorFlats = flatsData[selectedBuilding as keyof typeof flatsData].filter(f => f.slice(1, -2) === floor.toString())
                      
                      return (
                        <motion.div
                          key={floor}
                          className="flex flex-col items-center gap-3"
                        >
                          {/* Floor Number */}
                          <div className="text-center mb-2">
                            <span className="text-lg font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-full">Floor {floor}</span>
                          </div>
                          
                          {/* Flats Row */}
                          <div className="flex gap-3">
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
                                    w-20 h-20 rounded-xl border-2 transition-all duration-500 ease-out flex items-center justify-center relative
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
                                  
                                  <span className={`font-bold text-2xl ${isFlatBooked ? 'text-gray-500' : ''}`}>
                                    {flatNumber}
                                  </span>
                                  
                                  {/* Booking Info Tooltip */}
                                  {isFlatBooked && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 shadow-lg"
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
                        </motion.div>
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
            </div>

            {/* Right Side - Selected Aarti Display */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-8 space-y-6">
                {/* Building Overview - Show Booked Flats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4 text-center" style={{ fontFamily: 'Charter, serif' }}>
                    🏢 Building {selectedBuilding} Overview
                  </h3>
                  
                  {/* Booked Flats List */}
                  {(() => {
                    const bookedFlats = submissions.filter(s => s.building === selectedBuilding)
                    
                    if (bookedFlats.length === 0) {
                      return (
                        <div className="text-center py-4">
                          <div className="text-green-600 text-4xl mb-2">✅</div>
                          <p className="text-sm text-gray-600" style={{ fontFamily: 'Söhne, sans-serif' }}>
                            All flats are available!
                          </p>
                        </div>
                      )
                    }
                    
                    return (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-500 text-center mb-3" style={{ fontFamily: 'Söhne, sans-serif' }}>
                          Already Booked Flats:
                        </p>
                        {bookedFlats.map((booking, index) => (
                          <motion.div
                            key={booking.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 bg-red-50 rounded-lg border border-red-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-red-700 text-sm" style={{ fontFamily: 'Charter, serif' }}>
                                {booking.flat}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                booking.aartiSchedule.time === 'Morning' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {booking.aartiSchedule.time}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600" style={{ fontFamily: 'Söhne, sans-serif' }}>
                              <div>Booked by: <span className="font-medium">{booking.userName}</span></div>
                              <div className="text-gray-500">{booking.aartiSchedule.date}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )
                  })()}
                </motion.div>

                {/* Name Input and Submit Button */}
                {selectedFlat && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-primary-200"
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center" style={{ fontFamily: 'Charter, serif' }}>
                      👤 Enter Your Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Söhne, sans-serif' }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter your name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          style={{ fontFamily: 'Söhne, sans-serif' }}
                          required
                        />
                      </div>
                      
                      <button
                        onClick={handleSubmit}
                        disabled={!userName.trim()}
                        className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg ${
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
          <div className="flex gap-8">
            {/* Main Content - Building Selection */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl mx-auto"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.button
                    onClick={() => setShowFlatSelection(false)}
                    className="mb-4 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    style={{ fontFamily: 'Söhne, sans-serif' }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Aarti Schedule
                  </motion.button>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Charter, serif' }}>
                    Select Your Building
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Söhne, sans-serif' }}>
                    Choose the building where your flat is located
                  </p>
                </div>

                {/* Buildings Grid - Simplified with just big letters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 ease-out flex flex-col items-center justify-center text-white font-bold hover:from-blue-600 hover:to-blue-700 relative overflow-hidden"
                      >
                        {/* Main Building Letter */}
                        <span className="text-6xl mb-2">{building}</span>
                        
                        {/* Availability Badge */}
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className={`text-xs px-2 py-1 rounded-full text-center font-medium ${
                            availableFlats === 0 
                              ? 'bg-red-500 text-white' 
                              : availableFlats < totalFlats * 0.3 
                                ? 'bg-yellow-500 text-white'
                                : 'bg-green-500 text-white'
                          }`}>
                            {availableFlats}/{totalFlats} Available
                          </div>
                        </div>
                        
                        {/* Booked Indicator */}
                        {bookedFlats > 0 && (
                          <div className="absolute top-2 right-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
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
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-8">
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
            className="bg-white rounded-3xl shadow-xl border border-gray-100"
          >
            {/* Header with Toggle Button */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Charter, serif' }}>
                    Daily Aarti Schedule
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Söhne, sans-serif' }}>
                    Select your preferred aarti session to proceed with flat booking
                  </p>
                </div>
                
                <motion.button
                  onClick={() => setShowAartiSchedule(!showAartiSchedule)}
                  className="ml-6 p-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm font-medium" style={{ fontFamily: 'Söhne, sans-serif' }}>
                    {showAartiSchedule ? 'Hide Schedule' : 'Show Schedule'}
                  </span>
                  {showAartiSchedule ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
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
                  <div className="p-8">
                    {/* Aarti Schedule Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                              className={`bg-white rounded-xl border transition-all duration-300 ${
                                isAnyBooked
                                  ? 'border-gray-300 bg-gray-50'
                                  : 'border-yellow-200 hover:border-yellow-300 hover:shadow-md'
                              }`}
                            >
                              {/* Date Header - Always Visible */}
                              <div className="p-3 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 text-center" style={{ fontFamily: 'Charter, serif' }}>
                                  {date}
                                </h3>
                              </div>

                              {/* Time Slots - Collapsible */}
                              <div className="p-3">
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
                                      className={`w-full mb-2 last:mb-0 p-2 rounded-lg transition-all duration-200 ${
                                        isBooked
                                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                          : 'bg-yellow-50 hover:bg-yellow-100 cursor-pointer border border-yellow-200 hover:border-yellow-300'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Clock className={`w-4 h-4 ${
                                            isBooked ? 'text-gray-400' : 'text-yellow-600'
                                          }`} />
                                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
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
                                          <div className="text-xs text-gray-500 text-right">
                                            <div className="font-medium">Booked by:</div>
                                            <div>{booking?.userName}</div>
                                            <div>Flat {booking?.flat}</div>
                                          </div>
                                        ) : (
                                          <div className="text-xs text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-100"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mb-6"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl">🎉</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-800 bg-clip-text text-transparent mb-4" style={{ fontFamily: 'Charter, serif' }}>
                  Festival Events
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Söhne, sans-serif' }}>
                  Discover all the exciting events planned for this auspicious occasion. From traditional ceremonies to thrilling competitions, experience the magic of Ganesh Pooja 2025.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            className="mt-12 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 text-center border border-gray-100"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-2xl">ℹ️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6" style={{ fontFamily: 'Charter, serif' }}>
                Important Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600" style={{ fontFamily: 'Söhne, sans-serif' }}>
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200">
                  <span className="font-semibold text-blue-600 block mb-2">⏰ Timing</span>
                  <p className="text-gray-700">Most events after 7 PM for maximum participation</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200">
                  <span className="font-semibold text-green-600 block mb-2">📅 Duration</span>
                  <p className="text-gray-700">August 23 - September 6, 2025</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200">
                  <span className="font-semibold text-purple-600 block mb-2">📝 Note</span>
                  <p className="text-gray-700">This is a tentative plan and may change if required</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  )
}

export default EventSchedule
