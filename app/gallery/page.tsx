'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

// Import all available images from the events and property folders
const galleryImages = [
  '/images/events/Anchoring.jpeg',
  '/images/events/Arti prasad seva.jpeg',
  '/images/events/BestOutOF Waste.jpeg',
  '/images/events/Duo Dynamics.jpeg',
  '/images/events/GroupSingning.jpeg',
  '/images/events/IdolMaking.jpeg',
  '/images/events/ModakCompetition.jpeg',
  '/images/events/Singing.jpeg',
  '/images/konark.jpeg',
  '/images/konarkexotica.avif'
]

// Force static generation
export const dynamic = 'force-static'

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [direction, setDirection] = useState(0)

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPlaying, galleryImages.length])

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length)
  }

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🖼️</span>
              <a 
                href="/" 
                className="text-xl font-bold text-gray-800 font-style-script hover:text-blue-600 transition-colors duration-200 cursor-pointer"
              >
                Konark Exotica
              </a>
              <span className="text-gray-400 mx-2">•</span>
              <span className="text-lg font-semibold text-gray-700">Gallery</span>
            </div>
            
            <a 
              href="/"
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-style-script">
            Festival Gallery<br/>(Events & Property)
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-charter">
            Explore the vibrant events and beautiful property of our Ganesh Pooja Festival
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden mb-8"
        >
          {/* Main Image Display */}
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={currentIndex}
                src={galleryImages[currentIndex]}
                alt={`Gallery Image ${currentIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ 
                  opacity: 0,
                  x: direction === 1 ? 300 : -300,
                  scale: 0.8
                }}
                animate={{ 
                  opacity: 1,
                  x: 0,
                  scale: 1
                }}
                exit={{ 
                  opacity: 0,
                  x: direction === 1 ? -300 : 300,
                  scale: 0.8
                }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeInOut"
                }}
              />
            </AnimatePresence>

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentIndex + 1} / {galleryImages.length}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200 hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Thumbnail Navigation */}
          <div className="p-4 bg-gray-50">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gallery Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">📸</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-sohne">
                Auto-Play Carousel
              </h3>
            </div>
            <p className="text-gray-600 font-charter">
              Images automatically change every 3 seconds. Use the play/pause button to control the slideshow, or manually navigate using the arrows and thumbnails below.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 font-sohne">
                Interactive Controls
              </h3>
            </div>
            <p className="text-gray-600 font-charter">
              Navigate through the gallery using the arrow buttons, click on thumbnails for quick access, or let the carousel run automatically to enjoy a slideshow experience.
            </p>
          </div>
        </motion.div>

        {/* Image Credits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 font-charter">
            Showcasing our festival events and beautiful property
          </p>
        </motion.div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
