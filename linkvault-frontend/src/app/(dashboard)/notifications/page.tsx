"use client"

import { motion } from "framer-motion"
import { useNotifications, useMarkNotificationRead } from "@/hooks/useApi"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, CheckCheck, Heart, Link2, UserPlus, Shield, AlertCircle, Info } from "lucide-react"

const iconMap: Record<string, any> = { like: Heart, share: Link2, follow: UserPlus, security: Shield, alert: AlertCircle, info: Info }
const borderMap: Record<string, string> = {
  like: "border-rose-500/30", share: "border-blue-500/30", follow: "border-green-500/30",
  security: "border-amber-500/30", alert: "border-red-500/30", info: "border-primary/30",
}

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()
  const { toast } = useToast()

  const handleMarkAllRead = async () => {
    try {
      await Promise.all((notifications ?? []).filter((n: any) => !n.isRead).map((n: any) => markRead.mutateAsync(n.id)))
      toast({ title: "All marked as read", variant: "success" })
    } catch { toast({ title: "Failed to update", variant: "destructive" }) }
  }

  const unreadCount = (notifications ?? []).filter((n: any) => !n.isRead).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-xl text-glow-primary">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with your activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4" /> Mark All Read ({unreadCount})
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : (notifications ?? []).length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {notifications!.map((notif: any) => {
            const Icon = iconMap[notif.type] ?? Bell
            const border = borderMap[notif.type] ?? "border-border"
            return (
              <motion.div key={notif.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.005 }} transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}>
                <Card className={`${!notif.isRead ? border + " bg-primary/[0.02]" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-lg border border-border bg-surface flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notif.isRead ? "" : "font-bold"}`}>{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(notif.createdAt ?? Date.now()).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {!notif.isRead && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5 animate-[neon-pulse_2s_ease-in-out_infinite]" />}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      ) : (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
      )}
    </div>
  )
}
