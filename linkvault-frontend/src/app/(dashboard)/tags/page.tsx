"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from "@/hooks/useApi"
import { GlassCard } from "@/components/shared/glass-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Tags, Plus, Trash2, X, Check } from "lucide-react"

export default function TagsPage() {
  const { data: tags, isLoading } = useTags()
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()
  const { toast } = useToast()
  const [newTagName, setNewTagName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const handleCreate = async () => {
    if (!newTagName.trim()) return
    try {
      await createTag.mutateAsync({ name: newTagName.trim() })
      setNewTagName("")
      toast({ title: "Tag created", variant: "success" })
    } catch (err: any) {
      toast({ title: "Failed to create", description: err.message, variant: "destructive" })
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return
    try {
      await updateTag.mutateAsync({ id, data: { name: editingName.trim() } })
      setEditingId(null)
      toast({ title: "Tag updated", variant: "success" })
    } catch (err: any) {
      toast({ title: "Failed to update", description: err.message, variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTag.mutateAsync(id)
      toast({ title: "Tag deleted", variant: "success" })
    } catch { toast({ title: "Failed to delete", variant: "destructive" }) }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Tags</h1>
        <p className="text-muted-foreground mt-1">Manage your link tags</p>
      </motion.div>

      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <Input
            placeholder="New tag name..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="max-w-xs"
          />
          <Button onClick={handleCreate} disabled={!newTagName.trim()} variant="gradient" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        ) : (tags ?? []).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags!.map((tag) => (
              <motion.div
                key={tag.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative"
              >
                {editingId === tag.id ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUpdate(tag.id)}
                      className="h-8 w-28 text-sm"
                      autoFocus
                    />
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdate(tag.id)}>
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingId(null)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-sm px-3 py-1.5 cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => { setEditingId(tag.id); setEditingName(tag.name) }}
                  >
                    {tag.name}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(tag.id) }}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Tags} title="No tags" description="Create tags to label your links" />
        )}
      </GlassCard>
    </div>
  )
}
