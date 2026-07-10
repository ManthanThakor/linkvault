"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLinks, useDeleteLink, useToggleFavorite, useCategories, useTags } from "@/hooks/useApi"
import { GlassCard } from "@/components/shared/glass-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { LinkForm } from "./link-form"
import { Search, Link2, MoreHorizontal, ExternalLink, Heart, Trash2, Edit, Plus, Globe } from "lucide-react"

export default function LinksPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [editingLink, setEditingLink] = useState<any>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const { data, isLoading } = useLinks(page, 20, search)
  const deleteLink = useDeleteLink()
  const toggleFav = useToggleFavorite()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      await deleteLink.mutateAsync(id)
      toast({ title: "Link deleted", variant: "success" })
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" })
    }
  }

  const handleToggleFav = async (id: string) => {
    try {
      await toggleFav.mutateAsync(id)
    } catch {
      toast({ title: "Failed to update", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Links</h1>
          <p className="text-muted-foreground mt-1">Manage all your saved links</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="lg"><Plus className="w-4 h-4 mr-2" /> Add Link</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Link</DialogTitle>
              <DialogDescription>Add a new link to your vault</DialogDescription>
            </DialogHeader>
            <LinkForm onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search links..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : (data?.items ?? []).length > 0 ? (
          <div className="space-y-2">
            {data!.items.map((link, i) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{link.title}</p>
                    {link.isFavorite && <Heart className="w-3 h-3 fill-red-500 text-red-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {link.category && <Badge variant="outline" className="text-[10px]">{link.category.name}</Badge>}
                    <span className="text-[10px] text-muted-foreground">{link.clickCount ?? 0} clicks</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleFav(link.id)}>
                    <Heart className={`w-4 h-4 ${link.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(link.url, "_blank")}>
                        <ExternalLink className="w-4 h-4 mr-2" /> Open
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setEditingLink(link); setCreateOpen(true) }}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(link.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Link2}
            title="No links yet"
            description="Add your first link to start building your vault"
            actionLabel="Add Link"
            onAction={() => setCreateOpen(true)}
          />
        )}

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {data.totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}
      </GlassCard>

      <Dialog open={!!editingLink && !createOpen} onOpenChange={(open) => { if (!open) setEditingLink(null); setCreateOpen(open) }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>Update your link details</DialogDescription>
          </DialogHeader>
          {editingLink && <LinkForm link={editingLink} onSuccess={() => { setEditingLink(null); setCreateOpen(false) }} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
