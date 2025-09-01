'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
  themeStyles: {
    background: string
    text: string
    cardBg: string
    accent: string
    inputBg: string
    border: string
    muted: string
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true) // Default to dark mode

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    } else {
      // Default to dark mode
      setIsDarkMode(true)
    }
  }, [])

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Global theme styles with proper contrast
  const themeStyles = {
    background: isDarkMode 
      ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
      : 'bg-gradient-to-br from-gray-50 to-gray-100',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    cardBg: isDarkMode 
      ? 'bg-gray-800/95 backdrop-blur-md border-gray-600' 
      : 'bg-white/95 backdrop-blur-md border-gray-200',
    accent: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    inputBg: isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    border: isDarkMode ? 'border-gray-600' : 'border-gray-200',
    muted: isDarkMode ? 'text-gray-300' : 'text-gray-600'
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
