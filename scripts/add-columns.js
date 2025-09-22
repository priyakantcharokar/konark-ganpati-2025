import { supabase } from './lib/supabase'

async function addWebsiteAndRankColumns() {
  try {
    console.log('🔄 Adding website and rank columns to vibe_registrations table...')
    
    // Add website column
    const { error: websiteError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE vibe_registrations ADD COLUMN IF NOT EXISTS website VARCHAR(500);'
    })
    
    if (websiteError) {
      console.error('❌ Error adding website column:', websiteError)
    } else {
      console.log('✅ Website column added successfully')
    }
    
    // Add rank column
    const { error: rankError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE vibe_registrations ADD COLUMN IF NOT EXISTS rank INTEGER;'
    })
    
    if (rankError) {
      console.error('❌ Error adding rank column:', rankError)
    } else {
      console.log('✅ Rank column added successfully')
    }
    
    console.log('🎉 All columns added successfully!')
    
  } catch (error) {
    console.error('💥 Error:', error)
  }
}

// Run the function
addWebsiteAndRankColumns()
