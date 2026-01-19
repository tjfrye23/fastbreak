'use client'

import { useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Events Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your sports events and venues
        </p>
      </div>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Events</AlertTitle>
        <AlertDescription>
          {error.message}
        </AlertDescription>
        <div className="mt-4">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        </div>
      </Alert>
    </div>
  )

}
