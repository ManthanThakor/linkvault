import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg bg-surface border border-border px-3.5 py-2 text-sm text-foreground",
        "placeholder:text-muted-foreground/40",
        "focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-glow-primary",
        "disabled:cursor-not-allowed disabled:opacity-30",
        "file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-foreground",
        "transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
