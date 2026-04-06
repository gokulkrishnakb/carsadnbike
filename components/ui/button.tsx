"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:translate-y-px",
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:translate-y-px",
        outline:
          "border border-border bg-background hover:bg-muted hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
        ghost:
          "hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20",
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs:   "h-7 px-2.5 text-xs",
        sm:   "h-8 px-3 text-xs",
        md:   "h-9 px-4 text-sm",
        default: "h-9 px-4 text-sm",
        lg:   "h-10 px-5 text-sm",
        xl:   "h-11 px-7 text-[15px]",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

function Button({ className, variant, size, loading, children, disabled, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading && (
        <svg className="animate-spin size-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
