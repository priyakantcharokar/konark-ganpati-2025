'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Users, MapPin } from 'lucide-react'

interface EventCardProps {
  event: {
    id: string
    title: string
    date: string
    time: string
    description: string
    organizers: string
    category: string
  }
  index: number
}

const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'competition': 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50',
      'performance': 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50',
      'ceremony': 'border-red-200 bg-gradient-to-br from-red-50 to-pink-50',
      'game': 'border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50',
      'default': 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
    }
    return colors[category.toLowerCase()] || colors.default
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'competition': '🏆',
      'performance': '🎭',
      'ceremony': '🕉️',
      'game': '🎮',
      'default': '🎉'
    }
    return icons[category.toLowerCase()] || icons.default
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
      className={`${getCategoryColor(event.category)} p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer`}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-5">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
            <span className="text-lg sm:text-xl md:text-2xl">{getCategoryIcon(event.category)}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200 mb-1.5 sm:mb-2 leading-tight">
            {event.title}
          </h3>
          <span className={`inline-block px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-white/70 backdrop-blur-sm border border-current ${
            event.category === 'competition' ? 'text-amber-600 border-amber-300' :
            event.category === 'performance' ? 'text-orange-600 border-orange-300' :
            event.category === 'ceremony' ? 'text-red-600 border-red-300' :
            event.category === 'game' ? 'text-pink-600 border-pink-300' :
            'text-blue-600 border-blue-300'
          }`}>
            {event.category}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-3 sm:mb-4 md:mb-5 leading-relaxed text-xs sm:text-sm group-hover:text-gray-700 transition-colors duration-200">
        {event.description}
      </p>

      {/* Event Details */}
      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 md:mb-5">
        <div className="flex items-center gap-2 sm:gap-3 text-gray-700">
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-white/60 backdrop-blur-sm rounded-md sm:rounded-lg flex items-center justify-center shadow-sm">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-600" />
          </div>
          <span className="font-semibold text-xs sm:text-sm md:text-base text-gray-800">{event.date}</span>
        </div>
        
        {event.time && (
          <div className="flex items-center gap-2 sm:gap-3 text-gray-700">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-white/60 backdrop-blur-sm rounded-md sm:rounded-lg flex items-center justify-center shadow-sm">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-600" />
            </div>
            <span className="font-medium text-xs sm:text-sm">{event.time}</span>
          </div>
        )}

        {event.organizers && (
          <div className="flex items-start gap-2 sm:gap-3 text-gray-700">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-white/60 backdrop-blur-sm rounded-md sm:rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-xs sm:text-sm text-gray-800 leading-relaxed">
                {event.organizers.split(',').map((organizer, index) => {
                  const trimmed = organizer.trim()
                  const phoneMatch = trimmed.match(/(\d{10})/)
                  const nameMatch = trimmed.replace(/\s*-\s*\d{10}/, '').trim()
                  
                  return (
                    <span key={index} className="block mb-1 last:mb-0">
                      <span className="font-semibold text-gray-800">{nameMatch}</span>
                      {phoneMatch && (
                        <span className="text-gray-600 ml-2 text-xs">📞 {phoneMatch[1]}</span>
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
