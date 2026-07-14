"use client"

import { useEffect } from "react"
import { loadTokens, clearTokens, fetchAuthMe } from "@/lib/api"
import { useAuthStore } from "@/stores/useAuthStore"

export function useAuthInit() {
  const { setUser } = useAuthStore()

  useEffect(() => {
    loadTokens()
    const token = typeof window !== "undefined" && localStorage.getItem("accessToken")
    if (!token) return

    fetchAuthMe().then((user) => {
      if (user) {
        setUser(user)
      } else {
        clearTokens()
      }
    })
  }, [setUser])
}
