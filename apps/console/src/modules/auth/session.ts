import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { Schemas } from "@agentvault/api-client";
import { api } from "../../api";

export type Session = Schemas["Session"];

/** The current session, or null when signed out (or the API is unreachable). */
export const sessionQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: async (): Promise<Session | null> => {
    try {
      const { data, response } = await api.GET("/api/auth/session");
      return response.ok && data ? data : null;
    } catch {
      return null;
    }
  },
  staleTime: 60_000,
  retry: false,
});

/** Where to land after sign-in when no (valid) redirect was requested. */
export const DEFAULT_AFTER_SIGN_IN = "/portal";

/**
 * Only same-site paths are accepted as redirect targets (no "//host", no scheme, no loop back to
 * the sign-in pages), so the sign-in page cannot be used as an open redirect.
 */
export function safeRedirect(target: string | undefined | null): string {
  if (!target || !target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) {
    return DEFAULT_AFTER_SIGN_IN;
  }
  if (target === "/login" || target.startsWith("/login/") || target.startsWith("/login?")) return DEFAULT_AFTER_SIGN_IN;
  return target;
}

/** Route guard for /app and /portal. */
export async function requireSession({
  context,
  location,
}: {
  context: { queryClient: QueryClient };
  location: { href: string };
}) {
  const session = await context.queryClient.ensureQueryData(sessionQueryOptions);
  if (!session) throw redirect({ to: "/login", search: { redirect: location.href } });
  return { session };
}

/** SSO round trip: what we stored before leaving for the identity provider. */
export interface PendingSso {
  state: string;
  redirect: string;
  providerName: string;
}
const SSO_KEY = "av.sso.pending";

export function savePendingSso(pending: PendingSso) {
  try {
    sessionStorage.setItem(SSO_KEY, JSON.stringify(pending));
  } catch {
    // storage blocked: the callback will report a state mismatch
  }
}

export function takePendingSso(): PendingSso | null {
  try {
    const raw = sessionStorage.getItem(SSO_KEY);
    sessionStorage.removeItem(SSO_KEY);
    return raw ? (JSON.parse(raw) as PendingSso) : null;
  } catch {
    return null;
  }
}

/** True when the console runs on the mock API (dev or demo deploy): show demo credentials. */
export const isMockAuth = import.meta.env.DEV || import.meta.env.VITE_MOCK_API === "true";
