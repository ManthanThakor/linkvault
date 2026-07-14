"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/useAuthStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard, Link2, FolderTree, Tags, BookmarkPlus, Heart, BarChart3, User, Settings,
  Bell, LogOut, Menu, X, ChevronDown
} from "lucide-react"

const navLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/links", icon: Link2, label: "Links" },
  { href: "/categories", icon: FolderTree, label: "Categories" },
  { href: "/tags", icon: Tags, label: "Tags" },
  { href: "/collections", icon: BookmarkPlus, label: "Collections" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const initials = user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() ?? user?.email?.[0].toUpperCase() ?? "?"

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "h-12 bg-background/85 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_oklch(0_0_0/0.3)]"
          : "h-14 bg-background/50 backdrop-blur-md border-b border-transparent"
      )}>
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-glow-primary group-hover:animate-[logo-glow_1.5s_ease-in-out_infinite] transition-all duration-300"
              >
                <span className="text-sm font-extrabold text-white drop-shadow-lg">L</span>
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-extrabold text-lg tracking-tight hidden sm:block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
              >
                LinkVault
              </motion.span>
            </Link>

            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map(({ href, icon: Icon, label }) => {
                const active = pathname === href || pathname.startsWith(href + "/")
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2",
                      active
                        ? "text-primary"
                        : "text-muted-foreground/70 hover:text-foreground hover:bg-surface/50"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20 shadow-glow-primary"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className={cn("w-4 h-4 transition-transform duration-200", active ? "" : "group-hover:scale-110")} />
                      {label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/notifications" className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground/70 hover:text-foreground hover:bg-surface/50 transition-all duration-200">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary animate-neon-pulse" />
              </Link>
            </motion.div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 pl-2.5 pr-1.5 py-1.5 rounded-lg hover:bg-surface/50 transition-all duration-200"
                >
                  <Avatar className="w-7 h-7 border border-border ring-1 ring-primary/20">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  {!scrolled && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-semibold hidden sm:block"
                    >
                      {user?.name ?? "User"}
                    </motion.span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/70" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <div className="px-3 py-2.5 border-b border-border">
                  <p className="text-sm font-bold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">{user?.email}</p>
                </div>
                <div className="p-1">
                  <DropdownMenuItem asChild><Link href="/profile"><User className="w-4 h-4" /> Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/settings"><Settings className="w-4 h-4" /> Settings</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive"><LogOut className="w-4 h-4" /> Sign Out</DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface/50 transition-all"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scaleY: 0.95, transformOrigin: "top" }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -12, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-14 left-0 right-0 z-40 bg-surface-elevated/95 backdrop-blur-xl border-b border-border md:hidden"
          >
            <div className="p-3 space-y-1">
              {navLinks.map(({ href, icon: Icon, label }, i) => {
                const active = pathname === href || pathname.startsWith(href + "/")
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all",
                        active ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground/70 hover:text-foreground hover:bg-surface/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
