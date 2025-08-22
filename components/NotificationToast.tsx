'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface Notification {
  id: string
  aartiSchedule: { date: string; time: string }
  building: string
  flat: string
  userName: string
  timestamp: string
  message: string
}

interface NotificationToastProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white border-l-4 border-orange-500 shadow-lg rounded-lg p-4 max-w-sm w-full"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 font-medium">
                    New Booking
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">
                  {notification.userName}
                </h4>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>🕉️ {notification.aartiSchedule.time}</span>
                  <span>📅 {notification.aartiSchedule.date}</span>
                  <span>🏢 {notification.building}</span>
                  <span>🏠 {notification.flat}</span>
                </div>
              </div>
              <button
                onClick={() => onRemove(notification.id)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationToast
