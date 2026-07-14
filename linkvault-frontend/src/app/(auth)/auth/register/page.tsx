"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterInput } from "@/lib/validations"
import { api, setTokens } from "@/lib/api"
import { useAuthStore } from "@/stores/useAuthStore"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { setUser, isAuthenticated } = useAuthStore()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard")
  }, [isAuthenticated, router])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await api.post<{ token: string; refreshToken: string; userId: string; name: string; email: string; role: string; emailVerified: boolean; createdAt: string }>("/api/auth/register", {
        name: data.name, email: data.email, password: data.password, confirmPassword: data.confirmPassword,
      })
      setTokens(res.token, res.refreshToken)
      setUser({ id: res.userId, name: res.name, email: res.email, role: res.role, emailVerified: res.emailVerified, createdAt: res.createdAt })
      toast({ title: "Account created!", description: "Welcome to LinkVault", variant: "success" })
      router.push("/dashboard")
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message || "Something went wrong", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex w-1/2 bg-surface border-r-2 border-border items-center justify-center p-12">
        <div className="max-w-sm">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-[0_3px_0_oklch(0.40_0.24_25)] mb-6">
            <span className="text-primary-foreground font-extrabold text-lg">L</span>
          </div>
          <h2 className="heading-xl mb-3">Get Started</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Join thousands of users who trust LinkVault to manage, organize, and track their most important links.
          </p>
          <div className="mt-8 space-y-4">
            {["Free forever with unlimited links", "Powerful analytics dashboard", "Organize with categories, tags & collections"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="heading-xl">Create account</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Start managing your links in minutes</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" {...register("name")} className={cn(errors.name && "border-destructive")} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" {...register("email")} className={cn(errors.email && "border-destructive")} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("password")} className={cn(errors.password && "border-destructive", "pr-10")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} className={cn(errors.confirmPassword && "border-destructive")} />
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} variant="primary" size="lg" className="w-full mt-2">
              {isSubmitting ? "Creating account..." : "Create Account"} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
