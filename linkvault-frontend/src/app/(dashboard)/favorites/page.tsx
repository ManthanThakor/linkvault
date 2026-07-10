"use client"

import { motion } from "framer-motion"
import { useFavorites, useToggleFavorite } from "@/hooks/useApi"
import { GlassCard } from "@/components/shared/glass-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Bookmark, Globe, ExternalLink, Heart, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function FavoritesPage() {
  const { data: favorites, isLoading } = useFavorites()
  const toggleFav = useToggleFavorite()
  const { toast } = useToast()
  const router = useRouter()

  const handleRemove = async (id: string) => {
    try {
      await toggleFav.mutateAsync(id)
      toast({ title: "Removed from favorites", variant: "success" })
    } catch { toast({ title: "Failed to update", variant: "destructive" }) }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Favorites</h1>
        <p className="text-muted-foreground mt-1">Your favorite links at a glance</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <GlassCard key={i}><Skeleton className="h-32" /></GlassCard>
          ))}
        </div>
      ) : (favorites ?? []).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites!.map((link) => (
            <GlassCard key={link.id}>
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{link.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/50">
                  <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs" onClick={() => window.open(link.url, "_blank")}>
                    <ExternalLink className="w-3 h-3 mr-1" /> Open
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleRemove(link.id)}>
                    <Heart className="w-4 h-4 fill-red-500" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <EmptyState icon={Bookmark} title="No favorites" description="Mark links as favorites to see them here" actionLabel="Browse Links" onAction={() => router.push("/links")} />
      )}
    </div>
  )
}
