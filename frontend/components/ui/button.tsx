import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.7)] hover:brightness-110",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                // New Retro Variant
                retro: "bg-gradient-to-r from-pink-500 to-violet-500 text-white border-2 border-transparent hover:border-white/50 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/50 hover:-translate-y-1",
                neon: "bg-transparent border border-cyan-400 text-cyan-400 shadow-[0_0_5px_theme(colors.cyan.400)] hover:shadow-[0_0_15px_theme(colors.cyan.400),inset_0_0_10px_theme(colors.cyan.400/0.2)] hover:bg-cyan-950/30 font-mono tracking-widest",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
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
        // Note: asChild logic omitted for standard button usage to simplify
        // If needed, we can import Slot from radix-ui (if available) or generic div.
        // For now, simple button is fine.
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
