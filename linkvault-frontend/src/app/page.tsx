"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Scene3D } from "@/components/shared/scene-3d"
import { TiltCard } from "@/components/shared/tilt-card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/useAuthStore"
import { Link2, BarChart3, Shield, ArrowRight } from "lucide-react"

export default function Home() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Scene3D />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/40">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <span className="text-sm font-extrabold text-white">L</span>
              </div>
              <span className="text-base font-extrabold tracking-tight text-glow-primary">LinkVault</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm">Get started</Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-bold text-primary tracking-wider uppercase mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Smart Link Management
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6">
              <span className="text-glow-primary">Shorten.</span>
              <br />
              <span className="text-glow-secondary">Track.</span>
              <br />
              <span className="text-glow-accent">Succeed.</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Transform your links into powerful marketing tools.
              Create short URLs, track every click, and organize with
              categories &mdash; all in one sleek dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link href="/auth/register">
                <Button variant="primary" size="lg" className="text-base">
                  Start for free
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="text-base">
                  Sign in
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section className="max-w-[1400px] mx-auto px-4 lg:px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Everything you need to <span className="text-glow-primary">manage links</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powerful features to help you create, organize, and analyze your links.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Link2,
                title: "Short Links",
                desc: "Create clean, memorable short URLs instantly. Custom aliases, QR codes, and bulk creation.",
                gradient: "from-primary/20 via-primary/5 to-transparent",
                border: "border-primary/20",
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                desc: "Track clicks, locations, devices, and referrers. Know exactly how your links perform.",
                gradient: "from-secondary/20 via-secondary/5 to-transparent",
                border: "border-secondary/20",
              },
              {
                icon: Shield,
                title: "Organize & Share",
                desc: "Categories, tags, and collections. Share grouped links with anyone, anywhere.",
                gradient: "from-accent/20 via-accent/5 to-transparent",
                border: "border-accent/20",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <TiltCard>
                  <div className={`h-full p-6 rounded-xl border ${feature.border} bg-gradient-to-b ${feature.gradient} backdrop-blur-sm`}>
                    <div className={`w-10 h-10 rounded-lg border ${feature.border} bg-surface flex items-center justify-center mb-4`}>
                      <feature.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <h3 className="text-lg font-extrabold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="border-t border-border/40 py-8">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-semibold">
              &copy; {new Date().getFullYear()} LinkVault. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/auth/login" className="text-xs text-muted-foreground font-semibold hover:text-foreground transition-colors">Log in</Link>
              <Link href="/auth/register" className="text-xs text-muted-foreground font-semibold hover:text-foreground transition-colors">Sign up</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
