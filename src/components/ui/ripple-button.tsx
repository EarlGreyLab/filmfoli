import React, { useEffect, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";

import { cn } from "../../lib/utils";

/**
 * MagicUI Ripple Button (https://magicui.design/docs/components/ripple-button),
 * adapted for Filmfolio: default chrome stripped so `buttonVariants` styles
 * pass through untouched, plus an optional `to` prop. Ripple color defaults to
 * the theme's paper token, which reads correctly on both ink and mask
 * backgrounds.
 *
 * With `to` it renders a real <Link>, not a button that calls navigate():
 * the hero CTA is the site's primary navigation, so it has to support
 * cmd/middle-click, "open in new tab", and be announced as a link. The ripple
 * is pure decoration layered on top and never delays the navigation.
 */

type RippleVisualProps = {
  rippleColor?: string;
  duration?: string;
};

type RippleButtonProps = RippleVisualProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Optional route — renders an anchor instead of a button. */
    to?: string;
  };

type Ripple = { x: number; y: number; size: number; key: number };

/** Shared ripple state + the two layers every variant renders. */
function useRipples(duration: string) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const spawn = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    setRipples((prev) => [
      ...prev,
      {
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
        size,
        key: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    if (ripples.length === 0) return;
    const last = ripples[ripples.length - 1];
    const timeout = setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.key !== last.key)),
      parseInt(duration)
    );
    return () => clearTimeout(timeout);
  }, [ripples, duration]);

  return { ripples, spawn };
}

function RippleLayers({
  children,
  ripples,
  rippleColor,
  duration,
}: {
  children: React.ReactNode;
  ripples: Ripple[];
  rippleColor: string;
  duration: string;
}) {
  return (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        {ripples.map((ripple) => (
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
    </>
  );
}

const surfaceClass = "relative cursor-pointer overflow-hidden text-center";

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
    const { ripples, spawn } = useRipples(duration);
    const layers = (
      <RippleLayers
        ripples={ripples}
        rippleColor={rippleColor}
        duration={duration}
      >
        {children}
      </RippleLayers>
    );

    if (to) {
      // Anchor semantics: the router handles the click, the ripple is only
      // decoration on top of it — nothing here delays the navigation.
      return (
        <Link
          to={to}
          className={cn(surfaceClass, className)}
          onClick={spawn}
          aria-label={props["aria-label"]}
          title={props.title}
          id={props.id}
        >
          {layers}
        </Link>
      );
    }

    return (
      <button
        className={cn(surfaceClass, className)}
        onClick={(event) => {
          spawn(event);
          onClick?.(event);
        }}
        ref={ref}
        {...props}
      >
        {layers}
      </button>
    );
  }
);

RippleButton.displayName = "RippleButton";
