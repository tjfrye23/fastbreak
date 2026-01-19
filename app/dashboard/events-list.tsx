'use client'

import { UIEvent } from '@/lib/db/events'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Edit } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { DeleteEventButton } from './delete-event-button'

type EventsListProps = {
  events: UIEvent[]
  currentUserId: string
}

export function EventsList({ events, currentUserId }: EventsListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No events found</h3>
        <p className="text-muted-foreground mt-2">
          Get started by creating your first event.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/events/new">Create Event</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const isOwner = event.user_id === currentUserId
        const eventDate = new Date(event.date_time)

        return (
          <Card key={event.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="line-clamp-2">{event.name}</CardTitle>
                  <CardDescription className="mt-2">
                    <Badge variant="secondary">{event.sport_type}</Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <time dateTime={event.date_time}>
                    {format(eventDate, 'PPP p')}
                  </time>
                </div>
                {event.venues && event.venues.length > 0 && (
                  <div className="flex items-start text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      {event.venues.length === 1 ? (
                        <span>{event.venues[0].name}</span>
                      ) : (
                        <span>{event.venues.length} venues</span>
                      )}
                    </div>
                  </div>
                )}
                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
              {isOwner && (
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/dashboard/events/${event.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <DeleteEventButton eventId={event.id} />
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
