import { z } from 'zod'

// Zod schemas for database validation
export const DomainVenue = z.object({
  id: z.uuid(),
  name: z.string(),
  address: z.string().nullable(),
})

export type DomainVenue = z.infer<typeof DomainVenue>

export const DomainEventVenue = z.object({
  venue_id: z.uuid(),
  venues: DomainVenue.nullable(),
})

export type DomainEventVenue = z.infer<typeof DomainEventVenue>

export const DomainEvent = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  name: z.string(),
  sport_type: z.string(),
  date_time: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  events_venues: z.array(DomainEventVenue).nullable().optional(),
})

export type DomainEvent = z.infer<typeof DomainEvent>
