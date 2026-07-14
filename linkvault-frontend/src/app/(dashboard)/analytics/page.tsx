"use client"

import { motion } from "framer-motion"
import { useAnalytics as useAnalyticsHook } from "@/hooks/useApi"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, MousePointerClick, ExternalLink, TrendingUp, ArrowUpRight, Calendar, Sparkles } from "lucide-react"

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalyticsHook()
  const totalClicks = data?.clicksByDay?.reduce((sum, d) => sum + d.count, 0) ?? 0
  const topLinks = data?.topLinks ?? []
  const topCategories = data?.topCategories ?? []

  return (
    <div className="space-y-5">
      <div>
        <h1 className="heading-xl text-glow-primary">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your link performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg border border-primary/20 bg-primary/10 flex items-center justify-center">
                <MousePointerClick className="w-4 h-4 text-primary" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-success" />
            </div>
            <div className="text-2xl font-extrabold tracking-tight">
              {isLoading ? <Skeleton className="h-7 w-16 rounded" /> : totalClicks.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground font-semibold mt-0.5">Total Clicks</div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg border border-secondary/20 bg-secondary/10 flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-secondary" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-success" />
            </div>
            <div className="text-2xl font-extrabold tracking-tight">
              {isLoading ? <Skeleton className="h-7 w-16 rounded" /> : topLinks.length}
            </div>
            <div className="text-xs text-muted-foreground font-semibold mt-0.5">Top Links</div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg border border-accent/20 bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-success" />
            </div>
            <div className="text-2xl font-extrabold tracking-tight">
              {isLoading ? <Skeleton className="h-7 w-16 rounded" /> : topCategories.length}
            </div>
            <div className="text-xs text-muted-foreground font-semibold mt-0.5">Categories</div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg border border-success/20 bg-success/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-success" />
              </div>
            </div>
            <div className="text-2xl font-extrabold tracking-tight">
              {isLoading ? <Skeleton className="h-7 w-16 rounded" /> : data?.clicksByDay?.length ?? 0}
            </div>
            <div className="text-xs text-muted-foreground font-semibold mt-0.5">Days Tracked</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Day</CardTitle>
            {data?.clicksByDay && <Badge variant="primary" size="sm">{data.clicksByDay.length} days</Badge>}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-44 rounded-lg" />
            ) : (data?.clicksByDay ?? []).length > 0 ? (
              <div className="flex items-end justify-between h-44 gap-2">
                {data!.clicksByDay!.map((day) => {
                  const maxCount = Math.max(...data!.clicksByDay!.map(d => d.count), 1)
                  const h = Math.max((day.count / maxCount) * 100, 3)
                  const label = new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })
                  return (
                    <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
                      <span className="text-[9px] font-bold text-muted-foreground">{day.count}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full rounded bg-gradient-to-t from-primary to-secondary opacity-80 hover:opacity-100 transition-opacity"
                      />
                      <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-14">No click data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
            <Badge variant="primary" size="sm">{topLinks.length} links</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}</div>
            ) : topLinks.length > 0 ? (
              <div className="space-y-1">
                {topLinks.slice(0, 5).map((link: any, i: number) => (
                  <motion.div
                    key={link.id ?? i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-hover transition-colors"
                  >
                    <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-extrabold ${
                      i === 0 ? "border-amber-500/40 bg-amber-500/10 text-amber-500" :
                      i === 1 ? "border-gray-400/40 bg-gray-400/10 text-gray-400" :
                      i === 2 ? "border-orange-600/40 bg-orange-600/10 text-orange-600" :
                      "border-border bg-surface text-muted-foreground"
                    }`}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{link.title ?? "Untitled"}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{link.originalUrl ?? ""}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold">{link.clickCount ?? 0}</p>
                      <p className="text-[9px] font-bold text-muted-foreground">clicks</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
