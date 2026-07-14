"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { linkSchema, type LinkInput } from "@/lib/validations"
import { useCreateLink, useUpdateLink, useCategories, useTags, useCollections } from "@/hooks/useApi"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import type { Link } from "@/types"

interface LinkFormProps {
  link?: Link
  onSuccess: () => void
}

export function LinkForm({ link, onSuccess }: LinkFormProps) {
  const { toast } = useToast()
  const createLink = useCreateLink()
  const updateLink = useUpdateLink()
  const { data: categories } = useCategories()
  const { data: tags } = useTags()
  const { data: collections } = useCollections()
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(link?.tags ?? [])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LinkInput>({
    resolver: zodResolver(linkSchema),
    defaultValues: link ? {
      url: link.originalUrl ?? link.url,
      title: link.title,
      description: link.notes ?? link.description ?? "",
      categoryId: link.categoryId ?? undefined,
      collectionId: undefined,
    } : { url: "", title: "", description: "" },
  })

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId])
  }

  const onSubmit = async (data: LinkInput) => {
    try {
      if (link) {
        await updateLink.mutateAsync({ id: link.id, data: { ...data, tagIds: selectedTagIds } })
        toast({ title: "Link updated", variant: "success" })
      } else {
        await createLink.mutateAsync({ ...data, tagIds: selectedTagIds })
        toast({ title: "Link created", variant: "success" })
      }
      onSuccess()
    } catch (err: any) {
      toast({ title: "Failed to save link", description: err.message, variant: "destructive" })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input id="url" type="url" placeholder="https://example.com" {...register("url")} className={cn(errors.url && "border-destructive")} />
        {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="My Link" {...register("title")} className={cn(errors.title && "border-destructive")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input id="description" placeholder="A brief description" {...register("description")} />
      </div>
      {categories && (
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category (optional)</Label>
          <select id="categoryId" {...register("categoryId")} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      )}
      {collections && (
        <div className="space-y-2">
          <Label htmlFor="collectionId">Collection (optional)</Label>
          <select id="collectionId" {...register("collectionId")} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="">No collection</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>
        </div>
      )}
      {tags && tags.length > 0 && (
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTagIds.includes(tag.id) ? "primary" : "outline"}
                className="cursor-pointer select-none"
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
      <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {isSubmitting ? "Saving..." : link ? "Update Link" : "Create Link"}
      </Button>
    </form>
  )
}
