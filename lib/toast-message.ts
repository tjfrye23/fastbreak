import { cookies } from 'next/headers'

export const TOAST_COOKIE_NAME = 'toast-message'

export type ToastMessage = {
  type: 'success' | 'error'
  message: string
}

export async function setToastMessage(message: ToastMessage) {
  const cookieStore = await cookies()
  cookieStore.set(TOAST_COOKIE_NAME, JSON.stringify(message), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 5, // 5 seconds
    path: '/',
  })
}

export async function getToastMessage(): Promise<ToastMessage | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(TOAST_COOKIE_NAME)

  if (!cookie) {
    return null
  }

  try {
    return JSON.parse(cookie.value) as ToastMessage
  } catch {
    return null
  }
}
