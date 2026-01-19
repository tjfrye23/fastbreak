import { getEvents } from '@/lib/db/events'
import { createClient } from '@/lib/supabase/server'
import { EventsList } from './events-list'
import { SearchFilter } from './search-filter'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { isSuccess } from '@/lib/db/utils'
import { getToastMessage } from '@/lib/toast-message'
import { Toast } from './toast'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sport?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const eventsResponse = await getEvents(params.search, params.sport)
  const toastMessage = await getToastMessage()

  if (!isSuccess(eventsResponse)) {
    throw new Error(eventsResponse.error)
  }

  const events = eventsResponse.data

  return (
    <div>
      <Toast message={toastMessage} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Events Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your sports events and venues
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <SearchFilter />

      {user && <EventsList events={events} currentUserId={user.id} />}
    </div>
  )
}
