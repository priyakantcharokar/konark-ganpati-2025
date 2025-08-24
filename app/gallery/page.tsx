'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface MemoryCategory {
  id: string
  name: string
  folder: string
  images: string[]
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [memoryCategories, setMemoryCategories] = useState<MemoryCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to discover images from folders
  const discoverImagesFromFolders = async () => {
    try {
      // Define the folder structure we want to check
      const folders = [
        { id: 'idolmaking', name: 'Idol Making', folder: '/memories/idolmaking/' },
        { id: 'pastyear', name: 'Past Year Memories', folder: '/memories/pastyear/' },
        { id: 'memories', name: 'General Memories', folder: '/memories/' }
      ]

      const categories: MemoryCategory[] = []

      for (const folder of folders) {
        try {
          // Fetch images from the API endpoint
          const response = await fetch(`/api/gallery-images?folder=${encodeURIComponent(folder.folder)}`)
          
          if (response.ok) {
            const data = await response.json()
            categories.push({
              ...folder,
              images: data.images || []
            })
          } else {
            console.warn(`Could not load images from ${folder.folder}:`, response.statusText)
            categories.push({
              ...folder,
              images: []
            })
          }
        } catch (error) {
          console.warn(`Could not load images from ${folder.folder}:`, error)
          // Add category with empty images array
          categories.push({
            ...folder,
            images: []
          })
        }
      }

      setMemoryCategories(categories)
    } catch (error) {
      console.error('Error discovering images:', error)
      // Fallback to empty categories
      setMemoryCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    discoverImagesFromFolders()
  }, [])

  const openCategory = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentImageIndex(0)
  }

  const closeCategory = () => {
    setSelectedCategory(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    const category = memoryCategories.find(cat => cat.id === selectedCategory)
    if (category && category.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === category.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    const category = memoryCategories.find(cat => cat.id === selectedCategory)
    if (category && category.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? category.images.length - 1 : prev - 1
      )
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCategory()
    }
  }

  const selectedCategoryData = memoryCategories.find(cat => cat.id === selectedCategory)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 digital-text">Loading gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-4 font-style-script">
          🖼️ Festival Gallery
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto digital-text">
          Relive the beautiful moments and cherished memories from our Ganesh Pooja Festival
        </p>
      </div>

      {/* Memory Categories Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {memoryCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-amber-800 text-lg mb-4">
              No memory categories found
            </div>
            <p className="text-gray-600 digital-text">
              Please ensure the memories folder contains image files
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memoryCategories.map((category, index) => (
              <motion.div
                key={category.id}
                onClick={() => category.images.length > 0 ? openCategory(category.id) : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200 shadow-lg transition-all duration-300 group ${
                  category.images.length > 0 
                    ? 'hover:shadow-xl cursor-pointer hover:scale-105' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 ${
                    category.images.length > 0 
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 group-hover:scale-110' 
                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    <span className="text-white text-2xl">
                      {category.images.length > 0 ? '📸' : '⚠️'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-amber-800 mb-2 font-sohne">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm digital-text">
                    {category.images.length > 0 ? `${category.images.length} photos` : 'No photos found'}
                  </p>
                  {category.images.length > 0 && (
                    <div className="mt-4 text-amber-600 font-medium digital-text">
                      Click to view →
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <p className="digital-text">
            {memoryCategories.length > 0 
              ? 'Click on any memory category above to view the photo carousel'
              : 'Please add images to the memories folder to view the gallery'
            }
          </p>
        </div>
      </div>

      {/* Photo Carousel Modal */}
      <AnimatePresence>
        {selectedCategory && selectedCategoryData && selectedCategoryData.images.length > 0 && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={handleBackdropClick}
            >
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white rounded-2xl shadow-2xl w-full h-full flex flex-col overflow-hidden">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
                    <h2 className="text-xl md:text-2xl font-bold text-amber-800 font-sohne">
                      📸 {selectedCategoryData.name}
                    </h2>
                    <button
                      onClick={closeCategory}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <X className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>

                  {/* Carousel Content */}
                  <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
                    {/* Main Image */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={selectedCategoryData.images[currentImageIndex]}
                        alt={`${selectedCategoryData.name} - Image ${currentImageIndex + 1}`}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        onError={(e) => {
                          // Handle image loading errors
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          // You could show a placeholder image here
                        }}
                      />
                      
                      {/* Image Counter */}
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {selectedCategoryData.images.length}
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    {selectedCategoryData.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-700" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {selectedCategoryData.images.length > 1 && (
                    <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
                      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
                        {selectedCategoryData.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              index === currentImageIndex
                                ? 'border-amber-500 shadow-lg'
                                : 'border-gray-300 hover:border-amber-300'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Handle thumbnail loading errors
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="text-center py-8 bg-white/50 border-t border-amber-200">
        <p className="text-sm text-gray-500 digital-text">
          Beautiful memories captured during our Ganesh Pooja Festival celebrations
        </p>
      </footer>
    </div>
  )
}
