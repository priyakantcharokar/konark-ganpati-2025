'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, Building, Home, User, Phone } from 'lucide-react'
import { databaseService } from '@/lib/database-service'

interface Flat {
  id: string
  number: string
  building: string
}

interface GarbaEnrolmentFlowProps {
  onClose: () => void
  onSuccess: (message: string) => void
}

const GarbaEnrolmentFlow: React.FC<GarbaEnrolmentFlowProps> = ({
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

  // Load flats data
  useEffect(() => {
    const loadFlats = async () => {
      try {
        const response = await fetch('/flats.json')
        const data = await response.json()
        
        // Group flats by building
        const grouped: { [key: string]: Flat[] } = {}
        const allFlats = data.flats || data
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
    
    // Mobile number is optional, but if provided, it should be valid
    if (mobileNumber.trim() && !/^\d{10}$/.test(mobileNumber)) {
      alert('Please enter a valid 10-digit mobile number or leave it empty')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create Garba & Dandiya workshop enrolment
      const enrolment = await databaseService.createEventNomination({
        event_title: 'Garba & Dandiya Workshop 2025',
        event_date: '2025-09-14',
        user_name: userName.trim(),
        mobile_number: mobileNumber.trim(),
        building: selectedBuilding,
        flat: selectedFlat
      })

      if (enrolment) {
        onSuccess(`🎉 Enrolment successful! ${userName} from Flat ${selectedFlat} in Building ${selectedBuilding} has enrolled for Garba & Dandiya Workshop!`)
        // Redirect to Garba & Dandiya page after success
        setTimeout(() => {
          window.location.href = '/garba-dandiya'
        }, 2000)
      } else {
        alert('Failed to submit enrolment. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting enrolment:', error)
      alert('Failed to submit enrolment. Please try again.')
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
        return 'Enrol for Garba & Dandiya'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold font-kievit mb-2">
              💃 Garba & Dandiya Enrolment 💃
            </h2>
            <p className="text-orange-100 font-kievit">
              {getStepTitle()}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <AnimatePresence mode="wait">
            {step === 'building' && (
              <motion.div
                key="building"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <Building className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 font-kievit">
                    Choose Your Building
                  </h3>
                  <p className="text-sm text-gray-600 font-kievit">
                    Select the building where you reside
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {buildings.map((building) => (
                    <button
                      key={building}
                      onClick={() => handleBuildingSelect(building)}
                      className="p-4 bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 text-gray-800 rounded-xl transition-all duration-200 font-medium font-kievit border border-orange-200 hover:border-orange-300 hover:shadow-md"
                    >
                      Building {building}
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
                    onClick={handleBack}
                    className="text-orange-600 hover:text-orange-800 transition-colors font-kievit"
                  >
                    <ArrowLeft className="w-4 h-4 inline mr-1" />
                    Back
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 font-kievit">
                    Building {selectedBuilding} - Select Your Flat
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {buildingInfo[selectedBuilding]?.map((flat) => (
                    <button
                      key={flat.id}
                      onClick={() => handleFlatSelect(flat.number)}
                      className="p-3 bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 text-gray-800 rounded-lg transition-all duration-200 font-medium font-kievit border border-orange-200 hover:border-orange-300 hover:shadow-md"
                    >
                      {flat.number}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={handleBack}
                    className="text-orange-600 hover:text-orange-800 transition-colors font-kievit"
                  >
                    <ArrowLeft className="w-4 h-4 inline mr-1" />
                    Back
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800 font-kievit">
                    Flat {selectedFlat} - Enter Your Details
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-kievit">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-kievit"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-kievit">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Mobile Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-kievit"
                      placeholder="Enter 10-digit mobile number (optional)"
                      maxLength={10}
                    />
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                    <h4 className="font-semibold text-gray-800 mb-2 font-kievit">
                      🎭 Workshop Details
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1 font-kievit">
                      <p>• 7-day intensive Dandiya / Garba workshop</p>
                      <p>• Starting from 14th September</p>
                      <p>• 1.5 hours per session (after 8 PM)</p>
                      <p>• Total Fee: ₹10,500</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-800 mb-2 font-kievit">
                      📞 Contact for Payment
                    </h4>
                    <div className="text-center">
                      <p className="font-medium text-gray-800 font-kievit mb-1">
                        Dr. Bharti
                      </p>
                      <a 
                        href="tel:‪9687663916‬" 
                        className="text-blue-600 hover:text-blue-800 font-bold font-kievit text-lg transition-colors duration-200"
                      >
                        📱 ‪9687663916‬
                      </a>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-bold font-kievit hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Enrolling...
                      </span>
                    ) : (
                      '🎯 Enrol for Workshop'
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default GarbaEnrolmentFlow
