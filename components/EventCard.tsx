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
      className={`${getCategoryColor(event.category)} p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer`}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-start gap-4 mb-5">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
            <span className="text-2xl">{getCategoryIcon(event.category)}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200 mb-2 leading-tight">
            {event.title}
          </h3>
          <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-white/70 backdrop-blur-sm border border-current ${
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
      <p className="text-gray-600 mb-5 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-200">
        {event.description}
      </p>

      {/* Event Details */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-3 text-gray-700">
          <div className="w-8 h-8 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm">
            <Calendar className="w-4 h-4 text-gray-600" />
          </div>
          <span className="font-semibold text-base text-gray-800">{event.date}</span>
        </div>
        
        {event.time && (
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-8 h-8 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm">
              <Clock className="w-4 h-4 text-gray-600" />
            </div>
            <span className="font-medium text-sm">{event.time}</span>
          </div>
        )}
      </div>

      
    </motion.div>
  )
}

export default EventCard
