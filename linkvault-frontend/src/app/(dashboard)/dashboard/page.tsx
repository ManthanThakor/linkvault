"use client"

import { useDashboardStats, useLinks } from "@/hooks/useApi"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedCounter } from "@/components/shared/animated-counter"
import { TiltCard } from "@/components/shared/tilt-card"
import { Link2, MousePointerClick, TrendingUp, Tags, Globe, ExternalLink, Sparkles } from "lucide-react"

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 22 } } }

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()
  const { data: linksData } = useLinks(1, 5)
  const recentLinks = linksData?.items?.slice(0, 4) ?? []

  const metrics = [
    { label: "Total Links", value: stats?.totalLinks ?? 0, icon: Link2, trend: "+12%", gradient: "from-primary/20 via-primary/10 to-transparent border-primary/20" },
    { label: "Total Clicks", value: stats?.totalClicks ?? 0, icon: MousePointerClick, trend: "+28%", gradient: "from-secondary/20 via-secondary/10 to-transparent border-secondary/20" },
    { label: "Categories", value: stats?.totalCategories ?? 0, icon: TrendingUp, trend: `${stats?.totalCategories ?? 0} active`, gradient: "from-accent/20 via-accent/10 to-transparent border-accent/20" },
    { label: "Tags", value: stats?.totalTags ?? 0, icon: Tags, trend: `${stats?.totalTags ?? 0} total`, gradient: "from-primary/20 via-secondary/10 to-transparent border-primary/20" },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="heading-xl text-glow-primary">Dashboard</h1>
          <p className="text-muted-foreground/70 mt-1.5 text-sm">Your link vault overview</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary/8 border border-primary/20"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="text-xs font-bold text-primary">All systems active</span>
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
          <TiltCard key={metric.label}>
            <Card className="hover:border-primary/30 transition-all duration-300 h-full">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${metric.gradient} border flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-[10px] font-bold text-success tracking-wide"
                  >
                    {metric.trend}
                  </motion.span>
                </div>
                <div className="text-2xl font-extrabold tracking-tight">
                  {isLoading ? <Skeleton className="h-7 w-16 rounded" /> : <AnimatedCounter value={metric.value} />}
                </div>
                <div className="text-xs text-muted-foreground/70 font-semibold mt-0.5">{metric.label}</div>
              </div>
            </Card>
          </TiltCard>
          )
        })}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Links</CardTitle>
            <Badge variant="primary" size="sm">{recentLinks.length} items</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
            ) : recentLinks.length > 0 ? (
              <div className="space-y-1">
                {recentLinks.map((link, i) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-hover/50 transition-all duration-200 hover:border-l-2 hover:border-primary hover:pl-[11px]"
                  >
                    <div className="w-8 h-8 rounded-lg border border-border bg-surface/50 flex items-center justify-center flex-shrink-0 group-hover:border-primary/30 group-hover:shadow-glow-primary transition-all duration-300">
                      <Globe className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{link.title}</p>
                      <p className="text-xs text-muted-foreground/60 truncate mt-0.5">{link.originalUrl}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <span className="text-[10px] font-bold text-muted-foreground/60">{link.clickCount ?? 0} clicks</span>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/60" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground/60 py-8 text-center">No links yet. Add your first link!</p>
            )}
          </CardContent>
        </Card>

        <TiltCard>
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Capacity</span>
                  <span className="text-[10px] font-bold text-muted-foreground/60">--</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-hover/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "35%" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                  />
                </div>
              </div>
              <div className="space-y-3.5 pt-4 border-t border-border">
                {[
                  { label: "Categories", value: stats?.totalCategories ?? 0 },
                  { label: "Tags", value: stats?.totalTags ?? 0 },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-muted-foreground/60 font-semibold">{s.label}</span>
                    <span className="text-sm font-extrabold">
                      {isLoading ? <Skeleton className="h-4 w-8 inline-block rounded" /> : s.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TiltCard>
      </motion.div>
    </motion.div>
  )
}
