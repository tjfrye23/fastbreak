'use client'

import { logout } from '@/lib/db/auth'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  return (
    <DropdownMenuItem
      onSelect={async (event) => {
        event.preventDefault()
        await logout()
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Log out</span>
    </DropdownMenuItem>
  )
}
