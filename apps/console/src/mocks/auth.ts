// Mock authentication API. Mirrors a real OIDC/SAML-backed service closely enough that the
// console code does not change when the real API arrives. Session survives reloads via storage.
import { delay, http, HttpResponse } from "msw";
import type { Schemas } from "@agentvault/api-client";
import { storage } from "@agentvault/ui";

type Provider = Schemas["AuthProvider"];

const providers: Provider[] = [
  { id: "entra", name: "Microsoft Entra ID", kind: "oidc" },
  { id: "okta", name: "Okta", kind: "oidc" },
  { id: "google", name: "Google Workspace", kind: "oidc" },
  { id: "saml", name: "SAML single sign-on", kind: "saml" },
];

/** Home-realm discovery: work-email domain → identity provider. */
const ssoDomains: Record<string, Provider["id"]> = { "example.com": "okta", "fabrikam.com": "entra" };

const priya: Schemas["Me"] = {
  id: "usr-1",
  name: "Priya Raman",
  email: "priya.raman@example.com",
  workspaces: [{ id: "ws-default", name: "Default workspace" }],
};

/** Demo accounts. Shown on the sign-in page in mock mode only. */
export const DEMO_PASSWORD = "Vault-demo-2026";
const accounts = [
  { logins: ["priya.raman@example.com", "priya"], password: DEMO_PASSWORD, user: priya, locked: false },
  { logins: ["locked@example.com"], password: DEMO_PASSWORD, user: { ...priya, id: "usr-2", name: "Locked User", email: "locked@example.com" }, locked: true },
];

const MAX_ATTEMPTS = 5;
const failures = new Map<string, number>();
const SESSION_KEY = "av.mock.session";

// Typed as a plain Response so handlers can return either a problem or their success body.
const problem = (status: number, title: string, detail?: string): Response =>
  HttpResponse.json<Schemas["Problem"]>(
    { title, ...(detail ? { detail } : {}), requestId: `req_${Math.random().toString(16).slice(2, 10)}` },
    { status },
  );

function startSession(user: Schemas["Me"], method: "password" | "sso", provider: string | null, remember: boolean) {
  const hours = remember ? 24 * 30 : 8;
  const session: Schemas["Session"] = {
    user,
    method,
    provider,
    expiresAt: new Date(Date.now() + hours * 3_600_000).toISOString(),
  };
  storage.set(SESSION_KEY, JSON.stringify(session));
  return session;
}

function currentSession(): Schemas["Session"] | null {
  try {
    const session = JSON.parse(storage.get(SESSION_KEY) ?? "null") as Schemas["Session"] | null;
    return session && new Date(session.expiresAt).getTime() > Date.now() ? session : null;
  } catch {
    return null;
  }
}

const random = () => Math.random().toString(36).slice(2, 12);

export const authHandlers = [
  http.get("/api/auth/providers", () =>
    HttpResponse.json<Schemas["AuthProviders"]>({ providers, passwordEnabled: true }),
  ),

  http.get("/api/auth/session", () => {
    const session = currentSession();
    return session ? HttpResponse.json(session) : problem(401, "Not signed in");
  }),

  http.post("/api/auth/login", async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as Schemas["LoginRequest"];
    const login = body.username.trim().toLowerCase();
    const account = accounts.find((a) => a.logins.includes(login));
    if (account?.locked || (failures.get(login) ?? 0) >= MAX_ATTEMPTS) {
      return problem(423, "Account locked", "Too many attempts. Try again in 15 minutes or reset your password.");
    }
    if (!account || account.password !== body.password) {
      failures.set(login, (failures.get(login) ?? 0) + 1);
      // Same message whether or not the account exists.
      return problem(401, "Email or password is incorrect");
    }
    failures.delete(login);
    return HttpResponse.json(startSession(account.user, "password", null, body.remember ?? false));
  }),

  http.post("/api/auth/sso/start", async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Schemas["SsoStartRequest"];
    let providerId = body.provider;
    if (!providerId && body.email) {
      const domain = body.email.trim().toLowerCase().split("@")[1] ?? "";
      providerId = ssoDomains[domain];
    }
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return problem(404, "Single sign-on is not set up for this domain");
    const state = random();
    // A real API returns the identity provider's authorize URL. The mock "provider" approves at once
    // and sends the browser straight back to the callback, as the provider would after sign-in.
    const authorizeUrl = `/login/callback?code=mock-${provider.id}-${random()}&state=${state}`;
    return HttpResponse.json<Schemas["SsoStart"]>({ authorizeUrl, state, providerName: provider.name });
  }),

  http.post("/api/auth/sso/callback", async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as Schemas["SsoCallbackRequest"];
    const match = /^mock-([a-z]+)-/.exec(body.code);
    const provider = providers.find((p) => p.id === match?.[1]);
    if (!provider || !body.state) return problem(400, "The sign-in response was not valid");
    return HttpResponse.json(startSession(priya, "sso", provider.name, true));
  }),

  http.post("/api/auth/logout", () => {
    storage.set(SESSION_KEY, "null");
    return new HttpResponse(null, { status: 204 });
  }),

  http.post("/api/auth/password-reset", async () => {
    await delay(400);
    return new HttpResponse(null, { status: 202 });
  }),
];
