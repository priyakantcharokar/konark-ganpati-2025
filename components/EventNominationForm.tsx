'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { databaseService } from '../lib/database-service'

interface EventNominationFormProps {
  eventTitle: string
  eventDate: string
  onClose: () => void
  onSuccess: () => void
}

interface Flat {
  id: string
  number: string
  building: string
}

const EventNominationForm: React.FC<EventNominationFormProps> = ({
  eventTitle,
  eventDate,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'building' | 'flat' | 'details'>('building')
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [selectedFlat, setSelectedFlat] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [mobileNumber, setMobileNumber] = useState<string>('')
  const [bhogName, setBhogName] = useState<string>('')
  const [flatsData, setFlatsData] = useState<Flat[]>([])
  const [buildingInfo, setBuildingInfo] = useState<{ [key: string]: Flat[] }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if this is a Bhog event
  const isBhogEvent = eventTitle.includes('छप्पन भोग') && eventTitle.includes('56') && eventTitle.includes('Bhog')

  // Load flats data
  useEffect(() => {
    const loadFlats = async () => {
      try {
        const response = await fetch('/flats.json')
        const data = await response.json()
        
        // Group flats by building
        const grouped: { [key: string]: Flat[] } = {}
        data.flats.forEach((flat: any) => {
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
        setFlatsData(data.flats)
      } catch (error) {
        console.error('Error loading flats:', error)
      }
    }

    loadFlats()
  }, [])

  const handleBuildingSelect = (building: string) => {
    setSelectedBuilding(building)
    setStep('flat')
  }

  const handleFlatSelect = (flat: string) => {
    setSelectedFlat(flat)
    setStep('details')
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

    // For Bhog events, bhog name is required
    if (isBhogEvent && !bhogName.trim()) {
      alert('Please enter the Bhog name')
      return
    }

    setIsSubmitting(true)
    
    try {
      if (isBhogEvent) {
        // Handle Bhog nomination
        const bhogNomination = await databaseService.createBhogNomination({
          user_name: userName.trim(),
          mobile_number: mobileNumber,
          building: selectedBuilding,
          flat: selectedFlat,
          bhog_name: bhogName.trim()
        })

        if (bhogNomination) {
          onSuccess()
          onClose()
        } else {
          alert('Failed to submit bhog nomination. Please try again.')
        }
      } else {
        // Handle regular Event nomination
        const nomination = await databaseService.createEventNomination({
          event_title: eventTitle,
          event_date: eventDate,
          user_name: userName.trim(),
          mobile_number: mobileNumber,
          building: selectedBuilding,
          flat: selectedFlat
        })

        if (nomination) {
          onSuccess()
          onClose()
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

  const buildings = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 font-jaf-bernino">
              Nominate for {eventTitle}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2 font-charter">
            Date: {eventDate}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'building' && (
              <motion.div
                key="building"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 font-sohne mb-4">
                  Select Your Building
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {buildings.map((building) => (
                    <button
                      key={building}
                      onClick={() => handleBuildingSelect(building)}
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                    >
                      {building}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'flat' && (
              <motion.div
                key="flat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => setStep('building')}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    ← Back
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 font-sohne">
                    Building {selectedBuilding} - Select Your Flat
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {buildingInfo[selectedBuilding]?.map((flat) => (
                    <button
                      key={flat.id}
                      onClick={() => handleFlatSelect(flat.number)}
                      className="p-3 bg-gray-100 hover:bg-blue-100 text-gray-800 rounded-lg transition-colors font-medium"
                    >
                      {flat.number}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'details' && (
              <motion.form
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setStep('flat')}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    ← Back
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 font-sohne">
                    {isBhogEvent ? 'Enter Bhog Details' : 'Enter Your Details'}
                  </h3>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    Selected: {selectedBuilding}{selectedFlat}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sohne">
                    Full Name
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-sohne">
                    Mobile Number
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

                {/* Bhog Name Input - Only for Bhog events */}
                {isBhogEvent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-sohne">
                      Bhog Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter the name of the Bhog you want to offer"
                      value={bhogName}
                      onChange={(e) => setBhogName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      style={{ fontFamily: 'Söhne, sans-serif' }}
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !userName.trim() || userName.length < 2 || !/^\d{10}$/.test(mobileNumber) || (isBhogEvent && !bhogName.trim())}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting ? 'Submitting...' : (isBhogEvent ? 'Offer Bhog' : 'Submit Nomination')}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default EventNominationForm
