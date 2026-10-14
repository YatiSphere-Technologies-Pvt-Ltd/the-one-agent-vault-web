import { useSyncExternalStore } from "react";

/** Subscribe to a media query. Returns `fallback` where matchMedia is unavailable. */
export function useMediaQuery(query: string, fallback = true): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = globalThis.matchMedia?.(query);
      mql?.addEventListener("change", onChange);
      return () => mql?.removeEventListener("change", onChange);
    },
    () => globalThis.matchMedia?.(query).matches ?? fallback,
    () => fallback,
  );
}
