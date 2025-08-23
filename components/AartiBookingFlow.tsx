'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building, Home, Check, X, Clock } from 'lucide-react'
import { databaseService } from '../lib/database-service'

interface AartiBookingFlowProps {
  selectedSlot: { date: string; time: string }
  onClose: () => void
  onSuccess: (message: string) => void
}

interface Flat {
  id: string
  number: string
  building: string
}

const AartiBookingFlow: React.FC<AartiBookingFlowProps> = ({
  selectedSlot,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'building' | 'flat' | 'details'>('building')
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [selectedFlat, setSelectedFlat] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [mobileNumber, setMobileNumber] = useState<string>('')
  const [buildingInfo, setBuildingInfo] = useState<{ [key: string]: Flat[] }>({})
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
        allFlats.forEach((flatNumber: string) => {
          const building = flatNumber.charAt(0)
          if (!grouped[building]) {
            grouped[building] = []
          }
          grouped[building].push({
            id: flatNumber,
            number: flatNumber,
            building: building
          })
        })
        
        setBuildingInfo(grouped)

        // Load existing submissions
        const existingSubmissions = await databaseService.getAllBookings()
        setSubmissions(existingSubmissions.map(booking => databaseService.convertBookingToSubmission(booking)))
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [])

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
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userName.trim() || userName.length < 2) {
      alert('Please enter a valid name (at least 2 characters)')
      return
    }
    
    // Mobile number is optional, no validation required

    setIsSubmitting(true)
    
    try {
      // Handle Aarti booking
      const submission = {
        id: Date.now().toString(),
        aartiSchedule: selectedSlot,
        building: selectedBuilding,
        flat: selectedFlat,
        userName: userName.trim(),
        mobileNumber: mobileNumber.trim() || null,
        timestamp: new Date()
      }

      const bookingData = databaseService.convertSubmissionToBooking(submission)
      const savedBooking = await databaseService.createBooking(bookingData)

      if (savedBooking) {
        onSuccess(`Pooja slot confirmed! ${userName} from Flat ${selectedFlat} in Building ${selectedBuilding} has booked ${selectedSlot.time} Aarti on ${selectedSlot.date}`)
        // Redirect to landing page after success
        window.location.href = '/'
      } else {
        alert('Failed to submit booking. Please try again.')
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
      case 'building':
        return 'Select Your Building'
      case 'flat':
        return `Building ${selectedBuilding} - Select Your Flat`
      case 'details':
        return 'Enter Your Details'
      default:
        return 'Book Aarti Slot'
    }
  }

  const getMobileBackText = () => {
    if (step === 'details') {
      return 'Back to Flat'
    } else if (step === 'flat') {
      return 'Back to Building'
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
    }
    return 'Book Aarti Slot'
  }

  // Check if flat is already booked
  const isFlatBooked = (flatNumber: string) => {
    return submissions.some(sub => 
      sub.building === selectedBuilding && 
      sub.flat === flatNumber &&
      sub.aartiSchedule.date === selectedSlot.date &&
      sub.aartiSchedule.time === selectedSlot.time
    )
  }

  const getFlatBooking = (flatNumber: string) => {
    return submissions.find(sub => 
      sub.building === selectedBuilding && 
      sub.flat === flatNumber &&
      sub.aartiSchedule.date === selectedSlot.date &&
      sub.aartiSchedule.time === selectedSlot.time
    )
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 font-jaf-bernino">
                Book Aarti Slot
              </h2>
              <p className="text-sm text-gray-600 mt-1 font-charter">
                {selectedSlot.date} - {selectedSlot.time}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 hover:text-red-700 transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {step !== 'building' ? (
              <button
                onClick={handleBack}
                className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
              >
                ← {getMobileBackText()}
              </button>
            ) : (
              <div className="w-16"></div>
            )}
            <h3 className="text-sm font-semibold text-gray-800 font-sohne">
              {getMobileTitle()}
            </h3>
            <div className="w-16"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          <AnimatePresence mode="wait">
            {/* Building Selection */}
            {step === 'building' && (
              <motion.div
                key="building"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Selected Slot Information Card */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🕉️</span>
                    </div>
                    <div>
                      <div className="font-semibold text-orange-800 text-sm">Selected Aarti Slot</div>
                      <div className="text-orange-600 font-medium">{selectedSlot.date}</div>
                      <div className="text-orange-600 text-sm">{selectedSlot.time} Aarti</div>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 font-sohne mb-6">
                  Select Your Building
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {buildings.map((building) => (
                    <button
                      key={building}
                      onClick={() => handleBuildingSelect(building)}
                      className="w-full aspect-square bg-white/30 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-500 text-gray-800 hover:text-blue-600 text-4xl sm:text-6xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center hover:bg-blue-50/50 font-mono tracking-wider"
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
                {/* Selected Building and Slot Information Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🏢</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-800 text-sm">Selected Building</div>
                      <div className="text-blue-600 font-medium">Building {selectedBuilding}</div>
                      <div className="text-blue-600 text-sm">{selectedSlot.date} - {selectedSlot.time} Aarti</div>
                    </div>
                  </div>
                </div>

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
                
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2 max-h-64 overflow-y-auto">
                  {buildingInfo[selectedBuilding]?.map((flat) => {
                    const isBooked = isFlatBooked(flat.number)
                    const flatBooking = getFlatBooking(flat.number)
                    
                    return (
                      <button
                        key={flat.id}
                        onClick={() => !isBooked && handleFlatSelect(flat.number)}
                        disabled={isBooked}
                        className={`
                          w-full aspect-square rounded-md border transition-all duration-200 flex items-center justify-center relative
                          ${isBooked 
                            ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-75'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }
                        `}
                      >
                        {isBooked && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <X className="w-2 h-2 text-white" />
                          </div>
                        )}
                        
                        <span className={`font-bold text-xs sm:text-sm font-mono tracking-wider ${isBooked ? 'text-gray-500' : ''}`}>
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
                  <div className="mt-2 text-blue-600 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedSlot.date} - {selectedSlot.time}
                  </div>
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
                    Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number (optional)"
                    value={mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setMobileNumber(value);
                    }}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    style={{ fontFamily: 'Söhne, sans-serif' }}
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
                  disabled={isSubmitting || !userName.trim() || userName.length < 2}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting ? 'Submitting...' : 'Book Aarti'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default AartiBookingFlow
