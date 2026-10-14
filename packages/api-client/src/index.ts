import createClient from "openapi-fetch";
import type { components, paths } from "./schema";

export type { components, paths };
export type Schemas = components["schemas"];

/** Typed API client. Screens use this through TanStack Query; never hand-written fetch calls. */
export function createApiClient(baseUrl = "") {
  return createClient<paths>({ baseUrl, credentials: "include" });
}

export type ApiClient = ReturnType<typeof createApiClient>;
