import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/database-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, ageGroup, flatNumber, websiteIdea, vibeCode, expectations, eventType } = body

    // Validate required fields
    if (!fullName || !flatNumber || !websiteIdea || !vibeCode) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Extract building and flat from flatNumber (e.g., "A101" -> building: "A", flat: "101")
    const building = flatNumber.charAt(0)
    const flat = flatNumber.substring(1)
    
    if (!building || !flat) {
      return NextResponse.json(
        { message: 'Invalid flat number format' },
        { status: 400 }
      )
    }

    // Store the registration in the database
    const registration = await databaseService.createVibeRegistration({
      full_name: fullName,
      age_group: ageGroup || '10-13', // Default value if not provided
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
    console.error('Error details:', {
      fullName: body.fullName,
      ageGroup: body.ageGroup,
      flatNumber: body.flatNumber,
      websiteIdea: body.websiteIdea,
      vibeCode: body.vibeCode,
      expectations: body.expectations,
      eventType: body.eventType
    })
    return NextResponse.json(
      { message: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
