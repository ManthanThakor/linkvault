"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedCounter } from "@/components/shared/animated-counter"
import { useDashboardStats, useLinks, useCategories, useTags } from "@/hooks/useApi"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Link2, FolderTree, Tags, MousePointerClick,
  ExternalLink, Clock, TrendingUp, Plus
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: linksData } = useLinks(1, 5)
  const { data: categories } = useCategories()
  const { data: tags } = useTags()

  const summaryCards = [
    { label: "Total Links", value: stats?.totalLinks ?? 0, icon: Link2, color: "from-blue-500/20 to-blue-600/20", iconColor: "text-blue-500" },
    { label: "Total Clicks", value: stats?.totalClicks ?? 0, icon: MousePointerClick, color: "from-emerald-500/20 to-emerald-600/20", iconColor: "text-emerald-500" },
    { label: "Categories", value: stats?.totalCategories ?? categories?.length ?? 0, icon: FolderTree, color: "from-purple-500/20 to-purple-600/20", iconColor: "text-purple-500" },
    { label: "Tags", value: stats?.totalTags ?? tags?.length ?? 0, icon: Tags, color: "from-amber-500/20 to-amber-600/20", iconColor: "text-amber-500" },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your link vault</p>
        </div>
        <Button onClick={() => router.push("/links")} variant="gradient" size="lg">
          <Plus className="w-4 h-4 mr-2" /> Add Link
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <GlassCard key={card.label} delay={i * 0.1}>
            {statsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <AnimatedCounter value={card.value} className="text-2xl font-bold" />
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard delay={0.4} className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" /> Recent Links
            </h2>
            <Button variant="ghost" size="sm" onClick={() => router.push("/links")}>
              View all <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {statsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))
            ) : (stats?.recentLinks ?? []).length > 0 ? (
              stats!.recentLinks!.map((link) => (
                <div key={link.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{link.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{link.clickCount ?? 0} clicks</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No links yet. Add your first link!</p>
            )}
          </div>
        </GlassCard>

        <GlassCard delay={0.5} className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" /> Top Links
            </h2>
          </div>
          <div className="space-y-3">
            {statsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : (stats?.topLinks ?? []).length > 0 ? (
              stats!.topLinks!.map((link, i) => (
                <div key={link.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{link.title}</p>
                    <p className="text-xs text-muted-foreground">{link.clickCount ?? 0} clicks</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No click data yet.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
