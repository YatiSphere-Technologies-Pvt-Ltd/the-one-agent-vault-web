import { useMatches } from "@tanstack/react-router";
import type { ScreenId } from "../../screens";

/** The screen ID of the deepest matched route that declares one in staticData. */
export function useActiveScreenId(fallback: ScreenId): ScreenId {
  const matches = useMatches();
  for (let i = matches.length - 1; i >= 0; i--) {
    const id = matches[i]?.staticData.screenId;
    if (id) return id;
  }
  return fallback;
}
