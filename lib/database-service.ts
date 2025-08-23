import { supabase } from './supabase'

// Database Types
export interface Booking {
  id: string
  user_name: string
  mobile_number?: string
  aarti_date: string
  aarti_time: string
  building: string
  flat: string
  created_at: string
  updated_at: string
}

export interface AartiSlot {
  id: string
  date: string
  time: string
  is_booked: boolean
  booking_id?: string
  created_at: string
}

export interface Submission {
  id: string
  aartiSchedule: { date: string; time: string }
  building: string
  flat: string
  userName: string
  mobileNumber?: string
  timestamp: Date
}

// Event Nomination Types
export interface EventNomination {
  id: string
  event_title: string
  event_date: string
  user_name: string
  mobile_number?: string
  building: string
  flat: string
  created_at: string
  updated_at: string
}

export interface CreateEventNomination {
  event_title: string
  event_date: string
  user_name: string
  mobile_number?: string
  building: string
  flat: string
}

// Database Service Class
export class DatabaseService {
  
  // Get all bookings
  async getAllBookings(): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching bookings:', error)
      return []
    }
  }

  // Create a new booking
  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating booking:', error)
      return null
    }
  }

  // Check if a slot is already booked
  async isSlotBooked(date: string, time: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('aarti_date', date)
        .eq('aarti_time', time)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
      return !!data
    } catch (error) {
      console.error('Error checking slot availability:', error)
      return false
    }
  }

  // Get booking details for a specific slot
  async getSlotBooking(date: string, time: string): Promise<Booking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('aarti_date', date)
        .eq('aarti_time', time)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Error fetching slot booking:', error)
      return null
    }
  }

  // Delete a booking (for admin purposes)
  async deleteBooking(bookingId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting booking:', error)
      return false
    }
  }

  // Get all aarti schedule slots
  async getAartiSchedule(): Promise<AartiSlot[]> {
    try {
      const { data, error } = await supabase
        .from('aarti_schedule')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching aarti schedule:', error)
      return []
    }
  }

  // Update aarti slot booking status
  async updateAartiSlot(slotId: string, isBooked: boolean, bookingId?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('aarti_schedule')
        .update({ 
          is_booked: isBooked, 
          booking_id: bookingId 
        })
        .eq('id', slotId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating aarti slot:', error)
      return false
    }
  }

  // Initialize aarti schedule from JSON data
  async initializeAartiSchedule(aartiData: Array<{ date: string; time: string }>): Promise<boolean> {
    try {
      // First, check if schedule already exists
      const existingSlots = await this.getAartiSchedule()
      if (existingSlots.length > 0) {
        console.log('Aarti schedule already initialized')
        return true
      }

      // Create slots from JSON data
      const slots = aartiData.map(item => ({
        date: item.date,
        time: item.time,
        is_booked: false
      }))

      const { error } = await supabase
        .from('aarti_schedule')
        .insert(slots)

      if (error) throw error
      console.log('Aarti schedule initialized successfully')
      return true
    } catch (error) {
      console.error('Error initializing aarti schedule:', error)
      return false
    }
  }

  // Convert database booking to submission format (for compatibility)
  convertBookingToSubmission(booking: Booking): Submission {
    return {
      id: booking.id,
      aartiSchedule: {
        date: booking.aarti_date,
        time: booking.aarti_time
      },
      building: booking.building,
      flat: booking.flat,
      userName: booking.user_name,
      mobileNumber: booking.mobile_number,
      timestamp: new Date(booking.created_at)
    }
  }

  // Convert submission to database format
  convertSubmissionToBooking(submission: Submission): Omit<Booking, 'id' | 'created_at' | 'updated_at'> {
    return {
      user_name: submission.userName,
      mobile_number: submission.mobileNumber || undefined,
      aarti_date: submission.aartiSchedule.date,
      aarti_time: submission.aartiSchedule.time,
      building: submission.building,
      flat: submission.flat
    }
  }

  // Event Nomination Methods
  
  // Get all nominations for a specific event
  async getEventNominations(eventTitle: string): Promise<EventNomination[]> {
    try {
      const { data, error } = await supabase
        .from('event_nominations')
        .select('*')
        .eq('event_title', eventTitle)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching event nominations:', error)
      return []
    }
  }

  // Create a new event nomination
  async createEventNomination(nomination: CreateEventNomination): Promise<EventNomination | null> {
    try {
      const { data, error } = await supabase
        .from('event_nominations')
        .insert([nomination])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating event nomination:', error)
      return null
    }
  }

  // Get all nominations (for admin purposes)
  async getAllEventNominations(): Promise<EventNomination[]> {
    try {
      const { data, error } = await supabase
        .from('event_nominations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching all event nominations:', error)
      return []
    }
  }

  // Delete an event nomination (for admin purposes)
  async deleteEventNomination(nominationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('event_nominations')
        .delete()
        .eq('id', nominationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting event nomination:', error)
      return false
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService()
