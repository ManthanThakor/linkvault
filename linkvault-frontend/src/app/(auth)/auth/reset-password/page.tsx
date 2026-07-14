"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: searchParams.get("token") || "" },
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      await api.post("/api/auth/reset-password", data)
      setSuccess(true)
      setTimeout(() => router.push("/auth/login"), 2000)
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Invalid or expired token", variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex w-1/2 bg-surface border-r-2 border-border items-center justify-center p-12">
        <div className="max-w-sm">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-[0_3px_0_oklch(0.40_0.24_25)] mb-6">
            <span className="text-primary-foreground font-extrabold text-lg">L</span>
          </div>
          <h2 className="heading-xl mb-3">Set new password</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Choose a strong password that you haven&apos;t used before.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="heading-xl">Reset password</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {success ? "Your password has been reset" : "Enter your new password"}
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-success/15 border-2 border-success/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <div>
                <p className="font-bold text-lg">Password reset!</p>
                <p className="text-sm text-muted-foreground mt-1">Redirecting to login...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
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
                {isSubmitting ? "Resetting..." : "Reset Password"} <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          <div className="text-center mt-6">
            <Link href="/auth/login" className="text-sm font-bold text-primary hover:underline">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
