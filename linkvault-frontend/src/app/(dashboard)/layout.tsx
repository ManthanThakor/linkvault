"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { CommandPalette } from "@/components/layout/command-palette"
import { useUIStore } from "@/stores/useUIStore"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <CommandPalette />
      <div className={cn(
        "transition-all duration-300",
        "lg:ml-16",
        sidebarOpen && "lg:ml-60"
      )}>
        <Navbar />
        <main className="p-4 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
