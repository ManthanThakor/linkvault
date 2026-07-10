"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useProfile, useUpdateProfile } from "@/hooks/useApi"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Sun, Moon, Monitor, Settings as SettingsIcon, User, Bell, Palette, Shield } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSaveProfile = async () => {
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
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences</p>
      </motion.div>

      <GlassCard>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /> Profile</h2>
        {isLoading ? (
          <div className="space-y-3"><Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10 w-24" /></div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.email ?? ""} disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name || profile?.name || ""} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <Button onClick={handleSaveProfile} disabled={saving || !name.trim()} variant="gradient">{saving ? "Saving..." : "Save"}</Button>
          </div>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Palette className="w-4 h-4 text-muted-foreground" /> Appearance</h2>
        <div className="space-y-4">
          <Label>Theme</Label>
          <div className="flex gap-3">
            {[
              { value: "light", icon: Sun, label: "Light" },
              { value: "dark", icon: Moon, label: "Dark" },
              { value: "system", icon: Monitor, label: "System" },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  theme === value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-muted-foreground" /> Notifications</h2>
        <div className="space-y-4">
          {["Email notifications", "Push notifications", "Weekly digest"].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm">{item}</span>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-muted-foreground" /> Security</h2>
        <Button variant="outline">Change Password</Button>
      </GlassCard>
    </div>
  )
}
