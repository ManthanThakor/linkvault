"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { linkSchema, type LinkInput } from "@/lib/validations"
import { useCreateLink, useUpdateLink, useCategories, useTags } from "@/hooks/useApi"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LinkInput>({
    resolver: zodResolver(linkSchema),
    defaultValues: link ? {
      url: link.url,
      title: link.title,
      description: link.description ?? "",
      categoryId: link.categoryId ?? undefined,
    } : { url: "", title: "", description: "" },
  })

  const onSubmit = async (data: LinkInput) => {
    try {
      if (link) {
        await updateLink.mutateAsync({ id: link.id, data })
        toast({ title: "Link updated", variant: "success" })
      } else {
        await createLink.mutateAsync(data)
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
      <Button type="submit" disabled={isSubmitting} variant="gradient" className="w-full">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {isSubmitting ? "Saving..." : link ? "Update Link" : "Create Link"}
      </Button>
    </form>
  )
}
