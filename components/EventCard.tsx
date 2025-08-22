'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Users, MapPin } from 'lucide-react'

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
    if (title.includes('anchoring')) return '🎤'
    
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
      className={`${getEventColor(event.title)} p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer`}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
            <span className="text-lg sm:text-xl md:text-2xl">{getEventIcon(event.title)}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200 mb-2 leading-tight font-jaf-bernino">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-gray-600 mb-4 leading-relaxed text-xs sm:text-sm group-hover:text-gray-700 transition-colors duration-200 font-charter">
          {event.description}
        </p>
      )}

      {/* Event Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/60 backdrop-blur-sm rounded-md sm:rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
          </div>
          <span className="font-semibold text-sm sm:text-base md:text-lg text-gray-800 font-sohne">{event.date}</span>
        </div>
        
        {event.time && (
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/60 backdrop-blur-sm rounded-md sm:rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
            </div>
            <span className="font-medium text-sm sm:text-base font-sohne">{event.time}</span>
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
                      <span className="font-semibold text-gray-800 font-sohne text-sm sm:text-base">{nameMatch}</span>
                      {phoneMatch && (
                        <span className="text-gray-600 ml-2 text-sm font-circular flex items-center gap-1">
                          <span className="text-green-600">📱</span>
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

      
    </motion.div>
  )
}

export default EventCard
