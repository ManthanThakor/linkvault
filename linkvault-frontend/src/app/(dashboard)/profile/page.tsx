"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useProfile, useUpdateProfile } from "@/hooks/useApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Mail, Calendar, Save, Sparkles } from "lucide-react"

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [saving, setSaving] = useState(false)
  const [initialized, setInitialized] = useState(false)

  if (profile && !initialized) {
    setName(profile.name ?? "")
    setAvatarUrl(profile.avatarUrl ?? "")
    setInitialized(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile.mutateAsync({ name, avatarUrl })
      toast({ title: "Profile updated", variant: "success" })
    } catch (err: any) { toast({ title: "Failed to update", description: err.message, variant: "destructive" })
    } finally { setSaving(false) }
  }

  const initials = profile?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() ?? profile?.email?.[0].toUpperCase() ?? "?"

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="heading-xl text-glow-primary">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information</p>
      </div>

      {isLoading ? (
        <div className="space-y-4"><Skeleton className="h-40 rounded-xl" /><Skeleton className="h-56 rounded-xl" /></div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-5">
                <Avatar className="w-20 h-20 border-2 border-primary/20 shadow-glow-primary">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary font-extrabold">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-extrabold">{name || profile?.email}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {profile?.email}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {new Date(profile?.createdAt ?? Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-5 pb-5">
              <div className="space-y-4">
                <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
                <div className="space-y-2"><Label>Avatar URL</Label><Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." /></div>
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave} disabled={saving} variant="primary"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
