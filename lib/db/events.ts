'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { DomainEvent } from '@/lib/types/events'
import { ActionResponse } from './utils'
import { z } from 'zod'

export type UIEvent = {
  id: string
  user_id: string
  name: string
  sport_type: string
  date_time: string
  description: string | null
  created_at: string
  updated_at: string
  venues: Array<{
    id: string
    name: string
    address: string | null
  }>
}

export async function getEvents(searchQuery?: string, sportType?: string): Promise<ActionResponse<UIEvent[]>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  let query = supabase
    .from('events')
    .select(`
      *,
      events_venues (
        venue_id,
        venues (
          id,
          name,
          address
        )
      )
    `)
    .order('date_time', { ascending: true })

  // Validate and apply search filter
  if (searchQuery && searchQuery.trim()) {
    const searchSchema = z.string()
      .max(100, 'Search query too long')
      .regex(/^[a-zA-Z0-9\s\-_'.]+$/, 'Invalid search characters')

    const validationResult = searchSchema.safeParse(searchQuery.trim())
    if (validationResult.success) {
      query = query.ilike('name', `%${validationResult.data}%`)
    }
  }

  // Validate and apply sport type filter
  if (sportType && sportType.trim() && sportType !== 'all') {
    const allowedSports = [
      'Soccer', 'Basketball', 'Tennis', 'Baseball', 'Football',
      'Volleyball', 'Hockey', 'Swimming', 'Track & Field', 'Other'
    ]
    if (allowedSports.includes(sportType)) {
      query = query.eq('sport_type', sportType)
    }
  }

  const { data, error } = await query

  if (error) {
    return { success: false, error: error.message }
  }

  // Validate and transform the data to include venues array
  const events: UIEvent[] = (data || []).map((row) => {
    const parsed = DomainEvent.parse(row)
    return {
      id: parsed.id,
      user_id: parsed.user_id,
      name: parsed.name,
      sport_type: parsed.sport_type,
      date_time: parsed.date_time,
      description: parsed.description,
      created_at: parsed.created_at,
      updated_at: parsed.updated_at,
      venues: parsed.events_venues?.map((ev) => ev.venues).filter((v) => v !== null) ?? [],
    }
  })

  return { success: true, data: events }
}

export async function getEvent(id: string): Promise<ActionResponse<UIEvent>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      events_venues (
        venue_id,
        venues (
          id,
          name,
          address
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return { success: false, error: error?.message || 'Event not found' }
  }

  // Validate and transform the data
  const parsed = DomainEvent.parse(data)

  const event: UIEvent = {
    id: parsed.id,
    user_id: parsed.user_id,
    name: parsed.name,
    sport_type: parsed.sport_type,
    date_time: parsed.date_time,
    description: parsed.description,
    created_at: parsed.created_at,
    updated_at: parsed.updated_at,
    venues: parsed.events_venues?.map((ev) => ev.venues).filter((v) => v !== null) ?? [],
  }

  return { success: true, data: event }
}

type CreateEventInput = {
  name: string
  sport_type: string
  date_time: string
  description?: string
  venues: Array<{
    id?: string
    name: string
    address?: string
  }>
}

export async function createEvent(input: CreateEventInput): Promise<ActionResponse<void>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Create the event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .insert({
      user_id: user.id,
      name: input.name,
      sport_type: input.sport_type,
      date_time: input.date_time,
      description: input.description || null,
    })
    .select()
    .single()

  if (eventError || !event) {
    return { success: false, error: eventError?.message || 'Failed to create event' }
  }

  // Create or get venues and link them to the event
  for (const venueInput of input.venues) {
    let venueId = venueInput.id

    // If no venue ID, create a new venue
    if (!venueId) {
      const { data: newVenue, error: venueError } = await supabase
        .from('venues')
        .insert({
          name: venueInput.name,
          address: venueInput.address || null,
        } )
        .select()
        .single()

      if (venueError || !newVenue) {
        // If venue creation fails, continue with other venues
        continue
      }

      venueId = newVenue.id
    }

    // Link venue to event
    await supabase.from('events_venues').insert({
      event_id: event.id,
      venue_id: venueId,
    })
  }

  return { success: true, data: undefined }
}

export async function updateEvent(eventId: string, input: CreateEventInput): Promise<ActionResponse<void>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Check ownership
  const { data: existingEvent } = await supabase
    .from('events')
    .select('user_id')
    .eq('id', eventId)
    .single()


  if (!existingEvent || existingEvent.user_id !== user.id) {
    return { success: false, error: 'Unauthorized' }
  }

  // Update the event
  const { error: eventError } = await supabase
    .from('events')
    .update({
      name: input.name,
      sport_type: input.sport_type,
      date_time: input.date_time,
      description: input.description || null,
    })
    .eq('id', eventId)

  if (eventError) {
    return { success: false, error: eventError.message }
  }

  // Delete existing venue relationships
  await supabase.from('events_venues').delete().eq('event_id', eventId)

  // Create new venue relationships
  for (const venueInput of input.venues) {
    let venueId = venueInput.id

    if (!venueId) {
      const { data: newVenue, error: venueError } = await supabase
        .from('venues')
        .insert({
          name: venueInput.name,
          address: venueInput.address || null,
        })
        .select()
        .single()

      if (venueError || !newVenue) {
        continue
      }

      venueId = newVenue.id
    }

    await supabase.from('events_venues').insert({
      event_id: eventId,
      venue_id: venueId,
    })
  }

  return { success: true, data: undefined }
}

export async function deleteEvent(eventId: string): Promise<ActionResponse<void>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  // Check ownership
  const { data: existingEvent } = await supabase
    .from('events')
    .select('user_id')
    .eq('id', eventId)
    .single()

  if (!existingEvent || existingEvent.user_id !== user.id) {
    return { success: false, error: 'Unauthorized' }
  }

  // Delete the event (cascade will handle events_venues)
  const { error } = await supabase.from('events').delete().eq('id', eventId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true, data: undefined }
}
