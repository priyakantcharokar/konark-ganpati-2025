import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables not set!')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
  
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Please check your .env.local file.')
    console.warn('   Follow SUPABASE_SETUP.md for complete setup instructions.')
  } else {
    console.error('💥 Production environment missing Supabase configuration!')
  }
}

// Create Supabase client with proper error handling
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: false // Disable session persistence for server-side usage
    }
  }
)

// Types for our database
export interface User {
  id: string
  phone: string
  flat_number: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  date: string
  time: string
  description: string
  organizers: string
  category: string
  created_at: string
}

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}
