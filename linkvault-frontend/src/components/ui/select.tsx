import * as React from "react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg bg-surface border-2 border-border px-3.5 py-2 text-sm text-foreground",
        "focus-visible:outline-none focus-visible:border-primary",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    />
  )
)
Select.displayName = "Select"

export { Select }
