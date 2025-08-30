import { supabase } from '@/lib/supabase'

function formatDateLocal(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export async function bookDarshan(date: Date, time: string) {
  const localDate = formatDateLocal(date)
  const { data, error } = await supabase.rpc('book_darshan', {
    p_date: localDate,
    p_time: time,
  })
  if (error) throw error
  return data as string // booking id
}

export async function getFullTimes(date: Date) {
  const localDate = formatDateLocal(date)
  const { data, error } = await supabase.rpc('darshan_full_times', {
    p_date: localDate,
  })
  if (error) throw error
  return (data as { time_slot: string }[]).map((r) => r.time_slot)
}

export async function myBookings() {
  const { data, error } = await supabase
    .from('darshan_bookings')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
