import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🧪 Testing database connection...')
    
    // Test basic connection by trying to count records
    const { count, error } = await supabase
      .from('vibe_registrations')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('❌ Database connection test failed:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        environment: process.env.NODE_ENV
      }, { status: 500 })
    }

    console.log('✅ Database connection test successful')
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      count: count || 0,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }, { status: 200 })

  } catch (error) {
    console.error('💥 Database connection test error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Database connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { status: 500 })
  }
}
