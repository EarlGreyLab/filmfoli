"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
  type MotionValue,
} from "motion/react";
import { cn } from "../../lib/utils";

/**
 * Magic UI "Scroll Based Velocity", performance-tuned:
 *
 * - ONE scroll listener + ONE velocity spring for the whole container,
 *   shared with every row via context (instead of each row wiring its
 *   own useScroll/useVelocity/useSpring — 3x the per-frame work and
 *   three springs that could disagree, which read as stutter).
 * - Pixel-based wrapping on a measured block width, applied as a
 *   composited translate3d. Percentage transforms on a very wide
 *   inline-flex track force the browser to resolve % against layout
 *   every frame; pixels stay on the GPU.
 * - `will-change: transform` on the moving track and `contain: layout paint`
 *   on the viewport strip, so each row rasterizes independently.
 * - ResizeObserver-based measurement (no re-render storm on resize).
 * - Under prefers-reduced-motion the drift is switched off at the source:
 *   no rAF loop at all, and a single static block instead of the wrapping
 *   copies, so the strip becomes a plain horizontally-scrollable row.
 */

const VelocityContext = createContext<MotionValue<number> | null>(null);

interface ScrollVelocityContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ScrollVelocityContainer({
  children,
  className,
  ...props
}: ScrollVelocityContainerProps) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  // One smoothing spring for everything. Softer stiffness = no micro-jitter.
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 60,
    stiffness: 250,
    mass: 0.5,
  });

  return (
    <VelocityContext.Provider value={smoothVelocity}>
      <div className={cn("relative w-full", className)} {...props}>
        {children}
      </div>
    </VelocityContext.Provider>
  );
}

interface VelocityRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Idle drift speed in px/s. Negative = leftward start direction. */
  baseVelocity?: number;
}

export function ScrollVelocityRow({
  children,
  baseVelocity = 60,
  className,
  ...props
}: VelocityRowProps) {
  const smoothVelocity = useContext(VelocityContext);
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const blockWidth = useRef(0);
  const [copies, setCopies] = useState(2);
  const directionFactor = useRef(1);

  // Measure one block; render just enough copies to cover the viewport + 1.
  useEffect(() => {
    if (reduceMotion) return;
    const measure = () => {
      const cw = containerRef.current?.offsetWidth ?? 0;
      const bw = blockRef.current?.offsetWidth ?? 0;
      blockWidth.current = bw;
      if (bw > 0 && cw > 0) {
        setCopies((prev) => {
          const next = Math.ceil(cw / bw) + 1;
          return next === prev ? prev : next;
        });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (blockRef.current) ro.observe(blockRef.current);
    return () => ro.disconnect();
  }, [children, reduceMotion]);

  useAnimationFrame((_t, delta) => {
    if (reduceMotion) return;
    const bw = blockWidth.current;
    if (bw <= 0) return;

    // Clamp delta so a dropped frame / tab switch never causes a jump.
    const dt = Math.min(delta, 50) / 1000;

    // Scroll velocity (px/s of page scroll) → gentle multiplier, capped.
    const v = smoothVelocity ? smoothVelocity.get() : 0;
    if (v < -1) directionFactor.current = -1;
    else if (v > 1) directionFactor.current = 1;
    const boost = Math.min(Math.abs(v) / 250, 4); // cap at 5x total speed

    const moveBy =
      directionFactor.current * baseVelocity * dt * (1 + boost);

    // Pixel wrap: keep x in (-bw, 0] so the track never grows numbers.
    let next = baseX.get() + moveBy;
    next = ((next % bw) + bw) % bw; // 0..bw
    baseX.set(next - bw); // -bw..0
  });

  // Reduced motion: one static block the user can scroll themselves. No rAF,
  // no duplicated copies (which would repeat the same photos to a screen
  // reader for no reason once nothing is moving).
  if (reduceMotion) {
    return (
      <div
        ref={containerRef}
        className={cn("w-full overflow-x-auto whitespace-nowrap", className)}
        {...props}
      >
        <div className="inline-flex">{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden whitespace-nowrap", className)}
      style={{ contain: "layout paint" }}
      {...props}
    >
      <motion.div
        className="inline-flex will-change-transform"
        style={{ x: baseX, transform: "translateZ(0)" }}
      >
        {Array.from({ length: copies }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? blockRef : null}
            className="inline-flex shrink-0"
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
