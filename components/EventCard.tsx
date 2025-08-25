'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Users, MapPin } from 'lucide-react'

// WhatsApp SVG Icon Component
const WhatsAppIcon = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className="text-[#25D366]"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
  </svg>
)

interface EventCardProps {
  event: {
    id: string
    title: string
    date: string
    time: string
    description?: string
    organizers: string
    category: string
  }
  index: number
}

const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  // Check if this is a Bhog event
  const isBhogEvent = event.title.includes('छप्पन भोग') || event.title.includes('56') || event.title.includes('Bhog')

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

  const getEventColor = (eventTitle: string) => {
    const title = eventTitle.toLowerCase()
    
    // Religious activities
    if (title.includes('idol') || title.includes('aarti') || title.includes('puja') || 
        title.includes('bhog') || title.includes('satyanarayan')) {
      return 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'
    }
    
    // Creative activities
    if (title.includes('rangoli') || title.includes('drawing') || title.includes('recitation')) {
      return 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50'
    }
    
    // Entertainment
    if (title.includes('karaoke') || title.includes('performance') || title.includes('fashion') || 
        title.includes('fancy dress') || title.includes('antakshari')) {
      return 'border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50'
    }
    
    // Coordination and hosting
    if (title.includes('ganapati') && title.includes('utsav') && title.includes('hosting')) {
      return 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
    }
    
    // Games and sports
    if (title.includes('game') || title.includes('team building') || title.includes('sport')) {
      return 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
    }
    
    // Food and cooking
    if (title.includes('modak') || title.includes('cooking') || title.includes('food')) {
      return 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50'
    }
    
    // Default
    return 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ 
        y: -6, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={`${getEventColor(event.title)} p-3 sm:p-4 rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300`}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 border border-white/50">
            <span className="text-lg sm:text-xl">{getEventIcon(event.title)}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 leading-tight font-jaf-bernino bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-gray-600 mb-3 leading-relaxed text-xs sm:text-sm transition-colors duration-200 font-charter">
          {event.description}
        </p>
      )}

      {/* Event Details */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/60 backdrop-blur-sm rounded-md sm:rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
          </div>
          <span className="font-bold text-sm sm:text-base md:text-lg text-gray-800 font-charter">{event.date}</span>
        </div>
        
        {event.time && (
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/60 backdrop-blur-sm rounded-md sm:rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
            </div>
            <span className="font-normal text-sm sm:text-base font-charter">{event.time}</span>
          </div>
        )}

        {event.organizers && (
          <div className="flex items-start gap-3 text-gray-700">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/60 backdrop-blur-sm rounded-md sm:rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm sm:text-base text-gray-800 leading-relaxed font-kievit">
                {event.organizers.split(',').map((organizer, index) => {
                  const trimmed = organizer.trim()
                  const phoneMatch = trimmed.match(/(\d{10})/)
                  const nameMatch = trimmed.replace(/\s*-\s*\d{10}/, '').trim()
                  
                  return (
                    <span key={index} className="block mb-2 last:mb-0">
                                              <span className="font-bold text-gray-800 font-charter text-sm sm:text-base">{nameMatch}</span>
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

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3">
        {/* Show Nominate button for regular events, but hide for special events */}
        {!event.title.includes('Aarti And Prasad Seva') && 
         !event.title.includes('Ganapati Sthapana') && 
         !event.title.toLowerCase().includes('tambola') && (
          <button
            onClick={() => {
              if (isBhogEvent) {
                // For Bhog events, navigate to Bhog List with source info
                window.location.href = `/bhog-list?source=events&event=${encodeURIComponent(event.title)}`
              } else {
                // For regular events, navigate to dedicated event page
                window.location.href = `/events/${event.id}`
              }
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-1.5 px-3 rounded-lg font-normal hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-xs"
          >
            {isBhogEvent ? 'Offer Bhog' : 'Nominate'}
          </button>
        )}
        
        {/* Special Book Aarti button for Aarti And Prasad Seva */}
        {event.title.includes('Aarti And Prasad Seva') && (
          <button
            onClick={() => {
              // Navigate to the Daily Aarti Schedule tab
              const aartiTab = document.querySelector('[data-tab="aarti"]') as HTMLElement
              if (aartiTab) {
                aartiTab.click()
                // Scroll to the aarti section
                setTimeout(() => {
                  const aartiSection = document.querySelector('[data-aarti-section]')
                  if (aartiSection) {
                    aartiSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }
                }, 100)
              }
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-1.5 px-3 rounded-lg font-normal hover:from-orange-600 hover:to-amber-700 transition-all duration-200 transform hover:scale-105 text-xs"
          >
            🙏 Book Aarti
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default EventCard
