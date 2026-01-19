'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const SPORT_TYPES = [
  'Soccer',
  'Basketball',
  'Tennis',
  'Baseball',
  'Football',
  'Volleyball',
  'Hockey',
  'Swimming',
  'Track & Field',
  'Other',
]

const eventFormSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  sport_type: z.string().min(1, 'Please select a sport type'),
  date_time: z.string().min(1, 'Please select a date and time'),
  description: z.string().optional(),
  venues: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, 'Venue name is required'),
        address: z.string().optional(),
      })
    )
    .min(1, 'At least one venue is required'),
})

type EventFormValues = z.infer<typeof eventFormSchema>

type EventFormProps = {
  onSubmit: (data: EventFormValues) => Promise<void>
  initialData?: Partial<EventFormValues>
  submitLabel?: string
}

export function EventForm({ onSubmit, initialData, submitLabel = 'Create Event' }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      sport_type: initialData?.sport_type || '',
      date_time: initialData?.date_time || '',
      description: initialData?.description || '',
      venues: initialData?.venues || [{ name: '', address: '' }],
    },
  })

  // Venues are managed via form.watch and form.setValue

  const handleSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } catch (error) {
      // Next.js redirect() throws a NEXT_REDIRECT error which is expected
      // Only show error toast for actual errors
      if (error && typeof error === 'object' && 'digest' in error) {
        const digest = (error as { digest?: string }).digest
        if (digest?.includes('NEXT_REDIRECT')) {
          // This is a successful redirect, not an error
          return
        }
      }
      // Show specific error message if available
      const errorMessage = error instanceof Error ? error.message : 'Failed to save event'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Championship Finals" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sport_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SPORT_TYPES.map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add event details, requirements, or additional information..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Venues</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentVenues = form.getValues('venues')
                  form.setValue('venues', [...currentVenues, { name: '', address: '' }])
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Venue
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.watch('venues').map((venue, index) => (
              <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name={`venues.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Stadium name or location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`venues.${index}.address`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, City, State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch('venues').length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const currentVenues = form.getValues('venues')
                      form.setValue(
                        'venues',
                        currentVenues.filter((_, i) => i !== index)
                      )
                    }}
                    className="mt-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
          <Button type="button" variant="outline" asChild>
            <a href="/dashboard">Cancel</a>
          </Button>
        </div>
      </form>
    </Form>
  )
}
