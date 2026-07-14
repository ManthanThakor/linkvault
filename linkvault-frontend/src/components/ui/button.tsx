import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-bold transition-all duration-200 outline-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-30",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-[0_0_15px_oklch(0.60_0.26_330/0.2)] hover:shadow-[0_0_25px_oklch(0.60_0.26_330/0.4)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-[0_0_15px_oklch(0.60_0.20_195/0.2)] hover:shadow-[0_0_25px_oklch(0.60_0.20_195/0.4)]",
        outline:
          "border border-border bg-transparent hover:bg-surface text-foreground hover:border-primary hover:shadow-glow-primary",
        ghost:
          "bg-transparent hover:bg-surface text-muted-foreground hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-110 shadow-[0_0_15px_oklch(0.55_0.25_25/0.3)]",
        accent:
          "bg-accent text-accent-foreground hover:brightness-110 shadow-[0_0_15px_oklch(0.70_0.25_140/0.3)]",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
        md: "h-10 px-4 text-sm gap-2 rounded-lg",
        lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }
