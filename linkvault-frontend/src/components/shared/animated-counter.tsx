"use client"

import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  className?: string
  duration?: number
}

export function AnimatedCounter({ value, className, duration = 1500 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (!isInView || !ref.current) return
    let start = 0
    const increment = Math.ceil(value / (duration / 16))
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        ref.current!.textContent = value.toLocaleString()
        clearInterval(timer)
      } else {
        ref.current!.textContent = start.toLocaleString()
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, value, duration])

  return <span ref={ref} className={cn("tabular-nums", className)} />
}
