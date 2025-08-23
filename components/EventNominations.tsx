'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { databaseService, EventNomination } from '../lib/database-service'

interface EventNominationsProps {
  eventTitle: string
  eventDate: string
  onClose: () => void
}

const EventNominations: React.FC<EventNominationsProps> = ({
  eventTitle,
  eventDate,
  onClose
}) => {
  const [nominations, setNominations] = useState<EventNomination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNominations = async () => {
      try {
        const data = await databaseService.getEventNominations(eventTitle)
        setNominations(data)
      } catch (error) {
        console.error('Error loading nominations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNominations()
  }, [eventTitle])

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
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 font-jaf-bernino">
                Nominations for {eventTitle}
              </h2>
              <p className="text-sm text-gray-600 mt-1 font-charter">
                Date: {eventDate}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : nominations.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-600 mb-2 font-sohne">
                No Nominations Yet
              </h3>
              <p className="text-sm text-gray-500 font-charter">
                Be the first to nominate for this event!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 font-sohne">
                  Total Nominations: {nominations.length}
                </h3>
              </div>
              
              <div className="space-y-3">
                {nominations.map((nomination, index) => (
                  <motion.div
                    key={nomination.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`rounded-xl p-4 hover:shadow-md transition-all duration-200 ${
                      index % 2 === 0 
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' 
                        : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold ${
                        index % 2 === 0 ? 'bg-blue-600' : 'bg-purple-600'
                      }`}>
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-gray-800 font-sohne text-lg">
                        {nomination.user_name}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default EventNominations
