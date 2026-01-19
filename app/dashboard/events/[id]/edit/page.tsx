import { notFound } from 'next/navigation'
import { getEvent } from '@/lib/db/events'
import { EventForm } from '../../new/event-form'
import { isSuccess } from '@/lib/db/utils'
import { updateEventAction } from './actions'

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const eventResponse = await getEvent(id)

  if (!isSuccess(eventResponse)) {
    notFound()
  }

  const event = eventResponse.data

  // Format date for datetime-local input
  const formattedDateTime = new Date(event.date_time)
    .toISOString()
    .slice(0, 16)

  const initialData = {
    name: event.name,
    sport_type: event.sport_type,
    date_time: formattedDateTime,
    description: event.description || '',
    venues: event.venues.map((v) => ({
      id: v.id,
      name: v.name,
      address: v.address || '',
    })),
  }

  // Bind the server action with the event ID so it can be passed to the client component
  const boundUpdateAction = updateEventAction.bind(null, id)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <p className="text-muted-foreground mt-1">
          Update event details and venue information
        </p>
      </div>

      <EventForm
        onSubmit={boundUpdateAction}
        initialData={initialData}
        submitLabel="Update Event"
      />
    </div>
  )
}
