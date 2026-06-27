import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 disabled:pointer-events-none disabled:opacity-65",
  {
    variants: {
      variant: {
        default: "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:-translate-y-0.5 hover:bg-emerald-600 active:translate-y-0",
        destructive: "bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-600",
        outline: "border border-slate-200 bg-white/50 text-slate-700 hover:bg-slate-50 hover:text-slate-900",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        link: "text-emerald-600 underline-offset-4 hover:underline",
        pill: "rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:-translate-y-0.5 hover:bg-emerald-600 active:translate-y-0",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
