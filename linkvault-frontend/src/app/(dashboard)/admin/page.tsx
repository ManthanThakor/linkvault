"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAdminUsers, useUpdateUserRole } from "@/hooks/useApi"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, MoreHorizontal, Shield, UserCog, Crown, Ban } from "lucide-react"

export default function AdminPage() {
  const { data: users, isLoading } = useAdminUsers()
  const updateRole = useUpdateUserRole()
  const { toast } = useToast()
  const [search, setSearch] = useState("")

  const filtered = (users ?? []).filter((u: any) =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  )

  const roleConfig: Record<string, { icon: any; color: string; label: string }> = {
    SuperAdmin: { icon: Crown, color: "text-amber-500", label: "Super Admin" },
    Admin: { icon: Shield, color: "text-success", label: "Admin" },
    User: { icon: UserCog, color: "text-muted-foreground", label: "User" },
  }

  const handleRoleChange = async (userId: string, role: string) => {
    try { await updateRole.mutateAsync({ userId, role }); toast({ title: "Role updated", variant: "success" })
    } catch (err: any) { toast({ title: "Failed", description: err.message, variant: "destructive" }) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="heading-xl text-glow-primary">Admin</h1>
        <p className="text-muted-foreground mt-1">Manage users and system settings</p>
      </div>

      <Card>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <span className="text-xs font-bold text-muted-foreground">{users?.length ?? 0} users</span>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1"><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-32 mt-1" /></div>
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {filtered.map((user: any) => {
              const role = roleConfig[user.role] ?? { icon: UserCog, color: "text-muted-foreground", label: user.role }
              const Icon = role.icon
              return (
                <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-surface-hover transition-colors border-b border-border last:border-0 group">
                  <Avatar className="w-10 h-10 border border-border">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="bg-surface text-sm font-bold">
                      {user.name?.[0] ?? user.email?.[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{user.name || "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Badge variant="outline" size="sm" className={role.color}>
                    <Icon className="w-3 h-3 mr-1" /> {role.label}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {Object.entries(roleConfig).filter(([k]) => k !== user.role).map(([key, config]) => {
                        const IC = config.icon
                        return (
                          <DropdownMenuItem key={key} onClick={() => handleRoleChange(user.id, key)}>
                            <IC className="w-4 h-4" /> Set as {config.label}
                          </DropdownMenuItem>
                        )
                      })}
                      <DropdownMenuItem className="text-destructive"><Ban className="w-4 h-4" /> Suspend User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
