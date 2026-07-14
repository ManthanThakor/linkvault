"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

const footerLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/links", label: "Links" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
]

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/[0.02] pointer-events-none" />
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-10 relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-glow-primary"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <span className="text-sm font-bold">LinkVault</span>
              <p className="text-[10px] text-muted-foreground/60 font-semibold tracking-wide uppercase">Smart link management</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs font-semibold text-muted-foreground/60 hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground/40 font-semibold">
              &copy; {new Date().getFullYear()} LinkVault
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
