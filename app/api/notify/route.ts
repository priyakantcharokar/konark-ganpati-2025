import { NextRequest, NextResponse } from 'next/server'
import { pusher } from '@/lib/pusher'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { aartiSchedule, building, flat, userName } = body

    // Send Pusher notification (real-time web notifications)
    await pusher.trigger('ganesh-pooja-bookings', 'slot-booked', {
      aartiSchedule,
      building,
      flat,
      userName,
      timestamp: new Date().toISOString(),
      message: `${userName} has booked slot ${aartiSchedule.time} on ${aartiSchedule.date} for Building ${building}, Flat ${flat}`
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Notification sent successfully' 
    })
  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
