import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Schemas } from "@agentvault/api-client";
import { api } from "../../api";
import type { ListSearch } from "./list-search";

/** API failure carrying the request ID that StateView shows and lets the user copy. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly requestId: string,
  ) {
    super(message);
  }
}

async function unwrap<T>(call: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
  const { data, error, response } = await call;
  if (error !== undefined || data === undefined) {
    const problem = (error ?? {}) as Partial<Schemas["Problem"]>;
    throw new ApiError(problem.title ?? response.statusText, response.status, problem.requestId ?? "unavailable");
  }
  return data;
}

export const PAGE_SIZE = 20;

const listQuery = (s: ListSearch) => ({
  page: s.page ?? 1,
  pageSize: PAGE_SIZE,
  ...(s.q ? { q: s.q } : {}),
  ...(s.sort ? { sort: s.sort } : {}),
  ...(s.status ? { status: s.status as Schemas["Status"] } : {}),
});

const list = { placeholderData: keepPreviousData, retry: false } as const;
const one = { retry: false } as const;

export const useHome = () =>
  useQuery({ queryKey: ["home"], queryFn: () => unwrap(api.GET("/api/home")), ...one });

export const useServers = (s: ListSearch) =>
  useQuery({ queryKey: ["servers", s], queryFn: () => unwrap(api.GET("/api/servers", { params: { query: listQuery(s) } })), ...list });
export const useServer = (id: string) =>
  useQuery({ queryKey: ["server", id], queryFn: () => unwrap(api.GET("/api/servers/{id}", { params: { path: { id } } })), ...one });
export const useServerTools = (id: string, s: ListSearch) =>
  useQuery({
    queryKey: ["server", id, "tools", s],
    queryFn: () => unwrap(api.GET("/api/servers/{id}/tools", { params: { path: { id }, query: listQuery(s) } })),
    ...list,
  });
export const useServerVersions = (id: string, s: ListSearch) =>
  useQuery({
    queryKey: ["server", id, "versions", s],
    queryFn: () =>
      unwrap(api.GET("/api/servers/{id}/versions", { params: { path: { id }, query: { page: s.page ?? 1, pageSize: PAGE_SIZE } } })),
    ...list,
  });

export const useSkills = (s: ListSearch) =>
  useQuery({ queryKey: ["skills", s], queryFn: () => unwrap(api.GET("/api/skills", { params: { query: listQuery(s) } })), ...list });
export const useSkill = (id: string) =>
  useQuery({ queryKey: ["skill", id], queryFn: () => unwrap(api.GET("/api/skills/{id}", { params: { path: { id } } })), ...one });
export const useSkillFiles = (id: string) =>
  useQuery({ queryKey: ["skill", id, "files"], queryFn: () => unwrap(api.GET("/api/skills/{id}/files", { params: { path: { id } } })), ...one });
export const useSkillFindings = (id: string, s: ListSearch) =>
  useQuery({
    queryKey: ["skill", id, "findings", s],
    queryFn: () => unwrap(api.GET("/api/skills/{id}/findings", { params: { path: { id }, query: listQuery(s) } })),
    ...list,
  });
export const useSkillVersions = (id: string) =>
  useQuery({
    queryKey: ["skill", id, "versions"],
    queryFn: () => unwrap(api.GET("/api/skills/{id}/versions", { params: { path: { id } } })),
    ...one,
  });

export const useReviews = (s: ListSearch) =>
  useQuery({ queryKey: ["reviews", s], queryFn: () => unwrap(api.GET("/api/reviews", { params: { query: listQuery(s) } })), ...list });

export const useCalls = (s: ListSearch, serverId?: string) =>
  useQuery({
    queryKey: ["calls", s, serverId],
    queryFn: () =>
      unwrap(api.GET("/api/calls", { params: { query: { ...listQuery(s), ...(serverId ? { serverId } : {}) } } })),
    ...list,
  });
export const useCall = (id: string | undefined) =>
  useQuery({
    queryKey: ["call", id],
    queryFn: () => unwrap(api.GET("/api/calls/{id}", { params: { path: { id: id ?? "" } } })),
    enabled: Boolean(id),
    ...one,
  });

export const useAudit = (s: ListSearch) =>
  useQuery({ queryKey: ["audit", s], queryFn: () => unwrap(api.GET("/api/audit", { params: { query: listQuery(s) } })), ...list });
export const useDiscovered = (s: ListSearch) =>
  useQuery({
    queryKey: ["discovery", "items", s],
    queryFn: () => unwrap(api.GET("/api/discovery/items", { params: { query: listQuery(s) } })),
    ...list,
  });
export const useEndpoints = (s: ListSearch) =>
  useQuery({
    queryKey: ["discovery", "endpoints", s],
    queryFn: () => unwrap(api.GET("/api/discovery/endpoints", { params: { query: listQuery(s) } })),
    ...list,
  });
export const useCatalogue = (s: ListSearch) =>
  useQuery({ queryKey: ["catalogue", s], queryFn: () => unwrap(api.GET("/api/catalogue", { params: { query: listQuery(s) } })), ...list });
export const useMembers = (s: ListSearch) =>
  useQuery({ queryKey: ["members", s], queryFn: () => unwrap(api.GET("/api/members", { params: { query: listQuery(s) } })), ...list });
export const useNotifications = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: () => unwrap(api.GET("/api/notifications", { params: { query: { page: 1, pageSize: 50 } } })),
    ...one,
  });

export const requestIdOf = (error: unknown) => (error instanceof ApiError ? error.requestId : "unavailable");
