import Link from 'next/link'
import { ArrowLeft, Trophy, Sparkles, Heart, Sun, Moon, Star, Code, Rocket } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

interface VibeRegistrationData {
  id: string
  full_name: string
  age_group: string
  building: string
  flat: string
  website_idea: string
  vibe_code: string
  expectations: string
  website?: string | null
  rank?: number | null
  created_at: string
}

async function getRegistrations(): Promise<VibeRegistrationData[]> {
  try {
    // Import the database service directly instead of using API call
    const { supabase } = await import('@/lib/supabase')
    
    const { data, error } = await supabase
      .from('vibe_registrations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Database error:', error)
      // Fallback to API call if direct database access fails
      return await getRegistrationsFromAPI()
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching registrations directly:', error)
    // Fallback to API call
    return await getRegistrationsFromAPI()
  }
}

async function getRegistrationsFromAPI(): Promise<VibeRegistrationData[]> {
  try {
    // Fallback API call
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/vibe-registrations`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching registrations from API:', error)
    return []
  }
}

export default async function WallOfFamePage() {
  const registrations = await getRegistrations()
  const websiteCreators = registrations.filter(reg => reg.website)
  const regularParticipants = registrations.filter(reg => !reg.website)

  // Debug logging for production
  console.log('Wall of Fame Debug:', {
    totalRegistrations: registrations.length,
    websiteCreators: websiteCreators.length,
    regularParticipants: regularParticipants.length,
    environment: process.env.NODE_ENV
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative">
      {/* Floating Code Elements - Hidden on mobile for better UX */}
      <div className="hidden sm:block absolute top-20 left-4 lg:left-10 text-xs opacity-80 animate-pulse font-orbitron font-bold floating-code text-green-400">
        &lt;WallOfFame /&gt;
      </div>
      <div className="hidden sm:block absolute top-40 right-4 lg:right-20 text-xs opacity-80 animate-pulse font-orbitron font-bold floating-code text-purple-400" style={{animationDelay: '1s'}}>
        const creators = []
      </div>
      <div className="hidden sm:block absolute bottom-40 left-4 lg:left-20 text-xs opacity-80 animate-pulse font-orbitron font-bold floating-code text-yellow-400" style={{animationDelay: '2s'}}>
        🏆 Amazing Work!
      </div>
      <div className="hidden sm:block absolute bottom-20 right-4 lg:right-10 text-xs opacity-80 animate-pulse font-orbitron font-bold floating-code text-pink-400" style={{animationDelay: '3s'}}>
        export default
      </div>

      {/* Floating Stars - Smaller on mobile */}
      <div className="absolute top-1/4 left-1/4 text-yellow-300 text-lg sm:text-2xl float-gentle">
        ⭐
      </div>
      <div className="absolute top-1/3 right-1/3 text-purple-300 text-base sm:text-xl float-gentle" style={{animationDelay: '0.5s'}}>
        ✨
      </div>
      <div className="absolute bottom-1/3 left-1/3 text-green-300 text-lg sm:text-2xl float-gentle" style={{animationDelay: '1s'}}>
        🌟
      </div>
      <div className="absolute bottom-1/4 right-1/4 text-pink-300 text-base sm:text-xl float-gentle" style={{animationDelay: '1.5s'}}>
        🚀
      </div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Link href="/vibe-coding" className="text-white hover:text-yellow-300 transition-all duration-300 p-1 sm:p-2 rounded-full hover:bg-white/20 hover:scale-110 flex-shrink-0">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <div className="flex-1 text-center px-2">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 transition-all duration-300 hover:scale-110 hover:text-yellow-400" />
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-orbitron text-white leading-tight hover:text-yellow-300 transition-all duration-300 hover:scale-105">
                  Wall of Fame
                </h1>
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 transition-all duration-300 hover:scale-110 hover:text-purple-400" />
              </div>
              <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-medium font-orbitron text-white leading-relaxed transition-colors duration-300 hover:text-gray-200">
                Celebrating Our Amazing Coders! 🚀
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10"></div>
          </div>
          
          <div className="bg-gray-800/95 backdrop-blur-md border-gray-600 rounded-xl p-4 sm:p-6 border shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 transition-all duration-300 hover:scale-110 hover:text-yellow-400" />
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 transition-all duration-300 hover:scale-110 hover:text-purple-400" />
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 transition-all duration-300 hover:scale-110 hover:text-pink-400" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 font-orbitron transition-colors duration-300 hover:text-yellow-200">
              🎉 Congratulations to All Participants! 🎉
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-white mb-3 sm:mb-4 font-orbitron transition-colors duration-300 hover:text-gray-200">
              You've all shown incredible creativity, innovation, and passion for coding!
            </p>
          </div>
        </div>

        {/* Website Creators Section */}
        {websiteCreators.length > 0 && (
          <div className="bg-gray-800/95 backdrop-blur-md border-gray-600 rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-yellow-400 shadow-2xl mb-6 sm:mb-8 hover:shadow-3xl hover:border-yellow-300 transition-all duration-500 ease-in-out">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 font-orbitron transition-all duration-300 hover:scale-105 hover:text-yellow-200">
                🚀 WEBSITE CREATORS 🚀
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-3 sm:mb-4 font-orbitron transition-colors duration-300 hover:text-gray-200">
                These amazing participants went above and beyond by creating LIVE websites!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {websiteCreators
                .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                .map((registration) => (
                  <div
                    key={registration.id}
                    className="bg-gray-700/95 backdrop-blur-md border-gray-600 rounded-xl p-3 sm:p-4 lg:p-6 border-2 border-yellow-400 shadow-xl hover:shadow-2xl hover:scale-105 hover:border-yellow-300 transition-all duration-300 ease-in-out group cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white text-lg sm:text-xl font-bold font-orbitron transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                        {registration.full_name.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 font-orbitron transition-colors duration-300 group-hover:text-yellow-200">
                        {registration.full_name}
                      </h3>
                      {registration.rank && (
                        <div className="text-sm sm:text-base lg:text-lg font-bold text-yellow-300 mb-2 sm:mb-3 font-orbitron transition-all duration-300 group-hover:scale-105">
                          🏆 Submission #{registration.rank}
                        </div>
                      )}
                      <a 
                        href={registration.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm lg:text-base text-white hover:text-gray-200 underline hover:no-underline font-bold font-orbitron transition-all duration-300 hover:scale-105"
                        style={{
                          animation: 'pulse 2s infinite',
                          textShadow: '0 0 10px #60a5fa, 0 0 20px #3b82f6'
                        }}
                      >
                        🚀 Click here to see amazing work! 🚀
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Regular Participants */}
        {regularParticipants.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 font-orbitron transition-all duration-300 hover:scale-105 hover:text-blue-200">
                🌟 ALL PARTICIPANTS 🌟
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-3 sm:mb-4 font-orbitron transition-colors duration-300 hover:text-gray-200">
                Every idea is amazing! These brilliant minds are working on their projects...
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {regularParticipants.map((registration) => (
              <div
                key={registration.id}
                className="bg-gray-800/95 backdrop-blur-md border-gray-600 rounded-2xl p-3 sm:p-4 lg:p-6 border shadow-xl hover:shadow-2xl hover:scale-105 hover:border-blue-400 transition-all duration-300 ease-in-out group cursor-pointer"
              >
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold font-orbitron transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:from-blue-400 group-hover:to-purple-400">
                    {registration.full_name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 font-orbitron transition-colors duration-300 group-hover:text-blue-200">
                    {registration.full_name}
                  </h3>
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-xs sm:text-sm font-bold text-white font-orbitron transition-colors duration-300 group-hover:text-blue-200">Idea:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-orbitron transition-colors duration-300 group-hover:text-gray-200">
                      {registration.website_idea}
                    </p>
                    <div className="mt-2 sm:mt-3 p-1.5 sm:p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 transition-all duration-300 group-hover:bg-blue-500/30 group-hover:border-blue-400/50 group-hover:scale-105">
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <div className="animate-spin rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 border-b-2 border-blue-400 transition-all duration-300 group-hover:border-blue-300"></div>
                        <span className="text-xs text-yellow-400 font-orbitron font-bold animate-pulse transition-all duration-300 group-hover:text-yellow-300">
                          💡 Idea Loading... Coming Soon!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}

        {/* No Data State */}
        {registrations.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <p className="text-white text-base sm:text-lg">No data found</p>
          </div>
        )}
      </div>
    </div>
  )
}