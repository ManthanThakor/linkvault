"use client"

import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Palette, Bell, Shield, LogOut, Sun, Moon, Monitor } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="heading-xl text-glow-primary">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your preferences</p>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg border border-primary/20 bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Palette className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">Theme</h3>
              <p className="text-xs text-muted-foreground mb-3">Appearance</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-primary bg-primary/10 text-primary shadow-glow-primary text-sm font-bold">
                  <Moon className="w-4 h-4" /> Dark (default)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg border border-border bg-surface flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Notifications</h3>
              <p className="text-xs text-muted-foreground mb-3">Manage notification preferences</p>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg border border-border bg-surface flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm">Security</h3>
              <p className="text-xs text-muted-foreground mb-3">Password and authentication</p>
              <Button variant="outline" size="sm" onClick={() => toast({ title: "Coming soon" })}>Change Password</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-lg border border-destructive/30 bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-4 h-4 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-destructive">Danger Zone</h3>
              <p className="text-xs text-muted-foreground mb-3">Delete your account permanently</p>
              <Button variant="destructive" size="sm" onClick={() => {
                if (window.confirm("Are you sure? This cannot be undone.")) toast({ title: "Account deletion coming soon" })
              }}>Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
