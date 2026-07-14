export interface User {
  id: string
  name: string
  email: string
  role: string
  emailVerified: boolean
  avatarUrl?: string
  createdAt: string
  lastLoginAt?: string
}

export interface AuthResponse {
  userId: string
  name: string
  email: string
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: User
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface Link {
  id: string
  url: string
  originalUrl: string
  shortCode: string
  shortUrl: string
  title: string
  description?: string
  notes?: string
  categoryId?: string
  categoryName?: string
  category?: Category
  hasPassword: boolean
  expiryDate?: string
  isExpired: boolean
  isFavorite: boolean
  clickCount: number
  qrCodeUrl?: string
  tags: string[]
  tagIds?: string[]
  collectionIds?: string[]
  createdAt: string
}

export interface CreateLinkRequest {
  url: string
  originalUrl: string
  customAlias?: string
  title?: string
  notes?: string
  description?: string
  categoryId?: string
  collectionId?: string
  password?: string
  expiryDate?: string
}

export interface UpdateLinkRequest {
  url: string
  originalUrl: string
  title?: string
  notes?: string
  description?: string
  categoryId?: string
  collectionId?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color?: string
  linkCount: number
  createdAt: string
}

export interface Tag {
  id: string
  name: string
  color?: string
  linkCount: number
  createdAt: string
}

export interface Collection {
  id: string
  name: string
  description?: string
  icon?: string
  isPublic?: boolean
  linkCount: number
  createdAt: string
}

export interface LinkStats {
  linkId: string
  totalClicks: number
  uniqueClicks: number
  clicksByDay: { date: string; count: number }[]
  topReferrers: { referer: string; count: number }[]
}

export interface DashboardSummary {
  totalLinks: number
  activeLinks: number
  expiredLinks: number
  favoriteLinks: number
  totalClicks: number
  todayClicks: number
  totalCategories: number
  totalTags: number
  recentLinks: Link[]
  topLinks: Link[]
}

export interface AnalyticsOverview {
  totalClicks: number
  todayClicks: number
  lastClick?: string
  topLinks: LinkAnalytics[]
  mostUsedCategories: CategoryAnalytics[]
  recentlyCreatedLinks: LinkAnalytics[]
  clicksByDay: { date: string; count: number }[]
  topCategories: { name: string; count: number }[]
}

export interface LinkAnalytics {
  id: string
  url: string
  originalUrl: string
  shortCode: string
  title?: string
  clickCount: number
  createdAt: string
}

export interface CategoryAnalytics {
  categoryId: string
  categoryName: string
  linkCount: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "Info" | "Warning" | "Success" | "Error"
  isRead: boolean
  link?: string
  createdAt: string
}

export interface UserSettings {
  theme?: string
  language?: string
  emailNotifications: boolean
  linkExpiryNotifications: boolean
  clickNotifications: boolean
  defaultLinkExpiryDays: number
  defaultShortCodeLength?: string
}

export interface AdminDashboard {
  totalUsers: number
  totalLinks: number
  totalClicks: number
  activeUsersToday: number
  recentAuditLogs: AuditLog[]
}

export interface AuditLog {
  id: string
  userEmail?: string
  action: string
  entityName: string
  entityId?: string
  details?: string
  createdAt: string
}

export interface UserManagement {
  id: string
  name: string
  email: string
  role: string
  emailVerified: boolean
  linkCount: number
  totalClicks: number
  createdAt: string
  lastLoginAt?: string
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions?: string[]
}

export interface PagedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}
