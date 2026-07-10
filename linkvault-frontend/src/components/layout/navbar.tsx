"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/useAuthStore"
import { useUIStore } from "@/stores/useUIStore"
import { clearTokens } from "@/lib/api"
import { useRouter } from "next/navigation"
import {
  Search, Sun, Moon, Monitor, Menu, Command, Bell,
  User, LogOut, Settings
} from "lucide-react"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuthStore()
  const { toggleSidebar, setCommandPaletteOpen } = useUIStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useState(() => setMounted(true))

  const handleLogout = () => {
    logout()
    clearTokens()
    router.push("/auth/login")
  }

  return (
    <header className="glass-nav sticky top-0 z-30 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>

          <Button
            variant="glass"
            size="sm"
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden md:flex items-center gap-2 text-muted-foreground w-64 justify-between"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Search links...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-1 rounded-md border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium">
              <Command className="w-3 h-3" />K
            </kbd>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {theme === "dark" ? <Moon className="w-4 h-4" /> :
                   theme === "light" ? <Sun className="w-4 h-4" /> :
                   <Monitor className="w-4 h-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="w-4 h-4 mr-2" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="w-4 h-4 mr-2" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="w-4 h-4 mr-2" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user?.name?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.name?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="w-4 h-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
