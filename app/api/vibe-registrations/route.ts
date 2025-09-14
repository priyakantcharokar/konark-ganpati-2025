import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/database-service'

export async function GET() {
  try {
    console.log('📡 API: Fetching vibe registrations...')
    const registrations = await databaseService.getAllVibeRegistrations()
    
    console.log('✅ API: Successfully fetched', registrations.length, 'registrations')
    
    // Ultra-aggressive cache prevention headers
    return NextResponse.json(registrations, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private, no-transform',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': new Date().toUTCString(),
        'ETag': `"${Date.now()}-${Math.random()}"`,
        'Vary': '*',
        'Surrogate-Control': 'no-store',
        'X-Accel-Expires': '0',
        'X-Cache': 'MISS',
        'X-Cache-Lookup': 'MISS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '0'
      }
    })
  } catch (error) {
    console.error('❌ API: Error fetching vibe registrations:', error)
    
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
