import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Updating website URLs and ranks for participants...')
    
    const updates = [
      {
        name: 'Sahaj Soni',
        website: 'https://vibe-vortex-digital.lovable.app',
        rank: 1
      },
      {
        name: 'Om Raut', 
        website: 'https://orr-foodlovers.lovable.app',
        rank: 2
      },
      {
        name: 'Navya',
        website: 'https://yoga-for-everyone.lovable.app',
        rank: 3
      },
      {
        name: 'Naavya',
        website: 'https://yoga-for-everyone.lovable.app', 
        rank: 3
      },
      {
        name: 'Trisha',
        website: 'https://yoga-for-everyone.lovable.app',
        rank: 3
      }
    ]
    
    const results = []
    
    for (const update of updates) {
      try {
        const { data, error } = await supabase
          .from('vibe_registrations')
          .update({
            website: update.website,
            rank: update.rank
          })
          .ilike('full_name', `%${update.name.toLowerCase()}%`)
          .select()
        
        if (error) {
          console.error(`❌ Error updating ${update.name}:`, error)
          results.push({ name: update.name, success: false, error: error.message })
        } else {
          console.log(`✅ Updated ${update.name}:`, data)
          results.push({ name: update.name, success: true, updated: data?.length || 0 })
        }
      } catch (err) {
        console.error(`💥 Error updating ${update.name}:`, err)
        results.push({ name: update.name, success: false, error: err })
      }
    }
    
    // Get all records with websites to verify
    const { data: allRecords, error: fetchError } = await supabase
      .from('vibe_registrations')
      .select('full_name, website, rank, website_idea, vibe_code')
      .not('website', 'is', null)
      .order('rank', { ascending: true })
    
    if (fetchError) {
      console.error('❌ Error fetching updated records:', fetchError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Website URLs and ranks updated successfully',
      results,
      updated_records: allRecords || []
    })
    
  } catch (error) {
    console.error('💥 Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update website data' },
      { status: 500 }
    )
  }
}
