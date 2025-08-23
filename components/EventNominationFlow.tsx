'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building, Home, X, Calendar } from 'lucide-react'
import { databaseService } from '../lib/database-service'

interface EventNominationFlowProps {
  eventData: { title: string; date: string }
  onClose: () => void
  onSuccess: (message: string) => void
}

interface Flat {
  id: string
  number: string
  building: string
}

const EventNominationFlow: React.FC<EventNominationFlowProps> = ({
  eventData,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'building' | 'flat' | 'details'>('building')
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [selectedFlat, setSelectedFlat] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [mobileNumber, setMobileNumber] = useState<string>('')
  const [buildingInfo, setBuildingInfo] = useState<{ [key: string]: Flat[] }>({})
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
    
    if (!/^\d{10}$/.test(mobileNumber)) {
      alert('Please enter a valid 10-digit mobile number')
      return
    }

    setIsSubmitting(true)
    
    try {
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
        // Redirect to landing page after success
        window.location.href = '/'
      } else {
        alert('Failed to submit nomination. Please try again.')
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
        return 'Nominate for Event'
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
    return 'Nominate for Event'
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
                Nominate for Event
              </h2>
              <p className="text-sm text-gray-600 mt-1 font-charter">
                {eventData.title}
              </p>
              <p className="text-xs text-gray-500 mt-1 font-charter">
                Date: {eventData.date}
              </p>
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
            {/* Building Selection */}
            {step === 'building' && (
              <motion.div
                key="building"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Selected Event Information Card */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🎉</span>
                    </div>
                    <div>
                      <div className="font-semibold text-green-800 text-sm">Selected Event</div>
                      <div className="text-green-600 font-medium">{eventData.title}</div>
                      <div className="text-green-600 text-sm">Date: {eventData.date}</div>
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
                      className="w-full aspect-square bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xl sm:text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
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
                {/* Selected Building and Event Information Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🏢</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-800 text-sm">Selected Building</div>
                      <div className="text-blue-600 font-medium">Building {selectedBuilding}</div>
                      <div className="text-blue-600 text-sm">{eventData.title} - {eventData.date}</div>
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
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 max-h-80 overflow-y-auto">
                  {buildingInfo[selectedBuilding]?.map((flat) => (
                    <button
                      key={flat.id}
                      onClick={() => handleFlatSelect(flat.number)}
                      className="w-full aspect-square rounded-lg border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 flex items-center justify-center"
                    >
                      <span className="font-bold text-sm sm:text-lg">
                        {flat.number}
                      </span>
                    </button>
                  ))}
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
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4 text-green-800">
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">Selected: {selectedFlat}</span>
                    <span className="text-green-600">Building {selectedBuilding}</span>
                  </div>
                  <div className="mt-2 text-green-600 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {eventData.title} - {eventData.date}
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Nomination'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default EventNominationFlow
