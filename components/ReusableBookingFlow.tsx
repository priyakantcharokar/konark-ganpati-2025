'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Building, Home, Check, X, Users, Calendar } from 'lucide-react'
import { databaseService } from '../lib/database-service'

interface ReusableBookingFlowProps {
  type: 'aarti' | 'event'
  title: string
  subtitle?: string
  selectedSlot?: { date: string; time: string }
  eventData?: { title: string; date: string }
  onClose: () => void
  onSuccess: (message: string) => void
}

interface Flat {
  id: string
  number: string
  building: string
}

const ReusableBookingFlow: React.FC<ReusableBookingFlowProps> = ({
  type,
  title,
  subtitle,
  selectedSlot,
  eventData,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'slot' | 'building' | 'flat' | 'details'>(
    type === 'aarti' ? 'slot' : 'building'
  )
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [selectedFlat, setSelectedFlat] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [mobileNumber, setMobileNumber] = useState<string>('')
  const [flatsData, setFlatsData] = useState<Flat[]>([])
  const [buildingInfo, setBuildingInfo] = useState<{ [key: string]: Flat[] }>({})
  const [aartiSchedule, setAartiSchedule] = useState<Array<{ date: string; time: string }>>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const buildings = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load flats data
        const flatsResponse = await fetch('/flats.json')
        const flatsRawData = await flatsResponse.json()
        
        // Group flats by building
        const grouped: { [key: string]: Flat[] } = {}
        const allFlats = flatsRawData.flats || flatsRawData
        allFlats.forEach((flat: any) => {
          const building = flat.building
          if (!grouped[building]) {
            grouped[building] = []
          }
          grouped[building].push({
            id: flat.id,
            number: flat.number,
            building: flat.building
          })
        })
        
        setBuildingInfo(grouped)
        setFlatsData(allFlats)

        // Load aarti schedule if needed
        if (type === 'aarti') {
          const aartiResponse = await fetch('/aarti.json')
          const aartiData = await aartiResponse.json()
          setAartiSchedule(aartiData)
        }

        // Load existing submissions
        const existingSubmissions = await databaseService.getAllBookings()
        setSubmissions(existingSubmissions.map(booking => databaseService.convertBookingToSubmission(booking)))
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [type])

  const handleSlotSelect = (slot: { date: string; time: string }) => {
    if (type === 'aarti') {
      setStep('building')
    }
  }

  const handleBuildingSelect = (building: string) => {
    setSelectedBuilding(building)
    setStep('flat')
  }

  const handleFlatSelect = (flat: string) => {
    setSelectedFlat(flat)
    setStep('details')
  }

  const handleBack = () => {
    if (step === 'details') {
      setStep('flat')
    } else if (step === 'flat') {
      setStep('building')
    } else if (step === 'building' && type === 'aarti') {
      setStep('slot')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userName.trim() || userName.length < 2) {
      alert('Please enter a valid name (at least 2 characters)')
      return
    }
    
    if (!/^\d{10}$/.test(mobileNumber)) {
      alert('Please enter a valid 10-digit mobile number')
      return
    }

    setIsSubmitting(true)
    
    try {
      if (type === 'aarti' && selectedSlot) {
        // Handle Aarti booking
        const submission = {
          id: Date.now().toString(),
          aartiSchedule: selectedSlot,
          building: selectedBuilding,
          flat: selectedFlat,
          userName: userName.trim(),
          mobileNumber: mobileNumber.trim(),
          timestamp: new Date()
        }

        const bookingData = databaseService.convertSubmissionToBooking(submission)
        const savedBooking = await databaseService.createBooking(bookingData)

        if (savedBooking) {
          onSuccess(`Pooja slot confirmed! ${userName} from Flat ${selectedFlat} in Building ${selectedBuilding} has booked ${selectedSlot.time} Aarti on ${selectedSlot.date}`)
        } else {
          alert('Failed to submit booking. Please try again.')
        }
      } else if (type === 'event' && eventData) {
        // Handle Event nomination
        const nomination = await databaseService.createEventNomination({
          event_title: eventData.title,
          event_date: eventData.date,
          user_name: userName.trim(),
          mobile_number: mobileNumber.trim(),
          building: selectedBuilding,
          flat: selectedFlat
        })

        if (nomination) {
          onSuccess(`Nomination submitted successfully! ${userName} from Flat ${selectedFlat} in Building ${selectedBuilding} has nominated for ${eventData.title}`)
        } else {
          alert('Failed to submit nomination. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 'slot':
        return 'Select Aarti Slot'
      case 'building':
        return 'Select Your Building'
      case 'flat':
        return `Building ${selectedBuilding} - Select Your Flat`
      case 'details':
        return 'Enter Your Details'
      default:
        return title
    }
  }

  const getMobileBackText = () => {
    if (step === 'details') {
      return 'Back to Flat'
    } else if (step === 'flat') {
      return 'Back to Building'
    } else if (step === 'building' && type === 'aarti') {
      return 'Back to Aarti'
    }
    return 'Back'
  }

  const getMobileTitle = () => {
    if (step === 'details') {
      return `Flat ${selectedFlat}`
    } else if (step === 'flat') {
      return `Building ${selectedBuilding}`
    } else if (step === 'building') {
      return 'Select Building'
    } else if (step === 'slot') {
      return 'Select Aarti Slot'
    }
    return title
  }

  // Check if flat is already booked (for aarti)
  const isFlatBooked = (flatNumber: string) => {
    if (type === 'aarti' && selectedSlot) {
      return submissions.some(sub => 
        sub.building === selectedBuilding && 
        sub.flat === flatNumber &&
        sub.aartiSchedule.date === selectedSlot.date &&
        sub.aartiSchedule.time === selectedSlot.time
      )
    }
    return false
  }

  const getFlatBooking = (flatNumber: string) => {
    if (type === 'aarti' && selectedSlot) {
      return submissions.find(sub => 
        sub.building === selectedBuilding && 
        sub.flat === flatNumber &&
        sub.aartiSchedule.date === selectedSlot.date &&
        sub.aartiSchedule.time === selectedSlot.time
      )
    }
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 font-jaf-bernino">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1 font-charter">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
            >
              ← {getMobileBackText()}
            </button>
            <h3 className="text-sm font-semibold text-gray-800 font-sohne">
              {getMobileTitle()}
            </h3>
            <div className="w-16"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Aarti Slot Selection */}
            {step === 'slot' && type === 'aarti' && (
              <motion.div
                key="slot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 font-sohne mb-6">
                  Select Aarti Slot
                </h3>
                
                <div className="grid gap-4">
                  {aartiSchedule.map((slot, index) => (
                    <motion.button
                      key={`${slot.date}-${slot.time}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSlotSelect(slot)}
                      className="w-full p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-800 font-sohne">{slot.date}</div>
                          <div className="text-gray-600 font-charter">{slot.time}</div>
                        </div>
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Building Selection */}
            {step === 'building' && (
              <motion.div
                key="building"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 font-sohne mb-6">
                  Select Your Building
                </h3>
                
                <div className="grid grid-cols-4 gap-4">
                  {buildings.map((building) => (
                    <button
                      key={building}
                      onClick={() => handleBuildingSelect(building)}
                      className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                    >
                      {building}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Flat Selection */}
            {step === 'flat' && (
              <motion.div
                key="flat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={handleBack}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    ← Back
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 font-sohne">
                    Building {selectedBuilding} - Select Your Flat
                  </h3>
                </div>
                
                <div className="grid grid-cols-6 gap-3 max-h-80 overflow-y-auto">
                  {buildingInfo[selectedBuilding]?.map((flat) => {
                    const isBooked = isFlatBooked(flat.number)
                    const flatBooking = getFlatBooking(flat.number)
                    
                    return (
                      <button
                        key={flat.id}
                        onClick={() => !isBooked && handleFlatSelect(flat.number)}
                        disabled={isBooked}
                        className={`
                          w-16 h-16 rounded-lg border-2 transition-all duration-200 flex items-center justify-center relative
                          ${isBooked 
                            ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-75'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }
                        `}
                      >
                        {isBooked && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <X className="w-3 h-3 text-white" />
                          </div>
                        )}
                        
                        <span className={`font-bold text-lg ${isBooked ? 'text-gray-500' : ''}`}>
                          {flat.number}
                        </span>
                        
                        {isBooked && flatBooking && (
                          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 shadow-lg">
                            <div className="text-center">
                              <div className="font-semibold">Already Booked</div>
                              <div className="truncate">{flatBooking.userName}</div>
                            </div>
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* User Details Form */}
            {step === 'details' && (
              <motion.form
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    ← Back
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 font-sohne">
                    Enter Your Details
                  </h3>
                </div>

                {/* Selected Details Display */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4 text-blue-800">
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">Selected: {selectedFlat}</span>
                    <span className="text-blue-600">Building {selectedBuilding}</span>
                  </div>
                  {type === 'aarti' && selectedSlot && (
                    <div className="mt-2 text-blue-600 text-sm">
                      {selectedSlot.date} - {selectedSlot.time}
                    </div>
                  )}
                  {type === 'event' && eventData && (
                    <div className="mt-2 text-blue-600 text-sm">
                      {eventData.title} - {eventData.date}
                    </div>
                  )}
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sohne">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={userName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setUserName(value);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    style={{ fontFamily: 'Söhne, sans-serif' }}
                    required
                  />
                  {userName && userName.length > 0 && userName.length < 2 && (
                    <p className="text-xs text-red-500 mt-1">
                      Please enter at least 2 characters
                    </p>
                  )}
                </div>

                {/* Mobile Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sohne">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setMobileNumber(value);
                    }}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    style={{ fontFamily: 'Söhne, sans-serif' }}
                    required
                  />
                  {mobileNumber && mobileNumber.length > 0 && !/^\d{10}$/.test(mobileNumber) && (
                    <p className="text-xs text-red-500 mt-1">
                      Please enter exactly 10 digits
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !userName.trim() || userName.length < 2 || !/^\d{10}$/.test(mobileNumber)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting ? 'Submitting...' : type === 'aarti' ? 'Book Aarti' : 'Submit Nomination'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default ReusableBookingFlow
