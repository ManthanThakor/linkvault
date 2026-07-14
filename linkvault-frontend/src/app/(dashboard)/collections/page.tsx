"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useCollections, useCreateCollection, useUpdateCollection, useDeleteCollection } from "@/hooks/useApi"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { BookmarkPlus, Plus, Edit, Trash2, Lock, Globe } from "lucide-react"

export default function CollectionsPage() {
  const { data: collections, isLoading } = useCollections()
  const createCol = useCreateCollection()
  const updateCol = useUpdateCollection()
  const deleteCol = useDeleteCollection()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)

  const reset = () => { setName(""); setDescription(""); setIsPublic(false); setEditing(null) }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      if (editing) { await updateCol.mutateAsync({ id: editing.id, data: { name, description, isPublic } }); toast({ title: "Collection updated", variant: "success" }) }
      else { await createCol.mutateAsync({ name, description, isPublic }); toast({ title: "Collection created", variant: "success" }) }
      setOpen(false); reset()
    } catch (err: any) { toast({ title: "Failed to save", description: err.message, variant: "destructive" })
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    try { await deleteCol.mutateAsync(id); toast({ title: "Collection deleted", variant: "success" }) }
    catch { toast({ title: "Failed to delete", variant: "destructive" }) }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-xl text-glow-primary">Collections</h1>
          <p className="text-muted-foreground mt-1">Group your links into themed collections</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); setOpen(o) }}>
          <DialogTrigger asChild>
            <Button variant="primary"><Plus className="w-4 h-4" /> New Collection</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Collection" : "Create Collection"}</DialogTitle>
              <DialogDescription>{editing ? "Update collection details" : "Create a new link collection"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
              <div className="flex items-center justify-between">
                <div><Label className="text-sm">Public Collection</Label><p className="text-xs text-muted-foreground">Anyone with the link can view</p></div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
              <Button onClick={handleSave} disabled={saving || !name.trim()} variant="primary" className="w-full">
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : (collections ?? []).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {collections!.map((col) => (
            <motion.div key={col.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="group">
              <Card className="hover:scale-[1.02] transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center ${
                        col.isPublic ? "border-primary/30 bg-primary/10 text-primary" : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                      }`}>
                        {col.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">{col.name}</p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            col.isPublic ? "bg-primary/15 text-primary" : "bg-amber-500/15 text-amber-500"
                          }`}>{col.isPublic ? "Public" : "Private"}</span>
                        </div>
                        {col.description && <p className="text-xs text-muted-foreground mt-0.5">{col.description}</p>}
                        <p className="text-[10px] font-bold text-muted-foreground mt-0.5">{col.linkCount ?? 0} links</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(col); setName(col.name); setDescription(col.description ?? ""); setIsPublic(col.isPublic ?? false); setOpen(true) }}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => handleDelete(col.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={BookmarkPlus} title="No collections" description="Create your first collection to group links" actionLabel="New Collection" onAction={() => setOpen(true)} />
      )}
    </div>
  )
}
