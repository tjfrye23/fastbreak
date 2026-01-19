'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionResponse } from './utils'
import { DomainVenue } from '@/lib/types/events'

export async function getVenues(): Promise<ActionResponse<DomainVenue[]>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data || [] }
}

export async function createVenue(name: string, address?: string): Promise<ActionResponse<DomainVenue>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('venues')
    .insert({
      name,
      address: address || null,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data }
}

export async function searchVenues(query: string): Promise<ActionResponse<DomainVenue[]>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name', { ascending: true })
    .limit(10)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data || [] }
}
