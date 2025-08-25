'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Users, X } from 'lucide-react'
import EventNominationFlow from '@/components/EventNominationFlow'
import { databaseService } from '@/lib/database-service'

// WhatsApp SVG Icon Component
const WhatsAppIcon = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className="text-[#25D366]"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.86 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
  </svg>
)

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
  bhogName?: string // Optional for Bhog events
  timestamp: Date
}

export default function EventDetailPage() {
  const params = useParams()
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
        
        // Check if this is a Bhog event AFTER loading the event data
        const isBhogEventCheck = eventData.title.includes('छप्पन भोग') && eventData.title.includes('56') && eventData.title.includes('Bhog')
        
        // Load nominations for this event
        if (isBhogEventCheck) {
          // For Bhog events, load all Bhog nominations (since they're all for this event type)
          console.log('Loading Bhog nominations...')
          const bhogNominations = await databaseService.getAllBhogNominations()
          console.log('Bhog nominations loaded:', bhogNominations)
          setNominations(bhogNominations.map(nom => ({
            id: nom.id,
            eventTitle: nom.bhog_name,
            userName: nom.user_name,
            flatNumber: nom.flat,
            building: nom.building,
            bhogName: nom.bhog_name, // Add Bhog name for display
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
  }, [eventId])

  const handleNominationSuccess = async (message: string) => {
    setShowNominationForm(false)
    
    // Reload nominations
    if (event) {
      try {
        const isBhogEventCheck = event.title.includes('छप्पन भोग') && event.title.includes('56') && event.title.includes('Bhog')
        
        if (isBhogEventCheck) {
          const bhogNominations = await databaseService.getAllBhogNominations()
          setNominations(bhogNominations.map(nom => ({
            id: nom.id,
            eventTitle: nom.bhog_name,
            userName: nom.user_name,
            flatNumber: nom.flat,
            building: nom.building,
            bhogName: nom.bhog_name,
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
    // Always go to landing page for consistency
    window.location.href = '/'
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
      <div className="bg-white/90 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-amber-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-amber-800" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-amber-800 font-sohne truncate">
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
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Side - Event Flyer (Smaller) */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-amber-200 shadow-lg"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl sm:text-4xl">{getEventIcon(event.title)}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-2 font-jaf-bernino">
                  {event.title}
                </h2>
              </div>

              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="font-medium text-gray-800 digital-text text-sm sm:text-base">{event.date}</span>
                </div>
                
                {event.time && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="font-medium text-gray-800 digital-text text-sm sm:text-base">{event.time}</span>
                  </div>
                )}

                {event.organizers && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Users className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 digital-text text-sm sm:text-base">
                        {event.organizers.split(',').map((organizer, index) => {
                          const trimmed = organizer.trim()
                          const phoneMatch = trimmed.match(/(\d{10})/)
                          const nameMatch = trimmed.replace(/\s*-\s*\d{10}/, '').trim()
                          
                          return (
                            <span key={index} className="block mb-2 last:mb-0">
                              <span className="font-bold text-gray-800 font-charter">{nameMatch}</span>
                              {phoneMatch && (
                                <span className="text-gray-600 ml-2 text-sm font-circular flex items-center gap-1">
                                  <WhatsAppIcon />
                                  {phoneMatch[1]}
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

              {/* Event Flyer Image */}
              {eventFlyerImage && (
                <div className="text-center">
                  <img
                    src={eventFlyerImage}
                    alt={`${event.title} Event Flyer`}
                    className="w-full h-auto rounded-lg shadow-lg object-contain max-h-[50vh] sm:max-h-[60vh] mx-auto"
                    style={{ maxWidth: '100%' }}
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Side - Nominations (Bigger) */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-lg overflow-hidden"
            >
              {/* Header with Nominate Button */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sohne">
                      {isBhogEvent ? '🕉️ Bhog Offerings' : '📝 Event Nominations'}
                    </h3>
                    <p className="text-amber-100 text-sm mt-1">
                      {isBhogEvent ? 'Share your food offerings with the community' : 'Join this exciting event'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNominationForm(true)}
                    disabled={isBhogEvent}
                    className={`py-3 px-6 sm:px-8 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      isBhogEvent 
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-blue-400/50 hover:shadow-purple-400/75 glow-pulse-blue'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">
                        {isBhogEvent ? '🚫' : '🎯'}
                      </span>
                      <span>
                        {isBhogEvent ? 'Bhog Entry Closed' : 'Nominate'}
                      </span>
                      <span className="text-lg">
                        {isBhogEvent ? '❌' : '🚀'}
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Total Offerings Card - Only for Bhog events */}
              {isBhogEvent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 border-b border-gray-200"
                >
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-gray-500 mb-2 font-mono">
                      {nominations.length}
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-gray-600">
                      Total Bhog Offerings
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Content Area */}
              <div className="p-4 sm:p-6">
                {/* Nominations List */}
                {nominations.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-gray-300 text-4xl sm:text-5xl mb-4">
                      {isBhogEvent ? '🕉️' : '📝'}
                    </div>
                    <p className="text-gray-600 font-medium mb-2 digital-text text-base sm:text-lg">
                      No {isBhogEvent ? 'Bhog offerings' : 'nominations'} yet
                    </p>
                    <p className="text-gray-500 text-sm sm:text-base digital-text">
                      {isBhogEvent ? 'Bhog functionality is currently disabled' : 'Be the first to nominate for this event!'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Column Headers */}
                    <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center mb-3">
                      <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Sr. No.
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Flat
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Name
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Bhog
                      </div>
                    </div>
                    
                    {nominations.map((nomination, index) => (
                      <motion.div
                        key={nomination.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 sm:p-4 border border-amber-200 hover:border-amber-300 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                          <div className="font-semibold text-gray-800 digital-text text-sm sm:text-base">
                            {index + 1}
                          </div>
                          <div className="font-semibold text-gray-800 digital-text text-sm sm:text-base">
                            {nomination.flatNumber}
                          </div>
                          <div className="font-semibold text-gray-800 digital-text text-sm sm:text-base">
                            {nomination.userName}
                          </div>
                          <div className="font-semibold text-gray-800 digital-text text-sm sm:text-base">
                            {nomination.bhogName}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
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