import * as z from "zod/mini";
import type { SortingState } from "@agentvault/ui";

/** URL search params shared by every list screen: ?page=2&q=crm&sort=risk:desc&status=approved */
export const listSearchSchema = z.object({
  page: z.catch(z.optional(z.int().check(z.positive())), undefined),
  q: z.catch(z.optional(z.string()), undefined),
  sort: z.catch(z.optional(z.string()), undefined),
  status: z.catch(z.optional(z.string()), undefined),
});

export type ListSearch = z.infer<typeof listSearchSchema>;

export function toSorting(sort: string | undefined): SortingState {
  if (!sort) return [];
  const [id, dir] = sort.split(":");
  return id ? [{ id, desc: dir === "desc" }] : [];
}

export function fromSorting(sorting: SortingState): string | undefined {
  const [first] = sorting;
  return first ? `${first.id}:${first.desc ? "desc" : "asc"}` : undefined;
}
