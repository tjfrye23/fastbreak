'use server'

import { updateEvent } from '@/lib/db/events'
import { setToastMessage } from '@/lib/toast-message'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type UpdateEventInput = {
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

export async function updateEventAction(id: string, input: UpdateEventInput): Promise<void> {
  const result = await updateEvent(id, input)
  
  if (!result.success) {
    throw new Error(result.error)
  }
  
  await setToastMessage({ type: 'success', message: 'Event updated successfully' })
  revalidatePath('/dashboard')
  redirect('/dashboard')
}
