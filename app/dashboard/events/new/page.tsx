import { EventForm } from './event-form'
import { createEventAction   } from './actions'

export default function NewEventPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <p className="text-muted-foreground mt-1">
          Add a new sports event with venue information
        </p>
      </div>

      <EventForm onSubmit={createEventAction} submitLabel="Create Event" />
    </div>
  )
}
