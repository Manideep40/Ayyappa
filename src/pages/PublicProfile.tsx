import React from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'
import { DevoteeProfileCard, type DevoteeStats, type RecentActivity } from '@/components/profile/DevoteeProfileCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PublicProfilePage() {
  const { id } = useParams()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [profile, setProfile] = React.useState<any | null>(null)

  React.useEffect(() => {
    let active = true
    async function load() {
      if (!id) return
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (!active) return
      if (error) {
        setError(error.message)
      } else {
        setProfile(data)
      }
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [id])

  const stats: DevoteeStats = { pilgrimages: 0, streak: 0, offerings: 0 }
  const activities: RecentActivity[] = []

  return (
    <div className="pt-16">
      <Navbar />
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {error ? (
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          ) : (
            <DevoteeProfileCard
              isLoading={loading}
              isEmpty={!loading && !profile}
              avatar={profile?.avatar_url ?? null}
              name={profile?.display_name || 'Devotee'}
              devoteeId={`AYY-${String(id ?? '').slice(0, 6).toUpperCase()}`}
              location={profile?.location || '—'}
              badges={['Devotee']}
              stats={stats}
              recentActivities={activities}
            />
          )}
        </div>
      </section>
    </div>
  )
}

