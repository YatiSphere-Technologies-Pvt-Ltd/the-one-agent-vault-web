import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { storage } from "../lib/storage";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "av.theme";

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isPreference = (v: string | null): v is ThemePreference =>
  v === "system" || v === "light" || v === "dark";

export function readThemePreference(): ThemePreference {
  const stored = storage.get(THEME_STORAGE_KEY);
  return isPreference(stored) ? stored : "system";
}

function systemTheme(): ResolvedTheme {
  return globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === "system" ? systemTheme() : preference;
}

/** Set data-theme on <html> before React renders, so the first paint uses the right theme. */
export function applyThemeEarly(): void {
  document.documentElement.dataset.theme = resolveTheme(readThemePreference());
}

export function ThemeProvider({
  children,
  defaultPreference,
}: {
  children: ReactNode;
  /** Overrides the stored preference (Storybook, tests). */
  defaultPreference?: ThemePreference;
}) {
  const [preference, setPreferenceState] = useState<ThemePreference>(
    () => defaultPreference ?? readThemePreference(),
  );
  const [system, setSystem] = useState<ResolvedTheme>(systemTheme);

  useEffect(() => {
    const query = globalThis.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return;
    const onChange = () => setSystem(query.matches ? "dark" : "light");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const resolved: ResolvedTheme = preference === "system" ? system : preference;

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
  }, [resolved]);

  const setPreference = useCallback((next: ThemePreference) => {
    storage.set(THEME_STORAGE_KEY, next);
    setPreferenceState(next);
  }, []);

  const value = useMemo(() => ({ preference, resolved, setPreference }), [preference, resolved, setPreference]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
