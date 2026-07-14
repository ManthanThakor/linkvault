"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTags, useCreateTag, useDeleteTag } from "@/hooks/useApi"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Tags, Plus, X } from "lucide-react"

export default function TagsPage() {
  const { data: tags, isLoading } = useTags()
  const createTag = useCreateTag()
  const deleteTag = useDeleteTag()
  const { toast } = useToast()
  const [newName, setNewName] = useState("")

  const handleCreate = async () => {
    if (!newName.trim()) return
    try { await createTag.mutateAsync({ name: newName.trim() }); setNewName(""); toast({ title: "Tag created", variant: "success" })
    } catch (err: any) { toast({ title: "Failed to create", description: err.message, variant: "destructive" }) }
  }

  const handleDelete = async (id: string) => {
    try { await deleteTag.mutateAsync(id); toast({ title: "Tag deleted", variant: "success" })
    } catch { toast({ title: "Failed to delete", variant: "destructive" }) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="heading-xl text-glow-primary">Tags</h1>
        <p className="text-muted-foreground mt-1">Manage your link tags</p>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3 mb-5">
          <Input placeholder="New tag name..." value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreate()} className="max-w-xs" />
          <Button onClick={handleCreate} disabled={!newName.trim()} variant="primary"><Plus className="w-4 h-4" /> Add</Button>
        </div>

        {isLoading ? (
          <div className="flex flex-wrap gap-2">{Array.from({ length: 16 }).map((_, i) => <Skeleton key={i} className="h-8 w-20 rounded-md" />)}</div>
        ) : (tags ?? []).length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
            {tags!.map((tag) => (
              <motion.div key={tag.id} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Badge variant="outline" size="lg" className="group cursor-default hover:border-primary/40 hover:text-foreground transition-all duration-200">
                  {tag.name}
                  <span className="text-[10px] text-muted-foreground font-bold ml-1.5">{tag.linkCount}</span>
                  <button onClick={() => handleDelete(tag.id)} className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState icon={Tags} title="No tags" description="Create tags to label your links." />
        )}
      </Card>
    </div>
  )
}
