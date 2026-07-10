"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useCollections, useCreateCollection, useUpdateCollection, useDeleteCollection } from "@/hooks/useApi"
import { GlassCard } from "@/components/shared/glass-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Layers, Plus, Edit, Trash2, Globe, Lock } from "lucide-react"

export default function CollectionsPage() {
  const { data: collections, isLoading } = useCollections()
  const createCollection = useCreateCollection()
  const updateCollection = useUpdateCollection()
  const deleteCollection = useDeleteCollection()
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
      if (editing) {
        await updateCollection.mutateAsync({ id: editing.id, data: { name, description, isPublic } })
        toast({ title: "Collection updated", variant: "success" })
      } else {
        await createCollection.mutateAsync({ name, description, isPublic })
        toast({ title: "Collection created", variant: "success" })
      }
      setOpen(false); reset()
    } catch (err: any) {
      toast({ title: "Failed to save", description: err.message, variant: "destructive" })
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCollection.mutateAsync(id)
      toast({ title: "Collection deleted", variant: "success" })
    } catch { toast({ title: "Failed to delete", variant: "destructive" }) }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground mt-1">Group links into collections</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); setOpen(o) }}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="lg"><Plus className="w-4 h-4 mr-2" /> Add Collection</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Collection" : "Create Collection"}</DialogTitle>
              <DialogDescription>{editing ? "Update collection details" : "Create a new collection"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Collection name" />
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
              </div>
              <div className="flex items-center justify-between">
                <Label>Public collection</Label>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
              <Button onClick={handleSave} disabled={saving || !name.trim()} variant="gradient" className="w-full">
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <GlassCard key={i}><Skeleton className="h-24" /></GlassCard>
          ))}
        </div>
      ) : (collections ?? []).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections!.map((col) => (
            <GlassCard key={col.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                    {col.isPublic ? <Globe className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <h3 className="font-medium">{col.name}</h3>
                    {col.description && <p className="text-xs text-muted-foreground">{col.description}</p>}
                    <span className="text-[10px] text-muted-foreground">{col.isPublic ? "Public" : "Private"}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(col); setName(col.name); setDescription(col.description ?? ""); setIsPublic(col.isPublic ?? false); setOpen(true) }}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(col.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <EmptyState icon={Layers} title="No collections" description="Create collections to group related links" actionLabel="Add Collection" onAction={() => setOpen(true)} />
      )}
    </div>
  )
}
