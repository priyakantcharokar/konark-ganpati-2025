'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import EventNominationForm from '../../../components/EventNominationForm'
import EventNominations from '../../../components/EventNominations'
import { databaseService, EventNomination } from '../../../lib/database-service'

interface Event {
  date: string
  event: string
  contact: string
}

const EventPage = () => {
  const params = useParams()
  const eventSlug = params.eventSlug as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [nominations, setNominations] = useState<EventNomination[]>([])
  const [loading, setLoading] = useState(true)
  const [showNominationForm, setShowNominationForm] = useState(false)
  const [showNominations, setShowNominations] = useState(false)

  useEffect(() => {
    const loadEventData = async () => {
      try {
        // Load event details from coord.json
        const response = await fetch('/coord.json')
        const data = await response.json()
        
        const foundEvent = data.events.find((e: Event) => 
          e.event.toLowerCase().replace(/[^a-z0-9]/g, '-') === eventSlug
        )
        
        if (foundEvent) {
          setEvent(foundEvent)
          // Load nominations for this event
          const eventNominations = await databaseService.getEventNominations(foundEvent.event)
          setNominations(eventNominations)
        }
      } catch (error) {
        console.error('Error loading event data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (eventSlug) {
      loadEventData()
    }
  }, [eventSlug])

  const handleNominationSuccess = async () => {
    if (event) {
      const updatedNominations = await databaseService.getEventNominations(event.event)
      setNominations(updatedNominations)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 font-jaf-bernino">
            Event Not Found
          </h1>
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors font-sohne"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const getEventIcon = (eventTitle: string) => {
    const title = eventTitle.toLowerCase()
    
    if (title.includes('idol') || title.includes('ganesha')) return '🕉️'
    if (title.includes('aarti') || title.includes('prasad') || title.includes('seva') || 
        title.includes('puja') || title.includes('bhog') || title.includes('satyanarayan')) return '🙏'
    if (title.includes('rangoli') || title.includes('drawing') || title.includes('recitation')) return '🎨'
    if (title.includes('anchoring')) return '🎤'
    if (title.includes('modak') || title.includes('cooking') || title.includes('food')) return '🍽️'
    if (title.includes('karaoke') || title.includes('performance') || title.includes('fashion') || 
        title.includes('fancy dress') || title.includes('antakshari')) return '🎭'
    if (title.includes('game') || title.includes('team building') || title.includes('sport')) return '🎮'
    if (title.includes('waste')) return '♻️'
    if (title.includes('tambola')) return '🎲'
    return '🎉'
  }

  const getEventColor = (eventTitle: string) => {
    const title = eventTitle.toLowerCase()
    
    if (title.includes('idol') || title.includes('aarti') || title.includes('puja') || 
        title.includes('bhog') || title.includes('satyanarayan')) {
      return 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'
    }
    if (title.includes('rangoli') || title.includes('drawing') || title.includes('recitation')) {
      return 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50'
    }
    if (title.includes('karaoke') || title.includes('performance') || title.includes('fashion') || 
        title.includes('fancy dress') || title.includes('antakshari')) {
      return 'border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50'
    }
    if (title.includes('game') || title.includes('team building') || title.includes('sport')) {
      return 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
    }
    if (title.includes('modak') || title.includes('cooking') || title.includes('food')) {
      return 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50'
    }
    return 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="text-orange-600 hover:text-orange-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 font-jaf-bernino">
              {event.event}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`${getEventColor(event.event)} p-6 rounded-2xl border shadow-lg`}
            >
              {/* Header with Icon and Title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-3xl">{getEventIcon(event.event)}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight font-jaf-bernino">
                    {event.event}
                  </h2>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-semibold text-lg text-gray-800 font-sohne">{event.date}</span>
                </div>

                {event.contact && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm mt-0.5">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-lg text-gray-800 leading-relaxed font-kievit">
                        {event.contact.split(',').map((contact, index) => {
                          const trimmed = contact.trim()
                          const phoneMatch = trimmed.match(/(\d{10})/)
                          const nameMatch = trimmed.replace(/\s*-\s*\d{10}/, '').trim()
                          
                          return (
                            <span key={index} className="block mb-2 last:mb-0">
                              <span className="font-semibold text-gray-800 font-sohne">{nameMatch}</span>
                              {phoneMatch && (
                                <span className="text-gray-600 ml-2 text-sm font-circular flex items-center gap-1">
                                  📱 {phoneMatch[1]}
                                </span>
                              )}
                            </span>
                          )
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowNominations(true)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
                >
                  View Nominations ({nominations.length})
                </button>
                <button
                  onClick={() => setShowNominationForm(true)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Nominate Now
                </button>
              </div>
            </motion.div>
          </div>

          {/* Nominations Preview */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-jaf-bernino">
                Recent Nominations
              </h3>
              
              {nominations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-charter">
                    No nominations yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {nominations.slice(0, 5).map((nomination, index) => (
                    <div
                      key={nomination.id}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 text-sm font-sohne truncate">
                            {nomination.user_name}
                          </h4>
                          <p className="text-xs text-gray-600 font-charter">
                            {nomination.building} - {nomination.flat}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {nominations.length > 5 && (
                    <button
                      onClick={() => setShowNominations(true)}
                      className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium py-2 transition-colors font-sohne"
                    >
                      View All {nominations.length} Nominations →
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showNominationForm && (
        <EventNominationForm
          eventTitle={event.event}
          eventDate={event.date}
          onClose={() => setShowNominationForm(false)}
          onSuccess={handleNominationSuccess}
        />
      )}

      {showNominations && (
        <EventNominations
          eventTitle={event.event}
          eventDate={event.date}
          onClose={() => setShowNominations(false)}
        />
      )}
    </div>
  )
}

export default EventPage
