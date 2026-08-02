import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  /** Direct setter — used by AnimatedThemeToggler's controlled mode. */
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
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  const [grain, setGrain] = useState<boolean>(
    () => localStorage.getItem("grain") !== "off"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("grain", grain ? "on" : "off");
  }, [grain]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
        setTheme,
        grain,
        toggleGrain: () => setGrain((g) => !g),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
