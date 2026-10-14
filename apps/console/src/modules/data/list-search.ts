import { optionalPositiveInt, optionalString, searchSchema } from "./search-params";
import type { SortingState } from "@agentvault/ui";

/** URL search params shared by every list screen: ?page=2&q=crm&sort=risk:desc&status=approved */
export const listSearchShape = {
  page: optionalPositiveInt,
  q: optionalString,
  sort: optionalString,
  status: optionalString,
};
export const listSearchSchema = searchSchema(listSearchShape);

export type ListSearch = {
  page?: number | undefined;
  q?: string | undefined;
  sort?: string | undefined;
  status?: string | undefined;
};

export function toSorting(sort: string | undefined): SortingState {
  if (!sort) return [];
  const [id, dir] = sort.split(":");
  return id ? [{ id, desc: dir === "desc" }] : [];
}

export function fromSorting(sorting: SortingState): string | undefined {
  const [first] = sorting;
  return first ? `${first.id}:${first.desc ? "desc" : "asc"}` : undefined;
}
