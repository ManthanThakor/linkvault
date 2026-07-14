"use client"

import { motion } from "framer-motion"
import { useLinks, useToggleFavorite, useDeleteLink } from "@/hooks/useApi"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, Globe, Trash2, Copy } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5253"

export default function FavoritesPage() {
  const { data, isLoading } = useLinks(1, 999)
  const toggleFav = useToggleFavorite()
  const deleteLink = useDeleteLink()
  const { toast } = useToast()
  const favorites = (data?.items ?? []).filter((l) => l.isFavorite)

  const handleToggleFav = async (id: string) => {
    try { await toggleFav.mutateAsync(id) } catch { toast({ title: "Failed to update", variant: "destructive" }) }
  }

  const handleDelete = async (id: string) => {
    try { await deleteLink.mutateAsync(id); toast({ title: "Deleted", variant: "success" }) }
    catch { toast({ title: "Failed to delete", variant: "destructive" }) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="heading-xl text-glow-primary">Favorites</h1>
        <p className="text-muted-foreground mt-1">Your bookmarked links</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : favorites.length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {favorites.map((link) => (
            <motion.div key={link.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleToggleFav(link.id)}>
                      <Heart className="w-5 h-5 fill-destructive text-destructive hover:scale-110 transition-transform" />
                    </button>
                    <div className="w-9 h-9 rounded-lg border border-border bg-surface flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{link.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.originalUrl}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => { navigator.clipboard.writeText(`${API_BASE}${link.shortUrl}`); toast({ title: "Copied!" }) }}>
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => handleDelete(link.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState icon={Heart} title="No favorites yet" description="Click the heart icon on any link to add it here" />
      )}
    </div>
  )
}
