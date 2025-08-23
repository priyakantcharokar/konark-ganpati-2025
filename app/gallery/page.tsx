'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause, X } from 'lucide-react'

// Memory categories with their folder paths and display names
const memoryCategories = [
  {
    id: 'idolmaking',
    name: 'Idol Making',
    folder: '/memories/idolmaking/',
    images: [
      '/memories/idolmaking/WhatsApp Image 2025-08-23 at 19.52.45.jpeg',
      '/memories/idolmaking/WhatsApp Image 2025-08-23 at 19.52.46.jpeg',
      '/memories/idolmaking/WhatsApp Image 2025-08-23 at 19.52.48.jpeg',
      '/memories/idolmaking/WhatsApp Image 2025-08-23 at 19.52.51.jpeg',
      '/memories/idolmaking/WhatsApp Image 2025-08-23 at 19.57.26.jpeg',
      '/memories/idolmaking/IMG20250823174833.jpg',
      '/memories/idolmaking/IMG20250823174701.jpg',
      '/memories/idolmaking/IMG20250823174705.jpg',
      '/memories/idolmaking/IMG20250823174710.jpg',
      '/memories/idolmaking/IMG20250823174718.jpg',
      '/memories/idolmaking/IMG20250823174845.jpg',
      '/memories/idolmaking/IMG20250823174852.jpg',
      '/memories/idolmaking/IMG20250823175045.jpg',
      '/memories/idolmaking/IMG20250823175049.jpg',
      '/memories/idolmaking/IMG20250823175055.jpg',
      '/memories/idolmaking/IMG20250823175104.jpg',
      '/memories/idolmaking/IMG20250823181713.jpg',
      '/memories/idolmaking/IMG20250823181717.jpg'
    ]
  },
  {
    id: 'pastyear',
    name: 'Past Year Memories',
    folder: '/memories/pastyear/',
    images: [
      '/memories/pastyear/IMG_20240917_111033.jpg',
      '/memories/pastyear/IMG_20240915_203801.jpg',
      '/memories/pastyear/IMG_20240917_112501.jpg',
      '/memories/pastyear/IMG_20240917_112549.jpg',
      '/memories/pastyear/IMG_20240917_122353.jpg',
      '/memories/pastyear/IMG_0363.JPG',
      '/memories/pastyear/IMG_0364.JPG',
      '/memories/pastyear/IMG_0765.JPG'
    ]
  }
]

// Force static generation
export const dynamic = 'force-static'

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [direction, setDirection] = useState(0)

  // Get current category images
  const currentImages = selectedCategory 
    ? memoryCategories.find(cat => cat.id === selectedCategory)?.images || []
    : []

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    if (!isPlaying || !selectedCategory) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % currentImages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPlaying, currentImages.length, selectedCategory])

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentImages.length)
  }

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const openCategory = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentIndex(0)
    setIsPlaying(true)
  }

  const closeCategory = () => {
    setSelectedCategory(null)
    setCurrentIndex(0)
    setIsPlaying(false)
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
            Festival Gallery<br/>(Memories)
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-charter">
            Relive the beautiful moments and cherished memories from our Ganesh Pooja Festival
          </p>
        </motion.div>

        {/* Memory Category Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {memoryCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                selectedCategory === category.id ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
              }`}
              onClick={() => openCategory(category.id)}
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-white">
                    {category.id === 'idolmaking' ? '🏺' : '📸'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-style-script">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.images.length} photos
                </p>
                <div className="mt-4 text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-200">
                  Click to view →
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Carousel Container - Only show when category is selected */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden mb-8"
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold font-style-script">
                  {memoryCategories.find(cat => cat.id === selectedCategory)?.name}
                </h2>
                <button
                  onClick={closeCategory}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Image Display */}
              <div className="relative h-80 sm:h-96 md:h-[500px] lg:h-[600px] overflow-hidden p-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={currentIndex}
                    src={currentImages[currentIndex]}
                    alt={`${selectedCategory} Image ${currentIndex + 1}`}
                    className="w-full h-full object-contain bg-gray-100 rounded-lg"
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
                  {currentIndex + 1} / {currentImages.length}
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
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {currentImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentIndex
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-contain bg-gray-50"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-gray-600"
          >
            <p className="font-charter">
              Click on any memory category above to view the photo carousel
            </p>
          </motion.div>
        )}

        {/* Image Credits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 font-charter">
            Beautiful memories captured during our Ganesh Pooja Festival celebrations
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
