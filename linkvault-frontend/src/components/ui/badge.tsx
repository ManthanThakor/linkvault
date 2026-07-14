import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-semibold whitespace-nowrap transition-all duration-200",
  {
    variants: {
      variant: {
        primary: "bg-primary/10 text-primary border border-primary/20",
        secondary: "bg-secondary/10 text-secondary border border-secondary/20",
        accent: "bg-accent/10 text-accent border border-accent/20",
        outline: "border border-border text-muted-foreground",
        destructive: "bg-destructive/10 text-destructive border border-destructive/20",
        success: "bg-success/10 text-success border border-success/20",
      },
      size: {
        sm: "px-2 py-0.5 text-[9px] rounded",
        md: "px-2.5 py-1 text-xs rounded-md",
        lg: "px-3 py-1.5 text-sm rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
