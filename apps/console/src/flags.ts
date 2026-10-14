// Release flags. R1 is always on; R2 and R3 screens are hidden from navigation and the
// command palette unless their flag is on. Later read from /api/licence; for now a
// development toggle in the avatar menu, stored in localStorage.
import { useSyncExternalStore } from "react";
import { storage } from "@agentvault/ui";
import type { Release } from "./screens";

export const FLAGS_KEY = "av.flags";

export interface Flags {
  R2: boolean;
  R3: boolean;
}

const listeners = new Set<() => void>();
let cache: Flags | null = null;

function read(): Flags {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(storage.get(FLAGS_KEY) ?? "{}") as Partial<Flags>;
    cache = { R2: parsed.R2 === true, R3: parsed.R3 === true };
  } catch {
    cache = { R2: false, R3: false };
  }
  return cache;
}

export function setFlag(release: "R2" | "R3", on: boolean): void {
  cache = { ...read(), [release]: on };
  storage.set(FLAGS_KEY, JSON.stringify(cache));
  for (const listener of listeners) listener();
}

export function useFlags(): Flags {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    read,
    read,
  );
}

export function isReleased(release: Release, flags: Flags): boolean {
  return release === "R1" || flags[release];
}
