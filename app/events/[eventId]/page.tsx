'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Users, X } from 'lucide-react'
import EventNominationFlow from '@/components/EventNominationFlow'
import { databaseService } from '@/lib/database-service'

interface Event {
  id: string
  title: string
  date: string
  time: string
  description?: string
  organizers: string
  category: string
}

interface EventNomination {
  id: string
  eventTitle: string
  userName: string
  flatNumber: string
  building: string
  timestamp: Date
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.eventId as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [nominations, setNominations] = useState<EventNomination[]>([])
  const [showNominationForm, setShowNominationForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Check if this is a Bhog event
  const isBhogEvent = event?.title?.includes('छप्पन भोग') || 
                     event?.title?.includes('56') || 
                     event?.title?.includes('Bhog')

  // Function to find matching event flyer image
  const getEventFlyerImage = (eventTitle: string) => {
    const title = eventTitle.toLowerCase()
    
    // Map event titles to image names
    if (title.includes('anchoring')) return '/events/Anchoring.jpeg'
    if (title.includes('arti') && title.includes('prasad') && title.includes('seva')) return '/events/Arti prasad seva.jpeg'
    if (title.includes('waste') && title.includes('wow')) return '/events/BestOutOF Waste.jpeg'
    if (title.includes('duo') && title.includes('dynamics')) return '/events/Duo Dynamics.jpeg'
    if (title.includes('group') && title.includes('performances')) return '/events/GroupSingning.jpeg'
    if (title.includes('idol') && title.includes('making')) return '/events/IdolMaking.jpeg'
    if (title.includes('modak') && title.includes('mohostav')) return '/events/ModakCompetition.jpeg'
    if (title.includes('singing')) return '/events/Singing.jpeg'
    if (title.includes('ganapati') && title.includes('utsav') && title.includes('hosting')) return '/events/GanapatiUtsavHosting.jpeg'
    if (title.includes('satyanarayan') && title.includes('pooja')) return '/events/Satyanarayan pooja.png'
    if (title.includes('ganapati') && title.includes('sthapana')) return '/events/Ganapati Sthapana.png'
    if (title.includes('antakshari')) return '/events/Antakshari.jpeg'
    
    // Default fallback
    return null
  }

  const getEventIcon = (eventTitle: string) => {
    const title = eventTitle.toLowerCase()
    
    // Ganesha Idol making
    if (title.includes('idol') || title.includes('ganesha')) return '🕉️'
    
    // Aarti and religious activities
    if (title.includes('aarti') || title.includes('prasad') || title.includes('seva') || 
        title.includes('puja') || title.includes('bhog') || title.includes('satyanarayan')) return '🙏'
    
    // Rangoli and creative activities
    if (title.includes('rangoli') || title.includes('drawing') || title.includes('recitation')) return '🎨'
    
    // Anchoring and hosting
    if (title.includes('anchoring') || (title.includes('ganapati') && title.includes('utsav') && title.includes('hosting'))) return '🎤'
    
    // Food and cooking
    if (title.includes('modak') || title.includes('cooking') || title.includes('food')) return '🍽️'
    
    // Entertainment and performances
    if (title.includes('karaoke') || title.includes('performance') || title.includes('fashion') || 
        title.includes('fancy dress') || title.includes('antakshari')) return '🎭'
    
    // Games and activities
    if (title.includes('game') || title.includes('team building') || title.includes('sport')) return '🎮'
    
    // Waste management and environment
    if (title.includes('waste')) return '♻️'
    
    // Tambola and gambling
    if (title.includes('tambola')) return '🎲'
    
    // Default icon
    return '🎉'
  }

  // Load event data and nominations
  useEffect(() => {
    const loadEventData = async () => {
      setIsLoading(true)
      setLoadError(null)
      
      try {
        // Load events data to find the specific event
        const eventsResponse = await fetch('/coord.json')
        if (!eventsResponse.ok) throw new Error('Failed to load events data')
        const eventsData = await eventsResponse.json()
        
        const foundEvent = eventsData.events.find((e: any, index: number) => index.toString() === eventId)
        
        if (!foundEvent) {
          throw new Error('Event not found')
        }
        
        const eventData: Event = {
          id: eventId,
          title: foundEvent.event,
          date: foundEvent.date,
          time: '',
          description: '',
          organizers: foundEvent.contact,
          category: 'festival'
        }
        
        setEvent(eventData)
        
        // Load nominations for this event
        if (isBhogEvent) {
          // For Bhog events, load Bhog nominations
          const bhogNominations = await databaseService.getAllBhogNominations()
          const eventBhogNominations = bhogNominations.filter(nom => 
            nom.bhog_name === eventData.title
          )
          setNominations(eventBhogNominations.map(nom => ({
            id: nom.id,
            eventTitle: nom.bhog_name,
            userName: nom.user_name,
            flatNumber: nom.flat,
            building: nom.building,
            timestamp: new Date(nom.created_at)
          })))
        } else {
          // For regular events, load event nominations
          const eventNominations = await databaseService.getAllEventNominations()
          const filteredNominations = eventNominations.filter(nom => 
            nom.event_title === eventData.title
          )
          setNominations(filteredNominations.map(nom => ({
            id: nom.id,
            eventTitle: nom.event_title,
            userName: nom.user_name,
            flatNumber: nom.flat,
            building: nom.building,
            timestamp: new Date(nom.created_at)
          })))
        }
        
      } catch (error) {
        console.error('Error loading event data:', error)
        setLoadError(error instanceof Error ? error.message : 'Unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (eventId) {
      loadEventData()
    }
  }, [eventId, isBhogEvent])

  const handleNominationSuccess = async (message: string) => {
    setShowNominationForm(false)
    
    // Reload nominations
    if (event) {
      try {
        if (isBhogEvent) {
          const bhogNominations = await databaseService.getAllBhogNominations()
          const eventBhogNominations = bhogNominations.filter(nom => 
            nom.bhog_name === event.title
          )
          setNominations(eventBhogNominations.map(nom => ({
            id: nom.id,
            eventTitle: nom.bhog_name,
            userName: nom.user_name,
            flatNumber: nom.flat,
            building: nom.building,
            timestamp: new Date(nom.created_at)
          })))
        } else {
          const eventNominations = await databaseService.getAllEventNominations()
          const filteredNominations = eventNominations.filter(nom => 
            nom.event_title === event.title
          )
          setNominations(filteredNominations.map(nom => ({
            id: nom.id,
            eventTitle: nom.event_title,
            userName: nom.user_name,
            flatNumber: nom.flat,
            building: nom.building,
            timestamp: new Date(nom.created_at)
          })))
        }
      } catch (error) {
        console.error('Error reloading nominations:', error)
      }
    }
  }

  const handleBackClick = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 digital-text">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (loadError || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-2xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Event Not Found</h2>
          <p className="text-red-600 mb-4">{loadError || 'The requested event could not be found.'}</p>
          <button
            onClick={handleBackClick}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const eventFlyerImage = getEventFlyerImage(event.title)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-amber-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-amber-800" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-amber-800 font-sohne">
                {event.title}
              </h1>
              <p className="text-sm text-amber-600 digital-text">
                Event Details & Nominations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side - Event Flyer */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-lg"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-4xl">{getEventIcon(event.title)}</span>
                </div>
                <h2 className="text-2xl font-bold text-amber-800 mb-2 font-jaf-bernino">
                  {event.title}
                </h2>
              </div>

              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="font-medium text-gray-800 digital-text">{event.date}</span>
                </div>
                
                {event.time && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="font-medium text-gray-800 digital-text">{event.time}</span>
                  </div>
                )}

                {event.organizers && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mt-0.5">
                      <Users className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 digital-text">
                        {event.organizers}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Event Flyer Image */}
              {eventFlyerImage && (
                <div className="text-center">
                  <img
                    src={eventFlyerImage}
                    alt={`${event.title} Event Flyer`}
                    className="w-full h-auto rounded-lg shadow-lg object-contain max-h-[70vh] mx-auto"
                    style={{ maxWidth: '100%' }}
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Side - Nominations */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-lg"
            >
              {/* Header with Nominate Button */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-amber-800 font-sohne">
                  {isBhogEvent ? 'Bhog Offerings' : 'Event Nominations'}
                </h3>
                <button
                  onClick={() => setShowNominationForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 digital-text"
                >
                  {isBhogEvent ? 'Offer Bhog' : 'Nominate'}
                </button>
              </div>

              {/* Nominations List */}
              {nominations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📝</div>
                  <p className="text-gray-600 font-medium mb-2 digital-text">
                    No {isBhogEvent ? 'Bhog offerings' : 'nominations'} yet
                  </p>
                  <p className="text-gray-500 text-sm digital-text">
                    Be the first to {isBhogEvent ? 'offer Bhog' : 'nominate'} for this event!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-gray-500 font-medium digital-text mb-3">
                    Total: {nominations.length} {isBhogEvent ? 'offering' : 'nomination'}{nominations.length !== 1 ? 's' : ''}
                  </div>
                  {nominations.map((nomination, index) => (
                    <motion.div
                      key={nomination.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 digital-text">
                            {nomination.userName}
                          </div>
                          <div className="text-sm text-gray-600 digital-text">
                            {nomination.building} - {nomination.flatNumber}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 digital-text">
                          {nomination.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Nomination Form Modal */}
      <AnimatePresence>
        {showNominationForm && (
          <EventNominationFlow
            eventData={{ title: event.title, date: event.date }}
            onClose={() => setShowNominationForm(false)}
            onSuccess={handleNominationSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
