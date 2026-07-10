"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useProfile, useUpdateProfile } from "@/hooks/useApi"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Mail, Calendar, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      await updateProfile.mutateAsync({ name })
      toast({ title: "Profile updated", variant: "success" })
    } catch (err: any) {
      toast({ title: "Failed to update", description: err.message, variant: "destructive" })
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your public profile</p>
      </motion.div>

      {isLoading ? (
        <GlassCard><Skeleton className="h-48" /></GlassCard>
      ) : (
        <>
          <GlassCard>
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-2xl">
                  {profile?.name?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{profile?.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {profile?.email}</p>
                {profile?.createdAt && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" /> Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /> Edit Profile</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input value={name || profile?.name || ""} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <Button onClick={handleSave} disabled={saving || !name.trim()} variant="gradient">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  )
}
