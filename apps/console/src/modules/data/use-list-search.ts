import { useCallback } from "react";
import type { ListSearch } from "./list-search";

type Navigate = (opts: { search: (prev: ListSearch) => ListSearch; replace: boolean }) => Promise<void>;

/** Merge a partial update into the route's list search params (replaces history: no back-button spam). */
export function useListSearchUpdater(navigate: unknown) {
  return useCallback(
    (next: Partial<ListSearch>) => void (navigate as Navigate)({ search: (prev) => ({ ...prev, ...next }), replace: true }),
    [navigate],
  );
}
