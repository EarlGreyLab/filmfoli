import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  /** Setter — used by AnimatedThemeToggler's controlled mode. Persists. */
  setTheme: (t: Theme) => void;
  /** Film-grain overlay on/off (persisted, defaults on). */
  grain: boolean;
  toggleGrain: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Owns theme + grain state. The initial theme is whatever the pre-paint
 * script in index.html already applied, so there is never a flash —
 * this provider just reads that result and keeps it in sync.
 *
 * Persistence is deliberately write-on-choice, not write-on-render. Saving
 * the mount-time theme would stamp the OS-derived value into localStorage on
 * the first visit, and the pre-paint script's `saved choice > OS preference`
 * priority could then never reach its second branch — the site would stop
 * following the OS for everyone who had ever loaded it once.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  const [grain, setGrain] = useState<boolean>(
    () => localStorage.getItem("grain") !== "off"
  );
  // Grain has no pre-paint script, so its first render is already the stored
  // value; only skip the redundant write-back of what we just read.
  const grainHydrated = useRef(false);

  // Mirror state onto <html> (idempotent — the toggler may have set it
  // already inside a view transition), but never persist here.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!grainHydrated.current) {
      grainHydrated.current = true;
      return;
    }
    localStorage.setItem("grain", grain ? "on" : "off");
  }, [grain]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
  }, []);

  const toggleGrain = useCallback(() => setGrain((g) => !g), []);

  const value = useMemo(
    () => ({ theme, setTheme, grain, toggleGrain }),
    [theme, setTheme, grain, toggleGrain]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
