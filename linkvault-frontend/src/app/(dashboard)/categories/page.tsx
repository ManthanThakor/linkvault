"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useApi"
import { GlassCard } from "@/components/shared/glass-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { FolderTree, Plus, Edit, Trash2, Palette } from "lucide-react"

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("#6366f1")
  const [saving, setSaving] = useState(false)

  const reset = () => { setName(""); setDescription(""); setColor("#6366f1"); setEditing(null) }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await updateCategory.mutateAsync({ id: editing.id, data: { name, description, color } })
        toast({ title: "Category updated", variant: "success" })
      } else {
        await createCategory.mutateAsync({ name, description, color })
        toast({ title: "Category created", variant: "success" })
      }
      setOpen(false); reset()
    } catch (err: any) {
      toast({ title: "Failed to save", description: err.message, variant: "destructive" })
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id)
      toast({ title: "Category deleted", variant: "success" })
    } catch { toast({ title: "Failed to delete", variant: "destructive" }) }
  }

  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6"]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your links into categories</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); setOpen(o) }}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="lg"><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Category" : "Create Category"}</DialogTitle>
              <DialogDescription>{editing ? "Update category details" : "Add a new category"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-lg transition-transform ${color === c ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
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
      ) : (categories ?? []).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories!.map((cat) => (
            <GlassCard key={cat.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + "20" }}>
                    <FolderTree className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <h3 className="font-medium">{cat.name}</h3>
                    {cat.description && <p className="text-xs text-muted-foreground">{cat.description}</p>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(cat); setName(cat.name); setDescription(cat.description ?? ""); setColor(cat.color ?? colors[0]); setOpen(true) }}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(cat.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <EmptyState icon={FolderTree} title="No categories" description="Create categories to organize your links" actionLabel="Add Category" onAction={() => setOpen(true)} />
      )}
    </div>
  )
}
