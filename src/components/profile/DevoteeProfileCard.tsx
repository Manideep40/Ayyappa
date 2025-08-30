import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  MapPin,
  Edit3,
  Share2,
  QrCode,
  ChevronDown,
  ChevronUp,
  Flame,
  Gift,
  Calendar as CalendarIcon,
  Star,
  Mountain,
  Camera
} from 'lucide-react'

export type DevoteeStats = {
  pilgrimages: number
  streak: number
  offerings: number
}

export type RecentActivity = {
  id: string
  type: 'pilgrimage' | 'offering' | 'prayer'
  description: string
  date: string
  location?: string
}

export type DevoteeProfileCardProps = {
  isLoading?: boolean
  isEmpty?: boolean
  avatar?: string | null
  name?: string
  devoteeId?: string
  location?: string
  badges?: string[]
  stats?: DevoteeStats
  recentActivities?: RecentActivity[]
  onEdit?: () => void
  onShare?: () => void
  onShowQR?: () => void
  onAvatarSelect?: (file: File) => void
}

const MandalaPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 opacity-5 ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.3" />
      <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.3" />
      <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.3" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.2" transform={`rotate(${i * 45} 50 50)`} />
      ))}
    </svg>
  </div>
)

const ActivityIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'pilgrimage':
      return <Mountain className="w-4 h-4 text-amber-600 dark:text-amber-400" />
    case 'offering':
      return <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
    case 'prayer':
      return <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
    default:
      return <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
  }
}

export const DevoteeProfileCard: React.FC<DevoteeProfileCardProps> = ({
  isLoading = false,
  isEmpty = false,
  avatar,
  name = 'Devotee',
  devoteeId = 'AYY-000000',
  location = '—',
  badges = ['Devotee'],
  stats = { pilgrimages: 0, streak: 0, offerings: 0 },
  recentActivities = [],
  onEdit,
  onShare,
  onShowQR,
  onAvatarSelect,
}) => {
  const [isActivityExpanded, setIsActivityExpanded] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-18" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isEmpty) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Mountain className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Profile Found</h3>
          <p className="text-muted-foreground text-sm">Create your devotee profile to start your spiritual journey.</p>
          <Button className="mt-4 bg-amber-600 hover:bg-amber-700 text-white">Create Profile</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800 relative overflow-hidden" role="region" aria-label={`Profile card for ${name}`}>
      <MandalaPattern className="text-amber-600 dark:text-amber-400" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-amber-300 dark:border-amber-600">
              {avatar ? <AvatarImage src={avatar} alt={`${name}'s avatar`} /> : (
                <AvatarFallback className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 font-semibold">
                  {name.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            {onAvatarSelect && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-amber-600 text-white rounded-full p-1.5 shadow hover:bg-amber-700"
                aria-label="Upload profile photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f && onAvatarSelect) onAvatarSelect(f)
                e.currentTarget.value = ''
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate">{name}</h2>
            <p className="text-sm text-muted-foreground">ID: {devoteeId}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span className="text-xs text-muted-foreground truncate">{location}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {badges.map((badge, index) => (
            <Badge key={index} variant="secondary" className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs">
              {badge}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-amber-700 dark:text-amber-300">{stats.pilgrimages}</div>
            <div className="text-xs text-muted-foreground">Pilgrimages</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-amber-700 dark:text-amber-300">{stats.streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-amber-700 dark:text-amber-300">{stats.offerings}</div>
            <div className="text-xs text-muted-foreground">Offerings</div>
          </div>
        </div>

        <Separator className="bg-amber-200 dark:bg-amber-800" />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 border-amber-300 dark:border-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30" onClick={onEdit} aria-label="Edit profile">
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="border-amber-300 dark:border-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30" onClick={onShare} aria-label="Share profile">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="border-amber-300 dark:border-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30" onClick={onShowQR} aria-label="Show QR code">
            <QrCode className="w-4 h-4" />
          </Button>
        </div>

        <Collapsible open={isActivityExpanded} onOpenChange={setIsActivityExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto hover:bg-amber-100 dark:hover:bg-amber-900/30" aria-expanded={isActivityExpanded} aria-controls="recent-activities">
              <span className="text-sm font-medium">Recent Activity</span>
              {isActivityExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent id="recent-activities" className="space-y-2 mt-2">
            {recentActivities.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-2">No recent activity</div>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 rounded-md bg-amber-50 dark:bg-amber-950/30">
                  <ActivityIcon type={activity.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                      {activity.location && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground truncate">{activity.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

