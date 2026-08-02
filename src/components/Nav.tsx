import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import { useTheme } from "../lib/theme";
import { buttonVariants } from "./ui/button";
import { Button } from "./ui/button";
import { RebateStrip } from "./RebateStrip";
import { cn } from "../lib/utils";

const links = [
  { to: "/gallery", label: "Gallery" },
  { to: "/reel", label: "The Reel" },
  { to: "/blog", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const socials = [
  { href: "https://www.instagram.com/", label: "Instagram" },
  { href: "https://www.behance.net/", label: "Behance" },
];

/**
 * Sticky top nav. The hamburger is the navigation at every
 * breakpoint — it opens a staggered slide-in panel (ported from the Atelier
 * Lichtwerk menu, restyled in Filmfolio's film language): links enter
 * one-by-one like frames advancing on a roll, each labelled with a
 * rebate-style frame number. ESC closes, body scroll is locked while
 * open, and reduced-motion users get an instant panel.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const panelRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock + ESC to close (behavior ported from staggered-menu.js)
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Move focus into the panel for keyboard users
    panelRef.current?.querySelector("a")?.focus();
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      toggleRef.current?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="font-display text-2xl leading-none" onClick={close}>
          Yun<span className="text-mask italic"> shoots film</span>
        </Link>

        <div className="flex items-center gap-1">
          <AnimatedThemeToggler
            theme={theme}
            onThemeChange={setTheme}
            title={`Switch to ${theme === "light" ? "darkroom" : "gallery"}`}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "[&_svg]:size-4")}
          />
          <Button
            ref={toggleRef}
            variant="ghost"
            size="icon"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-panel"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </Button>
        </div>
      </div>

      {/* Overlay + panel are portaled to <body>: the header's backdrop-blur
          would otherwise become the containing block for position:fixed. */}
      {createPortal(
        <>
      {/* Dimming overlay — click to close */}
      <div
        className={cn("menu-overlay", open && "is-active")}
        onClick={close}
        aria-hidden="true"
      />

      {/* Staggered slide-in panel */}
      <aside
        id="menu-panel"
        ref={panelRef}
        className={cn("menu-panel", open && "is-open")}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col gap-10 overflow-y-auto px-7 pb-8 pt-24">
          <nav aria-label="Main navigation" className="flex-1">
            <ul className="flex flex-col gap-2">
              {links.map((l, i) => (
                <li
                  key={l.to}
                  className="menu-item"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <NavLink
                    to={l.to}
                    onClick={close}
                    tabIndex={open ? 0 : -1}
                    className={({ isActive }) =>
                      cn(
                        "menu-link group flex items-baseline gap-4 py-3 font-display text-4xl leading-none",
                        isActive ? "text-mask italic" : "text-ink"
                      )
                    }
                  >
                    <span className="font-mono text-[0.66rem] tracking-[0.22em] text-faded">
                      {String(i + 1).padStart(2, "0")}A
                    </span>
                    <span className="menu-link__text">{l.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className="menu-item flex flex-col gap-5"
            style={{ "--i": links.length } as React.CSSProperties}
          >
            <ul className="flex gap-6 font-mono text-[0.7rem] uppercase tracking-[0.16em]">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    tabIndex={open ? 0 : -1}
                    className="border-b border-dotted border-faded pb-0.5 text-faded transition-colors hover:text-mask"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <RebateStrip label="Navigation · 35mm" frame={`${links.length}EXP`} />
          </div>
        </div>
      </aside>
        </>,
        document.body
      )}
    </header>
  );
}
