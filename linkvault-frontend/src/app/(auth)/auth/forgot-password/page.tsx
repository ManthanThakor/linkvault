"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight } from "lucide-react"

const schema = z.object({ email: z.string().email("Invalid email address") })

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: { email: string }) => {
    try {
      await api.post("/api/auth/forgot-password", data)
      setSent(true)
      toast({ title: "Check your email", variant: "success" })
    } catch (err: any) {
      toast({ title: "Failed", description: err.message, variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex w-1/2 bg-surface border-r-2 border-border items-center justify-center p-12">
        <div className="max-w-sm">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-[0_3px_0_oklch(0.40_0.24_25)] mb-6">
            <span className="text-primary-foreground font-extrabold text-lg">L</span>
          </div>
          <h2 className="heading-xl mb-3">Forgot password?</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            No worries. We&apos;ll send you a reset link to get back into your account.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="heading-xl">Reset password</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {sent ? "We&apos;ve sent a reset link to your email" : "Enter your email to receive a reset link"}
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-success/10 border-2 border-success/20 text-sm font-bold text-success">
                Reset link sent! Check your inbox.
              </div>
              <Link href="/auth/login" className="block">
                <Button variant="outline" size="lg" className="w-full"><ArrowLeft className="w-4 h-4" /> Back to login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" {...register("email")} className={cn(errors.email && "border-destructive")} />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} variant="primary" size="lg" className="w-full mt-2">
                {isSubmitting ? "Sending..." : "Send Reset Link"} <ArrowRight className="w-4 h-4" />
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
