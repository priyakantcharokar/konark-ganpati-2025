import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/database-service'

export async function GET() {
  try {
    console.log('📡 API: Fetching event nominations...')
    const nominations = await databaseService.getAllEventNominations()
    
    console.log('✅ API: Successfully fetched', nominations.length, 'event nominations')
    
    // Enhanced headers for production compatibility
    return NextResponse.json(nominations, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': new Date().toUTCString(),
        'ETag': `"${Date.now()}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
  } catch (error) {
    console.error('❌ API: Error fetching event nominations:', error)
    
    // Enhanced error response with more details
    const errorResponse = {
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown'
    }
    
    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  }
}
