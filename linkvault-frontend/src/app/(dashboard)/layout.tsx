"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Scene3D } from "@/components/shared/scene-3d"
import { LoadingScreen } from "@/components/shared/loading-screen"
import { PageTransition } from "@/components/shared/page-transition"
import { useAuthStore } from "@/stores/useAuthStore"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const hasToken = typeof window !== "undefined" && localStorage.getItem("accessToken")
    if (!isAuthenticated && !hasToken) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-background relative">
      <LoadingScreen />
      <Scene3D />
      <div className="relative z-10">
        <Navbar />
        <main className="pt-14 min-h-screen">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-6">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
