'use server'

import { deleteEvent } from '@/lib/db/events'
import { ActionResponse } from '@/lib/db/utils'
import { setToastMessage, TOAST_COOKIE_NAME } from '@/lib/toast-message'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function deleteEventAction(eventId: string): Promise<ActionResponse<void>> {
  const result = await deleteEvent(eventId)
  
  if (result.success) {
    await setToastMessage({ type: 'success', message: 'Event deleted successfully' })
    revalidatePath('/dashboard')
    redirect('/dashboard')
  } else {
    await setToastMessage({ type: 'error', message: result.error })
    return result
  }
}

export async function clearToastMessageAction() {
  const cookieStore = await cookies()
  cookieStore.set(TOAST_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
}