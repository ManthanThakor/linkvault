"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useLinks, useDeleteLink, useToggleFavorite } from "@/hooks/useApi"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { LinkForm } from "./link-form"
import { Search, Link2, MoreHorizontal, ExternalLink, Heart, Trash2, Edit, Plus, Globe, Copy, Sparkles } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5253"
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }
const itemAnim = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

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
    try { await deleteLink.mutateAsync(id); toast({ title: "Link deleted", variant: "success" }) }
    catch { toast({ title: "Failed to delete", variant: "destructive" }) }
  }

  const handleToggleFav = async (id: string) => {
    try { await toggleFav.mutateAsync(id) } catch { toast({ title: "Failed to update", variant: "destructive" }) }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={itemAnim} className="flex items-center justify-between">
        <div>
          <h1 className="heading-xl text-glow-primary">Links</h1>
          <p className="text-muted-foreground mt-1">Manage all your saved links</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="primary" size="lg"><Plus className="w-4 h-4" /> Add Link</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Link</DialogTitle>
              <DialogDescription>Add a new link to your vault</DialogDescription>
            </DialogHeader>
            <LinkForm onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={itemAnim}>
        <Card>
          <div className="p-4 border-b border-border">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search links..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="pl-9" />
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
          ) : (data?.items ?? []).length > 0 ? (
            <motion.div variants={container} initial="hidden" animate="show">
              {(data?.items ?? []).map((link) => (
                <motion.div key={link.id} variants={itemAnim}
                  className="group flex items-center gap-4 px-4 py-3 hover:bg-surface-hover transition-all duration-200 border-b border-border last:border-0">
                  <button onClick={() => handleToggleFav(link.id)} className="flex-shrink-0">
                    <Heart className={`w-4 h-4 transition-all duration-200 ${link.isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground hover:text-destructive"}`} />
                  </button>
                  <div className="w-9 h-9 rounded-lg border border-border bg-surface flex items-center justify-center flex-shrink-0 group-hover:border-primary/30 group-hover:shadow-glow-primary transition-all duration-200">
                    <Globe className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold truncate">{link.title}</p>
                      {link.categoryName && <Badge variant="outline" size="sm">{link.categoryName}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{link.originalUrl}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleToggleFav(link.id)}>
                      <Heart className={`w-3.5 h-3.5 ${link.isFavorite ? "fill-destructive text-destructive" : ""}`} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(link.originalUrl, "_blank")}><ExternalLink className="w-4 h-4" /> Open</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(`${API_BASE}${link.shortUrl}`); toast({ title: "Copied!" }) }}><Copy className="w-4 h-4" /> Copy Short Link</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingLink(link)}><Edit className="w-4 h-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(link.id)}><Trash2 className="w-4 h-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState icon={Link2} title="No links yet" description="Add your first link to start building your vault" actionLabel="Add Link" onAction={() => setCreateOpen(true)} />
          )}

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span className="text-xs font-bold text-muted-foreground">Page {page} of {data.totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </Card>
      </motion.div>

      <Dialog open={!!editingLink} onOpenChange={(open) => { if (!open) setEditingLink(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>Update your link details</DialogDescription>
          </DialogHeader>
          {editingLink && <LinkForm link={editingLink} onSuccess={() => setEditingLink(null)} />}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
