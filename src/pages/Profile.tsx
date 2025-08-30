import React from 'react'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/components/auth-provider'
import { RequireAuth } from '@/components/route-guards'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { toast } from '@/components/ui/sonner'
import { DevoteeProfileCard, type DevoteeStats, type RecentActivity } from '@/components/profile/DevoteeProfileCard'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

type ProfileForm = { display_name: string; bio: string; phone?: string; location?: string }

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileInner />
    </RequireAuth>
  )
}

function ProfileInner() {
  const { user } = useAuth()
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [editing, setEditing] = React.useState(false)
  const [qrOpen, setQrOpen] = React.useState(false)
  const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null)

  const form = useForm<ProfileForm>({ defaultValues: { display_name: '', bio: '', phone: '', location: '' } })

  React.useEffect(() => {
    let active = true
    async function load() {
      if (!user) return
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      if (!active) return
      if (error && (error as any).code !== 'PGRST116') {
        console.error(error)
        toast.error(`Load profile failed: ${error.message}`)
      }
      if (data) {
        form.reset({
          display_name: (data as any).display_name ?? '',
          bio: (data as any).bio ?? '',
          phone: (data as any).phone ?? '',
          location: (data as any).location ?? '',
        })
        setAvatarUrl((data as any).avatar_url ?? null)
      }
      setLoading(false)
    }
    void load()
    return () => {
      active = false
    }
  }, [user, form])

  async function onSubmit(values: ProfileForm) {
    if (!user) return
    const basePayload = {
      id: user.id,
      display_name: values.display_name?.trim() || null,
      bio: values.bio?.trim() || null,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    }
    // Attempt to include optional fields if they exist in DB
    const withOptional = {
      ...basePayload,
      ...(values.phone ? { phone: values.phone } : {}),
      ...(values.location ? { location: values.location } : {}),
    }
    let { error } = await supabase
      .from('profiles')
      .upsert(withOptional as any, { onConflict: 'id', ignoreDuplicates: false })
    if (error && (error as any).code === '42703') {
      // Column does not exist; retry with base payload
      const retry = await supabase
        .from('profiles')
        .upsert(basePayload as any, { onConflict: 'id', ignoreDuplicates: false })
      error = retry.error
      if (retry.error) {
        console.error(retry.error)
        toast.error(`Save failed: ${retry.error.message}`)
        return
      } else {
        toast.success('Profile saved (add phone/location columns in DB to store them)')
        setEditing(false)
        return
      }
    }
    if (error) {
      console.error(error)
      toast.error(`Save failed: ${error.message}`)
    } else {
      toast.success('Profile saved')
      setEditing(false)
    }
  }

  async function onAvatarSelect(file: File) {
    if (!user) return
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${user.id}/${Date.now()}.${ext}`
    setUploading(true)
    const { data, error } = await supabase.storage.from('avatars').upload(path, file, {
      contentType: file.type,
      upsert: false,
    })
    if (error) {
      console.error(error)
      toast.error(`Upload failed: ${error.message}`)
      setUploading(false)
      return
    }
    const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(data.path)
    const publicUrl = publicData.publicUrl
    setAvatarUrl(publicUrl)
    setUploading(false)
    toast.success('Photo uploaded')
  }

  const displayName = form.getValues('display_name') || user?.email?.split('@')[0] || 'Devotee'
  const devoteeId = `AYY-${user?.id.slice(0, 6).toUpperCase()}`
  const badges = ['Devotee']
  const stats: DevoteeStats = { pilgrimages: 0, streak: 0, offerings: 0 }
  const recentActivities: RecentActivity[] = []
  const location = form.getValues('location') || '—'

  const shareUrl = React.useMemo(() => {
    if (!user) return ''
    return `${window.location.origin}/u/${user.id}`
  }, [user])

  async function handleShare() {
    if (!shareUrl) return
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Ayyappa Profile', url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied to clipboard')
      }
    } catch (e) {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard')
    }
  }


  return (
    <div className="pt-16">
      <Navbar />
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <DevoteeProfileCard
            isLoading={loading}
            isEmpty={!loading && !user}
            avatar={avatarUrl}
            name={displayName}
            devoteeId={devoteeId}
            location={location}
            badges={badges}
            stats={stats}
            recentActivities={recentActivities}
            onEdit={() => setEditing((v) => !v)}
            onShare={handleShare}
            onShowQR={() => setQrOpen(true)}
            onAvatarSelect={uploading ? undefined : onAvatarSelect}
          />

          {editing && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="display_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>
                        <Label>Email</Label>
                        <Input value={user?.email ?? ''} disabled />
                      </div>
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="Phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="City, State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea rows={4} placeholder="Say something about yourself" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <QrDialog open={qrOpen} onOpenChange={setQrOpen} url={shareUrl} dataUrl={qrDataUrl} setDataUrl={setQrDataUrl} />
    </div>
  )
}

type QrDialogProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  url: string
  dataUrl: string | null
  setDataUrl: (v: string | null) => void
}

function QrDialog({ open, onOpenChange, url, dataUrl, setDataUrl }: QrDialogProps) {
  React.useEffect(() => {
    async function gen() {
      if (!open || !url) return
      const { default: QRCode } = await import('qrcode')
      try {
        const d = await QRCode.toDataURL(url, { width: 256, margin: 1 })
        setDataUrl(d)
      } catch (e) {
        setDataUrl(null)
      }
    }
    void gen()
  }, [open, url, setDataUrl])

  function handleDownload() {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'profile-qr.png'
    a.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3">
          {dataUrl ? (
            <img src={dataUrl} alt="Profile QR" className="w-48 h-48" />
          ) : (
            <div className="w-48 h-48 grid place-items-center text-sm text-muted-foreground">Generating QR…</div>
          )}
          <div className="text-xs break-all text-muted-foreground max-w-sm text-center">{url}</div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => navigator.clipboard.writeText(url)}>Copy Link</Button>
          <Button type="button" onClick={handleDownload}>Download QR</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
