import React, { useEffect, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import { cn } from "../../lib/utils";

/**
 * MagicUI Ripple Button (https://magicui.design/docs/components/ripple-button),
 * adapted for Filmfolio: default chrome stripped so `buttonVariants` styles
 * pass through untouched, plus an optional `to` prop so it can act as a
 * router link (the hero CTAs navigate). Ripple color defaults to the theme's
 * paper token, which reads correctly on both ink and mask backgrounds.
 */

interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string;
  duration?: string;
  /** Optional route — click ripples, then navigates. */
  to?: string;
}

export const RippleButton = React.forwardRef<
  HTMLButtonElement,
  RippleButtonProps
>(
  (
    {
      className,
      children,
      rippleColor = "var(--paper)",
      duration = "600ms",
      onClick,
      to,
      ...props
    },
    ref
  ) => {
    const navigate = useNavigate();
    const [buttonRipples, setButtonRipples] = useState<
      Array<{ x: number; y: number; size: number; key: number }>
    >([]);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      createRipple(event);
      onClick?.(event);
      // Let the ripple be seen for a beat before the route changes.
      if (to) setTimeout(() => navigate(to), 180);
    };

    const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      setButtonRipples((prev) => [...prev, { x, y, size, key: Date.now() }]);
    };

    useEffect(() => {
      let timeout: ReturnType<typeof setTimeout> | null = null;
      if (buttonRipples.length > 0) {
        const lastRipple = buttonRipples[buttonRipples.length - 1];
        timeout = setTimeout(() => {
          setButtonRipples((prev) =>
            prev.filter((r) => r.key !== lastRipple.key)
          );
        }, parseInt(duration));
      }
      return () => {
        if (timeout !== null) clearTimeout(timeout);
      };
    }, [buttonRipples, duration]);

    return (
      <button
        className={cn(
          "relative cursor-pointer overflow-hidden text-center",
          className
        )}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
        <span className="pointer-events-none absolute inset-0">
          {buttonRipples.map((ripple) => (
            <span
              className="animate-rippling absolute rounded-full opacity-30"
              key={ripple.key}
              style={
                {
                  width: `${ripple.size}px`,
                  height: `${ripple.size}px`,
                  top: `${ripple.y}px`,
                  left: `${ripple.x}px`,
                  backgroundColor: rippleColor,
                  transform: `scale(0)`,
                  "--duration": duration,
                } as React.CSSProperties
              }
            />
          ))}
        </span>
      </button>
    );
  }
);

RippleButton.displayName = "RippleButton";
