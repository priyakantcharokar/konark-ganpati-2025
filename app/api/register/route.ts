import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/database-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, flatNumber, websiteIdea, vibeCode, expectations, eventType } = body

    // Validate required fields
    if (!fullName || !flatNumber || !websiteIdea || !vibeCode) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Extract building and flat from flatNumber (e.g., "A-101" -> building: "A", flat: "101")
    const [building, flat] = flatNumber.split('-')
    
    if (!building || !flat) {
      return NextResponse.json(
        { message: 'Invalid flat number format' },
        { status: 400 }
      )
    }

    // Store the registration in the database
    const registration = await databaseService.createVibeRegistration({
      full_name: fullName,
      building: building,
      flat: flat,
      website_idea: websiteIdea,
      vibe_code: vibeCode,
      expectations: expectations || '',
      event_type: eventType || 'vibe_coding'
    })

    return NextResponse.json(
      { 
        message: 'Registration successful!',
        registrationId: registration.id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating vibe registration:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
