"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Link2, Tags, Bookmark,
  BarChart3, Settings
} from "lucide-react"

const mobileItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/links", icon: Link2, label: "Links" },
  { href: "/tags", icon: Tags, label: "Tags" },
  { href: "/favorites", icon: Bookmark, label: "Favs" },
  { href: "/analytics", icon: BarChart3, label: "Stats" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-border/50 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <div className={cn(
                  "relative p-1.5 rounded-lg transition-all duration-200",
                  isActive && "bg-primary/10"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
