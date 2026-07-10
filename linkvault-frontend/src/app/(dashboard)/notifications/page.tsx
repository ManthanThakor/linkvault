"use client"

import { motion } from "framer-motion"
import { useNotifications, useMarkNotificationRead } from "@/hooks/useApi"
import { GlassCard } from "@/components/shared/glass-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()
  const { toast } = useToast()

  const handleMarkRead = async (id: string) => {
    try {
      await markRead.mutateAsync(id)
    } catch { toast({ title: "Failed to mark as read", variant: "destructive" }) }
  }

  const getIcon = (type?: string) => {
    switch (type) {
      case "Warning": return AlertTriangle
      case "Error": return AlertTriangle
      case "Success": return CheckCircle2
      default: return Info
    }
  }

  const getColor = (type?: string) => {
    switch (type) {
      case "Warning": return "text-amber-500 bg-amber-500/20"
      case "Error": return "text-destructive bg-destructive/20"
      case "Success": return "text-emerald-500 bg-emerald-500/20"
      default: return "text-primary bg-primary/10"
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with your activity</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <GlassCard key={i}><Skeleton className="h-16" /></GlassCard>
          ))}
        </div>
      ) : (notifications ?? []).length > 0 ? (
        <div className="space-y-3">
          {notifications!.map((notif) => {
            const Icon = getIcon(notif.type)
            return (
              <motion.div key={notif.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <GlassCard hover={false} className={notif.isRead ? "opacity-60" : ""}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${getColor(notif.type)} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {notif.title && <p className="text-sm font-medium">{notif.title}</p>}
                      {notif.message && <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>}
                      {notif.createdAt && <p className="text-[10px] text-muted-foreground mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>}
                    </div>
                    {!notif.isRead && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMarkRead(notif.id)}>
                        <CheckCheck className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <EmptyState icon={Bell} title="All clear!" description="You have no notifications" />
      )}
    </div>
  )
}
