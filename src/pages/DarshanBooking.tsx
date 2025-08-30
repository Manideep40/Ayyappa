import { CalendarWithTimePresets } from "@/components/ui/calendar-with-time-presets";
import { useNavigate } from "react-router-dom";
import { bookDarshan } from "@/lib/darshan";
import { toast } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/route-guards";
import { useAuth } from "@/components/auth-provider";

export default function DarshanBookingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const bookedDates: Date[] = [];

  return (
    <RequireAuth>
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-sacred">Book Darshan Ticket</h1>
          <p className="text-muted-foreground mt-2">Choose your preferred date and time slot for darshanam.</p>
        </div>
        <CalendarWithTimePresets
          bookedDates={bookedDates}
          onContinue={async ({ date, time }) => {
            try {
              const id = await bookDarshan(date, time)
              toast.success("Darshan booked successfully")
              try {
                await fetch('/api/send-confirmation', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    email: user?.email,
                    bookingId: id,
                    date: date.toLocaleDateString('en-IN'),
                    time,
                  }),
                })
              } catch {}
              navigate("/bookings")
            } catch (e: any) {
              const msg = String(e?.message || e)
              if (msg.includes('slot_full')) {
                toast.error('Selected slot is full. Please choose another time.')
              } else if (msg.includes('already_booked')) {
                toast.error('You already have a booking for this time.')
              } else if (msg.includes('past_slot')) {
                toast.error('That time is in the past. Please choose a future slot.')
              } else if (msg.includes('invalid_time_format')) {
                toast.error('Invalid time selected. Please try again.')
              } else if (msg.includes('not_authenticated') || msg.includes('JWT')) {
                toast.error('Please login to book a darshan.')
                navigate('/login')
              } else {
                toast.error(`Booking failed: ${msg}`)
                // Optionally log
                console.error(e)
              }
            }
          }}
        />
      </div>
    </section>
    </RequireAuth>
  );
}
