'use server'

import { createEvent } from '@/lib/db/events'
import { setToastMessage } from '@/lib/toast-message'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

export async function createEventAction(input: CreateEventInput): Promise<void> {
  const result = await createEvent(input)
  
  if (!result.success) {
    throw new Error(result.error)
  }
  
  await setToastMessage({ type: 'success', message: 'Event created successfully' })
  revalidatePath('/dashboard')
  redirect('/dashboard')
}
