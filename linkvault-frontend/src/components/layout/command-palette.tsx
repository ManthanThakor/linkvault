"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useUIStore } from "@/stores/useUIStore"
import { Search, Command } from "lucide-react"
import { cn } from "@/lib/utils"

const commands = [
  { id: "dashboard", label: "Go to Dashboard", href: "/dashboard" },
  { id: "links", label: "Go to Links", href: "/links" },
  { id: "categories", label: "Go to Categories", href: "/categories" },
  { id: "tags", label: "Go to Tags", href: "/tags" },
  { id: "collections", label: "Go to Collections", href: "/collections" },
  { id: "favorites", label: "Go to Favorites", href: "/favorites" },
  { id: "analytics", label: "Go to Analytics", href: "/analytics" },
  { id: "settings", label: "Go to Settings", href: "/settings" },
  { id: "admin", label: "Go to Admin", href: "/admin" },
  { id: "profile", label: "Go to Profile", href: "/profile" },
]

export function CommandPalette() {
  const router = useRouter()
  const {
    commandPaletteOpen, setCommandPaletteOpen,
    commandSearch, setCommandSearch,
    commandIndex, setCommandIndex,
  } = useUIStore()

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(commandSearch.toLowerCase())
  )

  useEffect(() => {
    if (!commandPaletteOpen) {
      setCommandSearch("")
      setCommandIndex(0)
    }
  }, [commandPaletteOpen, setCommandSearch, setCommandIndex])

  const executeCommand = useCallback((cmd: typeof commands[0]) => {
    setCommandPaletteOpen(false)
    router.push(cmd.href)
  }, [router, setCommandPaletteOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
        return
      }
      if (!commandPaletteOpen) return
      if (e.key === "Escape") { setCommandPaletteOpen(false); return }
      if (e.key === "ArrowDown") { e.preventDefault(); setCommandIndex((prev) => Math.min(prev + 1, filtered.length - 1)); return }
      if (e.key === "ArrowUp") { e.preventDefault(); setCommandIndex((prev) => Math.max(prev - 1, 0)); return }
      if (e.key === "Enter" && filtered[commandIndex]) { executeCommand(filtered[commandIndex]); return }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [commandPaletteOpen, setCommandPaletteOpen, commandIndex, setCommandIndex, filtered, executeCommand])

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border">
              <div className="flex items-center gap-3 px-4 h-14 border-b border-border/50">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  autoFocus
                  placeholder="Search pages..."
                  value={commandSearch}
                  onChange={(e) => { setCommandSearch(e.target.value); setCommandIndex(0) }}
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <Command className="w-3 h-3" />K
                </kbd>
              </div>
              <div className="p-2 max-h-72 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">No results found</div>
                ) : (
                  filtered.map((cmd, i) => (
                    <button
                      key={cmd.id}
                      onClick={() => executeCommand(cmd)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                        i === commandIndex
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      <span>{cmd.label}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
