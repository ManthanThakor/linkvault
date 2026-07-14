"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Scene3D } from "@/components/shared/scene-3d"
import { TiltCard } from "@/components/shared/tilt-card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/useAuthStore"
import { Link2, BarChart3, Shield, ArrowRight, Zap, Globe, Users, Layers, Check, ChevronRight } from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

const features = [
  {
    icon: Zap,
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
    icon: Layers,
    title: "Smart Organization",
    desc: "Categories, tags, and collections keep everything tidy. Find any link in seconds.",
    gradient: "from-accent/20 via-accent/5 to-transparent",
    border: "border-accent/20",
  },
  {
    icon: Globe,
    title: "Share Collections",
    desc: "Group related links and share them with anyone. Perfect for teams and communities.",
    gradient: "from-primary/20 via-primary/5 to-transparent",
    border: "border-primary/20",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Your links are encrypted and protected. Full control over who sees what.",
    gradient: "from-secondary/20 via-secondary/5 to-transparent",
    border: "border-secondary/20",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Invite team members, assign roles, and manage links together seamlessly.",
    gradient: "from-accent/20 via-accent/5 to-transparent",
    border: "border-accent/20",
  },
]

const steps = [
  { num: "01", title: "Create an account", desc: "Sign up free in seconds. No credit card needed." },
  { num: "02", title: "Add your links", desc: "Paste any URL, customize the alias, and organize with tags." },
  { num: "03", title: "Track performance", desc: "Monitor clicks, locations, and engagement in real time." },
]

const stats = [
  { value: "10k+", label: "Active Users" },
  { value: "50k+", label: "Links Created" },
  { value: "1M+", label: "Clicks Tracked" },
  { value: "99.9%", label: "Uptime" },
]

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

        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/40">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-sm font-extrabold text-white">L</span>
              </div>
              <span className="text-base font-extrabold tracking-tight">LinkVault</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold">How it works</a>
            </nav>
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

        {/* Hero */}
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
              Smart Link Management Platform
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] mb-6">
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
              Create short URLs, track every click in real time, and organize
              everything with categories &mdash; all from one sleek dashboard.
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

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-xs text-muted-foreground mt-6 font-semibold"
            >
              Free to start &middot; No credit card required &middot; Cancel anytime
            </motion.p>
          </motion.div>
        </section>

        {/* Stats */}
        <motion.section {...fadeUp} className="max-w-[1400px] mx-auto px-4 lg:px-6 pb-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-background p-8 text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-glow-primary mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Features */}
        <section id="features" className="max-w-[1400px] mx-auto px-4 lg:px-6 pb-32">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-xs font-bold text-primary tracking-widest uppercase mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Everything you need to <span className="text-glow-primary">manage links</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powerful features to help you create, organize, and analyze your links
              &mdash; all in one place.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} {...fadeUp} transition={{ delay: i * 0.05, duration: 0.5 }}>
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

        {/* How it works */}
        <section id="how-it-works" className="max-w-[1400px] mx-auto px-4 lg:px-6 pb-32">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-xs font-bold text-primary tracking-widest uppercase mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Get started in <span className="text-glow-secondary">three steps</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From zero to organized links in minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%+8px)] w-[calc(100%-32px)] h-px bg-gradient-to-r from-primary/40 to-transparent" />
                )}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="text-primary font-extrabold text-sm">{step.num}</span>
                  </div>
                </div>
                <h3 className="text-lg font-extrabold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section {...fadeUp} className="max-w-[1400px] mx-auto px-4 lg:px-6 pb-32">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-12 md:p-20 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.60_0.26_330/0.08),transparent_70%)]" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                Ready to <span className="text-glow-primary">transform</span> your links?
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Join thousands of users who are already managing their links smarter.
                Start free, upgrade when you need more.
              </p>
              <Link href="/auth/register">
                <Button variant="primary" size="lg" className="text-base">
                  Get started free
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="border-t border-border/40 py-8">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <span className="text-[10px] font-extrabold text-white">L</span>
              </div>
              <span className="text-xs font-extrabold">LinkVault</span>
            </div>
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
