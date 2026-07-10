"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  className?: string
  duration?: number
}

export function AnimatedCounter({ value, suffix = "", prefix = "", className, duration = 1.5 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const spring = useSpring(0, { stiffness: 100, damping: 30, duration })
  const display = useTransform(spring, (latest) => Math.floor(latest))

  useEffect(() => {
    spring.set(value)
    const unsubscribe = display.on("change", (v) => setDisplayValue(v))
    return () => unsubscribe()
  }, [value, spring, display])

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn("tabular-nums", className)}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  )
}
