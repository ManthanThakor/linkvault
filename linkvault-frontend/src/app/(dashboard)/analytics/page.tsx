"use client"

import { motion } from "framer-motion"
import { useAnalytics, useDashboardStats } from "@/hooks/useApi"
import { GlassCard } from "@/components/shared/glass-card"
import { AnimatedCounter } from "@/components/shared/animated-counter"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"
import { BarChart3, MousePointerClick, Link2, TrendingUp } from "lucide-react"

const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false })
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false })
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false })

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e"]

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useAnalytics()
  const { data: stats } = useDashboardStats()

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your link performance</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard delay={0.1}>
          {isLoading ? <Skeleton className="h-16" /> : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Links</p>
                <AnimatedCounter value={stats?.totalLinks ?? 0} className="text-xl font-bold" />
              </div>
            </div>
          )}
        </GlassCard>
        <GlassCard delay={0.2}>
          {isLoading ? <Skeleton className="h-16" /> : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <MousePointerClick className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Clicks</p>
                <AnimatedCounter value={stats?.totalClicks ?? 0} className="text-xl font-bold" />
              </div>
            </div>
          )}
        </GlassCard>
        <GlassCard delay={0.3}>
          {isLoading ? <Skeleton className="h-16" /> : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Categories</p>
                <AnimatedCounter value={stats?.totalCategories ?? 0} className="text-xl font-bold" />
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard delay={0.4}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" /> Clicks by Day
          </h2>
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (analytics?.clicksByDay ?? []).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics!.clicksByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">No click data yet</div>
          )}
        </GlassCard>

        <GlassCard delay={0.5}>
          <h2 className="text-lg font-semibold mb-4">Top Categories</h2>
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (analytics?.topCategories ?? []).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics!.topCategories}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  label={({ name, percent }: any) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {analytics!.topCategories.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">No category data yet</div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
