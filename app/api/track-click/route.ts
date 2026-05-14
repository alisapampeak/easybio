import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { linkId } = await request.json()
    
    if (!linkId) {
      return NextResponse.json({ error: 'Link ID required' }, { status: 400 })
    }
    
    // Update click count
    const { error } = await supabase.rpc('increment_click_count', { link_id: linkId })
    
    if (error) {
      // Fallback: langsung update jika RPC tidak ada
      const { data: link } = await supabase
        .from('links')
        .select('clicks')
        .eq('id', linkId)
        .single()
      
      const currentClicks = link?.clicks || 0
      
      await supabase
        .from('links')
        .update({ clicks: currentClicks + 1 })
        .eq('id', linkId)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}