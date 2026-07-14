"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Scene3D } from "@/components/shared/scene-3d"
import { TiltCard } from "@/components/shared/tilt-card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/useAuthStore"
import { Link2, BarChart3, Shield, ArrowRight, Zap, Globe, Users, Layers, ChevronRight } from "lucide-react"

const ease = [0.16, 1, 0.3, 1] as const

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.7, ease },
}

const heroWords = ["Shorten.", "Track.", "Succeed."]
const heroColors = ["text-glow-primary", "text-glow-secondary", "text-glow-accent"]

const features = [
  {
    icon: Zap,
    title: "Short Links",
    desc: "Create clean, memorable short URLs instantly. Custom aliases, QR codes, and bulk creation at your fingertips.",
    gradient: "from-primary/20 via-primary/5 to-transparent",
    border: "border-primary/20",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    desc: "Track clicks, locations, devices, and referrers. Know exactly how every link performs with beautiful charts.",
    gradient: "from-secondary/20 via-secondary/5 to-transparent",
    border: "border-secondary/20",
  },
  {
    icon: Layers,
    title: "Smart Organization",
    desc: "Categories, tags, and collections keep everything tidy. Find any link in seconds with powerful search.",
    gradient: "from-accent/20 via-accent/5 to-transparent",
    border: "border-accent/20",
  },
  {
    icon: Globe,
    title: "Share Collections",
    desc: "Group related links and share them with anyone. Perfect for teams, communities, and social sharing.",
    gradient: "from-primary/20 via-primary/5 to-transparent",
    border: "border-primary/20",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Your links are encrypted and protected. Full control over who sees what with role-based access.",
    gradient: "from-secondary/20 via-secondary/5 to-transparent",
    border: "border-secondary/20",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Invite team members, assign roles, and manage links together. Built for teams of all sizes.",
    gradient: "from-accent/20 via-accent/5 to-transparent",
    border: "border-accent/20",
  },
]

const steps = [
  { num: "01", title: "Create your account", desc: "Sign up free in seconds. No credit card, no strings attached." },
  { num: "02", title: "Add your links", desc: "Paste any URL, customize the alias, and organize with categories and tags." },
  { num: "03", title: "Track & optimize", desc: "Monitor clicks, locations, and engagement in real time. Optimize what works." },
]

const statsData = [
  { value: 10, suffix: "k+", label: "Active Users" },
  { value: 50, suffix: "k+", label: "Links Created" },
  { value: 1, suffix: "M+", label: "Clicks Tracked" },
  { value: 99.9, suffix: "%", label: "Uptime" },
]

function AnimatedCounter({ target, suffix, label, index }: { target: number; suffix: string; label: string; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = Math.max(1, Math.floor(target / 30))
    const interval = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(start)
      }
    }, duration / (target / step))
    return () => clearInterval(interval)
  }, [inView, target])

  const display = target >= 1000 ? count.toString().slice(0, -3) + (count >= 1000 ? suffix : "") : count + suffix

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-background p-8 text-center relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <p className="text-4xl md:text-5xl font-extrabold text-glow-primary mb-1 tabular-nums">
        {inView ? display : "0" + suffix}
      </p>
      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">{label}</p>
    </motion.div>
  )
}

function Particles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroWords.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  if (isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Scene3D />
      <Particles />
      <div className="relative z-10">

        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/40"
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center"
              >
                <span className="text-sm font-extrabold text-white">L</span>
              </motion.div>
              <span className="text-base font-extrabold tracking-tight">LinkVault</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold"
              >
                Features
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold"
              >
                How it works
              </motion.a>
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
        </motion.header>

        {/* Hero */}
        <section className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 pt-20 pb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-bold text-primary tracking-wider uppercase mb-8 group cursor-default"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
              Smart Link Management Platform
            </motion.div>

            {/* Hero Headline - rotating words */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] mb-6 relative">
              <span className="block mb-2">Transform your</span>
              <span className="block mb-2">links into</span>
              <span className="relative inline-block min-h-[1.2em]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={heroWords[heroIndex]}
                    initial={{ opacity: 0, y: 40, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -40, rotateX: 15 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`block ${heroColors[heroIndex]}`}
                  >
                    {heroWords[heroIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Create short URLs, track every click in real time, and organize
              everything with categories &mdash; all from one sleek dashboard.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link href="/auth/register">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="primary" size="lg" className="text-base relative overflow-hidden group">
                    <span className="relative z-10 flex items-center">
                      Start for free
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </Button>
                </motion.div>
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
            {statsData.map((stat, i) => (
              <AnimatedCounter key={stat.label} target={stat.value} suffix={stat.suffix} label={stat.label} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Features */}
        <section id="features" className="max-w-[1400px] mx-auto px-4 lg:px-6 pb-32">
          <motion.div {...fadeUp} className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold text-primary tracking-widest uppercase mb-3"
            >
              Features
            </motion.p>
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
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <TiltCard>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`h-full p-6 rounded-xl border ${feature.border} bg-gradient-to-b ${feature.gradient} backdrop-blur-sm transition-all duration-300 group cursor-default`}
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.4 }}
                      className={`w-10 h-10 rounded-lg border ${feature.border} bg-surface flex items-center justify-center mb-4 group-hover:shadow-glow-primary transition-shadow duration-300`}
                    >
                      <feature.icon className="w-5 h-5 text-foreground" />
                    </motion.div>
                    <h3 className="text-lg font-extrabold mb-2 group-hover:text-glow-primary transition-all duration-300">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </motion.div>
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
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40" />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative text-center md:text-left"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                  className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto md:mx-0 mb-4"
                >
                  <span className="text-primary font-extrabold text-lg">{step.num}</span>
                </motion.div>
                <h3 className="text-xl font-extrabold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section {...fadeUp} className="max-w-[1400px] mx-auto px-4 lg:px-6 pb-32">
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-12 md:p-20 text-center"
          >
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.60_0.26_330/0.08),transparent_70%)]"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                Ready to <span className="text-glow-primary">transform</span> your links?
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Join thousands of users who are already managing their links smarter.
                Start free, upgrade when you need more.
              </p>
              <Link href="/auth/register">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="primary" size="lg" className="text-base">
                    Get started free
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-border/40 py-8"
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-6 h-6 rounded-md bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center"
              >
                <span className="text-[10px] font-extrabold text-white">L</span>
              </motion.div>
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
        </motion.footer>
      </div>
    </div>
  )
}
