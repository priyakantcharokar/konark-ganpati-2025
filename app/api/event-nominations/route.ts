import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/database-service'

export async function GET() {
  try {
    console.log('📡 API: Fetching event nominations...')
    const nominations = await databaseService.getAllEventNominations()
    
    console.log('✅ API: Successfully fetched', nominations.length, 'event nominations')
    return NextResponse.json(nominations, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('❌ API: Error fetching event nominations:', error)
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
