import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * shadcn-pattern button, restyled to the film system:
 * squared-off corners, mono uppercase label, ink/mask palette.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mask disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper hover:bg-mask",
        outline: "border border-line hover:border-mask hover:text-mask",
        ghost: "text-faded hover:text-ink",
        accent: "bg-mask text-paper hover:bg-ink dark:hover:bg-ink dark:hover:text-paper",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3 text-[0.66rem]",
        lg: "h-12 px-7",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
