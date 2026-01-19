'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import type { ToastMessage } from '@/lib/toast-message'
import { clearToastMessageAction } from './action'

export function Toast({ message }: { message: ToastMessage | null }) {
  useEffect(() => {
    if (message) {
      if (message.type === 'success') {
        toast.success(message.message)
      } else if (message.type === 'error') {
        toast.error(message.message)
      }

      
      clearToastMessageAction()
    }
  }, [message])

  return null
}
