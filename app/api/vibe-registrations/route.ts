import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/database-service'

export async function GET() {
  try {
    console.log('📡 API: Fetching vibe registrations...')
    const registrations = await databaseService.getAllVibeRegistrations()
    
    console.log('✅ API: Successfully fetched', registrations.length, 'registrations')
    return NextResponse.json(registrations, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('❌ API: Error fetching vibe registrations:', error)
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
