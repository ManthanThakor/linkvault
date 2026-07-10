"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAdminUsers, useAdminRoles, useAdminAuditLogs, useUpdateUserRole } from "@/hooks/useApi"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Shield, Users, FileText, MoreHorizontal, ChevronDown, Activity } from "lucide-react"

export default function AdminPage() {
  const { data: users, isLoading: usersLoading } = useAdminUsers()
  const { data: roles } = useAdminRoles()
  const { data: auditLogs, isLoading: logsLoading } = useAdminAuditLogs()
  const updateRole = useUpdateUserRole()
  const { toast } = useToast()

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateRole.mutateAsync({ userId, role })
      toast({ title: "Role updated", variant: "success" })
    } catch (err: any) {
      toast({ title: "Failed to update role", description: err.message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="text-muted-foreground mt-1">System administration</p>
      </motion.div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users"><Users className="w-4 h-4 mr-2" /> Users</TabsTrigger>
          <TabsTrigger value="roles"><Shield className="w-4 h-4 mr-2" /> Roles</TabsTrigger>
          <TabsTrigger value="audit"><Activity className="w-4 h-4 mr-2" /> Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <GlassCard>
            {usersLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-24 ml-auto" /></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {users?.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center text-sm font-medium">
                      {user.name?.slice(0, 2).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          {user.role ?? "User"} <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {roles?.map((role) => (
                          <DropdownMenuItem key={role.id} onClick={() => handleRoleChange(user.id, role.name)}>
                            {role.name}
                          </DropdownMenuItem>
                        )) ?? <DropdownMenuItem disabled>No roles</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <GlassCard>
            {!roles || roles.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No roles configured</p>
            ) : (
              <div className="space-y-2">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors">
                    <Shield className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{role.name}</p>
                      <p className="text-xs text-muted-foreground">{role.description ?? "No description"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <GlassCard>
            {logsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : !auditLogs || auditLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No audit logs yet</p>
            ) : (
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{log.action}</p>
                      {log.entityName && <p className="text-xs text-muted-foreground truncate">{log.entityName}</p>}
                    </div>
                    {log.createdAt && <span className="text-[10px] text-muted-foreground flex-shrink-0">{new Date(log.createdAt).toLocaleDateString()}</span>}
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
