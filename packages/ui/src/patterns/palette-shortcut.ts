import { useEffect } from "react";

/** True when the event is the palette shortcut: ⌘K on Apple platforms, Ctrl K elsewhere. */
export function isPaletteShortcut(e: KeyboardEvent): boolean {
  return e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey;
}

export function isApplePlatform(): boolean {
  return typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
}

/** Toggle the command palette with ⌘K / Ctrl K anywhere on the page. */
export function usePaletteShortcut(toggle: () => void): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isPaletteShortcut(e)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggle]);
}
