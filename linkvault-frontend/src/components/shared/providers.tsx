"use client"

import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useAuthInit } from "@/hooks/useAuthInit"

function AuthInitWrapper({ children }: { children: React.ReactNode }) {
  useAuthInit()
  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  }))

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {mounted ? (
          <AuthInitWrapper>{children}</AuthInitWrapper>
        ) : (
          <div className="min-h-screen" />
        )}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
