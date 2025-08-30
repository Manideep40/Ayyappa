import React from 'react'
import Navbar from '@/components/Navbar'
import { RequireAuth } from '@/components/route-guards'
import { myBookings } from '@/lib/darshan'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

type Booking = {
  id: string
  booking_date: string
  time_slot: string
  status: string
  created_at: string
}

export default function BookingsPage() {
  return (
    <RequireAuth>
      <BookingsInner />
    </RequireAuth>
  )
}

function BookingsInner() {
  const [loading, setLoading] = React.useState(true)
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await myBookings()
        if (!active) return
        setBookings(data as Booking[])
      } catch (e: any) {
        setError(e?.message || 'Failed to load bookings')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [])

  return (
    <div className="pt-16">
      <Navbar />
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Darshan Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : error ? (
                <div className="text-destructive text-sm">{error}</div>
              ) : bookings.length === 0 ? (
                <div className="text-sm text-muted-foreground">No bookings yet. Book your first darshan!</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Booked At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>{new Date(b.booking_date).toLocaleDateString()}</TableCell>
                        <TableCell>{b.time_slot}</TableCell>
                        <TableCell className={b.status === 'confirmed' ? 'text-green-600' : 'text-muted-foreground'}>
                          {b.status}
                        </TableCell>
                        <TableCell>{new Date(b.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>Contact the temple trust for any changes.</TableCaption>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

