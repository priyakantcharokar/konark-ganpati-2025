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
  const [selectedBuildings, setSelectedBuildings] = useState<string[]>([])
  const [selectedFlats, setSelectedFlats] = useState<string[]>([])
  const [flatDetails, setFlatDetails] = useState<{ [flatNumber: string]: { userName: string; mobileNumber: string } }>({})
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

  // Initialize flatDetails when selectedFlats change
  useEffect(() => {
    const newFlatDetails: { [key: string]: { userName: string; mobileNumber: string } } = {}
    selectedFlats.forEach(flat => {
      newFlatDetails[flat] = flatDetails[flat] || { userName: '', mobileNumber: '' }
    })
    setFlatDetails(newFlatDetails)
  }, [selectedFlats])

  const handleBuildingSelect = (building: string) => {
    setSelectedBuildings(prev => {
      if (prev.includes(building)) {
        return prev.filter(b => b !== building)
      } else {
        return [...prev, building]
      }
    })
  }

  const handleFlatSelect = (flatNumber: string) => {
    setSelectedFlats(prev => {
      if (prev.includes(flatNumber)) {
        // Remove flat and its details
        const newFlats = prev.filter(f => f !== flatNumber)
        setFlatDetails(prevDetails => {
          const newDetails = { ...prevDetails }
          delete newDetails[flatNumber]
          return newDetails
        })
        return newFlats
      } else {
        // Add flat and initialize its details
        const newFlats = [...prev, flatNumber]
        setFlatDetails(prevDetails => ({
          ...prevDetails,
          [flatNumber]: { userName: '', mobileNumber: '' }
        }))
        return newFlats
      }
    })
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
    
    // Check if all selected flats have names
    const missingNames = selectedFlats ? selectedFlats.filter(flat => {
      const flatDetail = flatDetails[flat]
      return !flatDetail || !flatDetail.userName || !flatDetail.userName.trim()
    }) : []
    if (missingNames.length > 0) {
      alert(`Please enter names for the following flats: ${missingNames.join(', ')}`)
      return
    }

    if (!selectedFlats || selectedFlats.length === 0) {
      alert('Please select at least one flat')
      return
    }
    
    // Mobile number is optional, no validation required

    setIsSubmitting(true)
    
    try {
      // Handle Aarti booking for multiple flats
      const bookingPromises = selectedFlats ? selectedFlats.map(async (flat) => {
        // Find which building this flat belongs to
        const building = Object.keys(buildingInfo).find(buildingKey => 
          buildingInfo[buildingKey].some(f => f.number === flat)
        ) || (selectedBuildings && selectedBuildings[0])
        
        const flatDetail = flatDetails[flat]
        
        // Safety check - ensure flatDetail exists
        if (!flatDetail || !flatDetail.userName) {
          throw new Error(`Missing details for flat ${flat}`)
        }
        
        const submission = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          aartiSchedule: selectedSlot,
          building: building,
          flat: flat,
          userName: flatDetail.userName.trim(),
          mobileNumber: flatDetail.mobileNumber?.trim() || null,
          timestamp: new Date()
        }

        const bookingData = databaseService.convertSubmissionToBooking(submission)
        return await databaseService.createBooking(bookingData)
      }) : []

      const savedBookings = await Promise.all(bookingPromises)
      const successfulBookings = savedBookings.filter(booking => booking !== null)

      if (successfulBookings.length > 0) {
        const flatList = selectedFlats ? selectedFlats.join(', ') : ''
        const buildingList = selectedFlats ? selectedFlats.map(flat => {
          const building = Object.keys(buildingInfo).find(buildingKey => 
            buildingInfo[buildingKey].some(f => f.number === flat)
          )
          return building
        }).filter((building, index, arr) => building && arr.indexOf(building) === index).join(', ') : ''
        
        const nameList = selectedFlats ? selectedFlats.map(flat => {
          const flatDetail = flatDetails[flat]
          return flatDetail && flatDetail.userName ? `${flatDetail.userName} (${flat})` : `Flat ${flat}`
        }).join(', ') : ''
        
        onSuccess(`Pooja slot confirmed! ${nameList} in Buildings ${buildingList} has booked ${selectedSlot.time} Aarti on ${selectedSlot.date}`)
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
        return `Building ${selectedBuildings ? selectedBuildings.join(', ') : ''} - Select Your Flats (Multiple Selection)`
      case 'details':
        return 'Enter Your Details'
      default:
        return 'Book Aarti Slot'
    }
  }

  const getMobileBackText = () => {
    if (step === 'details') {
      return 'Back to Flats'
    } else if (step === 'flat') {
      return 'Back to Building'
    }
    return 'Back'
  }

  const getMobileTitle = () => {
    if (step === 'details') {
      return `Flats ${selectedFlats ? selectedFlats.join(', ') : ''}`
    } else if (step === 'flat') {
      return `Building ${selectedBuildings ? selectedBuildings.join(', ') : ''}`
    } else if (step === 'building') {
      return 'Select Building'
    }
    return 'Book Aarti Slot'
  }

  // Check if flat is already booked
  const isFlatBooked = (flatNumber: string) => {
    // Safety check: ensure selectedBuildings exists and has values
    if (!selectedBuildings || selectedBuildings.length === 0) {
      return false
    }
    
    return submissions.some(sub => 
      sub.building === selectedBuildings.find(building => 
        // Check if this flat belongs to any of the selected buildings
        flatNumber.startsWith(building)
      ) &&
      sub.flat === flatNumber &&
      sub.aartiSchedule.date === selectedSlot.date &&
      sub.aartiSchedule.time === selectedSlot.time
    )
  }

  const getFlatBooking = (flatNumber: string) => {
    // Safety check: ensure selectedBuildings exists and has values
    if (!selectedBuildings || selectedBuildings.length === 0) {
      return null
    }
    
    return submissions.find(sub => 
      sub.building === selectedBuildings.find(building => 
        // Check if this flat belongs to any of the selected buildings
        flatNumber.startsWith(building)
      ) &&
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 font-sohne">
                    Select Your Buildings (Multiple Selection)
                  </h3>
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-sm">
                    You can select multiple buildings to book Aarti slots for flats across different buildings.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {buildings.map((building) => {
                    const isSelected = selectedBuildings && selectedBuildings.includes(building)
                    
                    return (
                      <button
                        key={building}
                        onClick={() => handleBuildingSelect(building)}
                        className={`
                          p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                          }
                        `}
                      >
                        <Building className={`w-8 h-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                        <span className={`font-bold text-lg ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                          Building {building}
                        </span>
                        {isSelected && (
                          <div className="mt-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Continue Button */}
                {selectedBuildings && selectedBuildings.length > 0 && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setStep('flat')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      Continue with {selectedBuildings.length} Building{selectedBuildings.length !== 1 ? 's' : ''} →
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Flat Selection */}
            {step === 'flat' && (
              <motion.div
                key="flat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Selected Slot Information Card */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🕉️</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-orange-800 text-sm">Selected Aarti Slot</div>
                      <div className="text-orange-600 font-medium">{selectedSlot.date}</div>
                      <div className="text-orange-600 text-sm">{selectedSlot.time} Aarti</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-orange-800 text-sm">Selected Buildings</div>
                      <div className="text-orange-600 font-medium">{selectedBuildings ? selectedBuildings.join(', ') : ''}</div>
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
                    Select Your Flats (Multiple Selection)
                  </h3>
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-sm">
                    Select multiple flats from the selected buildings. You can choose flats from different buildings.
                  </p>
                </div>

                {/* Flats by Building */}
                <div className="space-y-8">
                  {selectedBuildings && selectedBuildings.map((building) => (
                    <div key={building} className="space-y-4">
                      {/* Building Header */}
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2 font-sohne">
                          Building {building}
                        </h4>
                        <div className="w-24 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
                      </div>
                      
                      {/* Flats Grid */}
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2 max-h-48 overflow-y-auto">
                        {buildingInfo[building]?.map((flat) => {
                          // Safety check: ensure flat exists
                          if (!flat || !flat.number) return null
                          
                          const isBooked = isFlatBooked(flat.number)
                          const flatBooking = getFlatBooking(flat.number)
                          const isSelected = selectedFlats && selectedFlats.includes(flat.number)
                          
                          return (
                            <button
                              key={flat.id}
                              onClick={() => !isBooked && handleFlatSelect(flat.number)}
                              disabled={isBooked}
                              className={`
                                w-full aspect-square rounded-md border transition-all duration-200 flex items-center justify-center relative
                                ${isBooked 
                                  ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-75'
                                  : isSelected
                                  ? 'border-blue-500 bg-blue-100 text-blue-700'
                                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                }
                              `}
                            >
                              {isBooked && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                  <X className="w-2 h-2 text-white" />
                                </div>
                              )}
                              
                              {isSelected && !isBooked && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Check className="w-2 h-2 text-white" />
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
                    </div>
                  ))}
                </div>

                {/* Continue Button */}
                {selectedFlats && selectedFlats.length > 0 && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setStep('details')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      Continue with {selectedFlats.length} Flat{selectedFlats.length !== 1 ? 's' : ''} →
                    </button>
                  </div>
                )}
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
                    Enter Details for Each Flat
                  </h3>
                </div>

                {/* Selected Details Display */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4 text-blue-800">
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">Selected Flats: {selectedFlats.join(', ')}</span>
                    <span className="text-blue-600">Buildings {selectedBuildings.join(', ')}</span>
                  </div>
                  <div className="mt-2 text-blue-600 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedSlot.date} - {selectedSlot.time}
                  </div>
                  <div className="mt-2 text-blue-600 text-xs">
                    Total: {selectedFlats ? selectedFlats.length : 0} flat{selectedFlats && selectedFlats.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Modify Selection Button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('flat')}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    ← Modify Flat Selection
                  </button>
                </div>

                {/* Individual Flat Details Forms */}
                <div className="space-y-6">
                  {selectedFlats && selectedFlats.map((flat, index) => {
                    // Safety check: ensure flat exists
                    if (!flat) return null
                    
                    const building = Object.keys(buildingInfo).find(buildingKey => 
                      buildingInfo[buildingKey].some(f => f.number === flat)
                    ) || selectedBuildings[0]
                    
                    return (
                      <div key={flat} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Flat {flat}</h4>
                            <p className="text-sm text-gray-600">Building {building}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Name Input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-sohne">
                              Full Name for Flat {flat} *
                            </label>
                            <input
                              type="text"
                              value={flatDetails[flat]?.userName || ''}
                              onChange={(e) => setFlatDetails(prev => ({
                                ...prev,
                                [flat]: { ...prev[flat], userName: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent font-kievit"
                              placeholder="Enter full name"
                              required
                            />
                          </div>
                          
                          {/* Mobile Number Input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-sohne">
                              Mobile Number (Optional)
                            </label>
                            <input
                              type="tel"
                              value={flatDetails[flat]?.mobileNumber || ''}
                              onChange={(e) => setFlatDetails(prev => ({
                                ...prev,
                                [flat]: { ...prev[flat], mobileNumber: e.target.value }
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent font-kievit"
                              placeholder="Enter mobile number"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Booking...' : `Book Aarti Slots for ${selectedFlats ? selectedFlats.length : 0} Flat${selectedFlats && selectedFlats.length !== 1 ? 's' : ''}`}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default AartiBookingFlow
