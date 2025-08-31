import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/database-service'

export async function GET() {
  try {
    const registrations = await databaseService.getAllVibeRegistrations()
    
    return NextResponse.json(registrations, { status: 200 })
  } catch (error) {
    console.error('Error fetching vibe registrations:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
