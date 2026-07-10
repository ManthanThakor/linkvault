import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type {
  User, Link, Category, Tag, Collection, Bookmark,
  ClickLog, Notification, AuditLog, Role, LinkStats,
  PaginatedResponse
} from "@/types"

export function useLinks(page = 1, pageSize = 20, search?: string) {
  return useQuery({
    queryKey: ["links", page, pageSize, search],
    queryFn: () => api.get<PaginatedResponse<Link>>(`/api/links?page=${page}&pageSize=${pageSize}${search ? `&search=${search}` : ""}`),
  })
}

export function useLink(id: string) {
  return useQuery({
    queryKey: ["link", id],
    queryFn: () => api.get<Link>(`/api/links/${id}`),
    enabled: !!id,
  })
}

export function useCreateLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Link>) => api.post<Link>("/api/links", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["links"] }) },
  })
}

export function useUpdateLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Link> }) => api.put<Link>(`/api/links/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["links"] }) },
  })
}

export function useDeleteLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/links/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["links"] }) },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<Category[]>("/api/categories"),
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Category>) => api.post<Category>("/api/categories", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }) },
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => api.put<Category>(`/api/categories/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }) },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/categories/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }) },
  })
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => api.get<Tag[]>("/api/tags"),
  })
}

export function useCreateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Tag>) => api.post<Tag>("/api/tags", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tags"] }) },
  })
}

export function useUpdateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tag> }) => api.put<Tag>(`/api/tags/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tags"] }) },
  })
}

export function useDeleteTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/tags/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tags"] }) },
  })
}

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: () => api.get<Collection[]>("/api/collections"),
  })
}

export function useCreateCollection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Collection>) => api.post<Collection>("/api/collections", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["collections"] }) },
  })
}

export function useUpdateCollection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Collection> }) => api.put<Collection>(`/api/collections/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["collections"] }) },
  })
}

export function useDeleteCollection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/collections/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["collections"] }) },
  })
}

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => api.get<Link[]>("/api/links/favorites"),
  })
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.post(`/api/links/${id}/favorite`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["favorites"] }); qc.invalidateQueries({ queryKey: ["links"] }) },
  })
}

export function useBookmarks() {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => api.get<Bookmark[]>("/api/bookmarks"),
  })
}

export function useCreateBookmark() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Bookmark>) => api.post<Bookmark>("/api/bookmarks", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["bookmarks"] }) },
  })
}

export function useDeleteBookmark() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/bookmarks/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["bookmarks"] }) },
  })
}

export function useLinkStats(id: string) {
  return useQuery({
    queryKey: ["link-stats", id],
    queryFn: () => api.get<LinkStats>(`/api/links/${id}/stats`),
    enabled: !!id,
  })
}

export function useClickLogs(linkId: string) {
  return useQuery({
    queryKey: ["click-logs", linkId],
    queryFn: () => api.get<ClickLog[]>(`/api/links/${linkId}/clicks`),
    enabled: !!linkId,
  })
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get<Notification[]>("/api/notifications"),
  })
}

export function useMarkNotificationRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.post(`/api/notifications/${id}/read`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["notifications"] }) },
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get<{
      totalLinks: number; totalClicks: number; totalCategories: number;
      totalTags: number; recentLinks: Link[]; topLinks: Link[]
    }>("/api/dashboard/stats"),
  })
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: () => api.get<{
      clicksByDay: { date: string; count: number }[];
      topLinks: Link[]; topCategories: { name: string; count: number }[];
    }>("/api/analytics"),
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get<User[]>("/api/admin/users"),
  })
}

export function useAdminRoles() {
  return useQuery({
    queryKey: ["admin-roles"],
    queryFn: () => api.get<Role[]>("/api/admin/roles"),
  })
}

export function useAdminAuditLogs() {
  return useQuery({
    queryKey: ["admin-audit-logs"],
    queryFn: () => api.get<AuditLog[]>("/api/admin/audit-logs"),
  })
}

export function useUpdateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => api.put(`/api/admin/users/${userId}/role`, { role }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }) },
  })
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get<User>("/api/profile"),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<User>) => api.put<User>("/api/profile", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profile"] }) },
  })
}
