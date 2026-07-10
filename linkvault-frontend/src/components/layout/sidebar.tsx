"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/stores/useUIStore"
import {
  LayoutDashboard, Link2, FolderTree, Tags, Bookmark,
  Layers, BarChart3, Settings, Bell, Shield,
  ChevronLeft, LinkIcon, Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/links", label: "Links", icon: Link2 },
  { href: "/categories", label: "Categories", icon: FolderTree },
  { href: "/tags", label: "Tags", icon: Tags },
  { href: "/collections", label: "Collections", icon: Layers },
  { href: "/favorites", label: "Favorites", icon: Bookmark },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/admin", label: "Admin", icon: Shield },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="glass-sidebar fixed left-0 top-0 z-40 h-screen hidden lg:flex flex-col"
      >
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-border/50",
          !sidebarOpen && "justify-center px-2"
        )}>
          {sidebarOpen ? (
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <LinkIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                LinkVault
              </span>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <LinkIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className={cn("flex flex-col gap-1", sidebarOpen ? "px-3" : "px-2")}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                      !sidebarOpen && "justify-center px-2"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl bg-primary/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <item.icon className="w-5 h-5 relative z-10" />
                    {sidebarOpen && <span className="relative z-10">{item.label}</span>}
                  </motion.div>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        <div className={cn("p-4 border-t border-border/50", !sidebarOpen && "px-2")}>
          <Button
            variant="ghost"
            size={sidebarOpen ? "default" : "icon"}
            onClick={toggleSidebar}
            className="w-full"
          >
            <ChevronLeft className={cn(
              "w-5 h-5 transition-transform duration-300",
              !sidebarOpen && "rotate-180"
            )} />
            {sidebarOpen && <span>Collapse</span>}
          </Button>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
