import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { cn } from "../../lib/utils";

/**
 * shadcn-pattern dialog on Radix. Restyled: near-opaque darkroom overlay
 * (the lightbox should feel like the room lights went off), no card chrome.
 *
 * Uses the frozen `dr-*` darkroom tokens rather than the theme tokens: this
 * dialog only ever hosts the Lightbox, which stays dark in both themes.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-dr-void/95 backdrop-blur-sm fade-in-anim" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center p-4 focus:outline-none sm:p-8",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 p-2 text-dr-ink/70 transition-colors hover:text-dr-mask focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dr-mask">
        <X className="size-5" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";
