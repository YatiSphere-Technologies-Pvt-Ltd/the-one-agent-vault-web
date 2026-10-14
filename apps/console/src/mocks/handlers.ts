import { delay, http, HttpResponse } from "msw";
import type { Schemas } from "@agentvault/api-client";
import {
  audit,
  calls,
  catalogue,
  discovered,
  endpoints,
  members,
  notifications,
  reviews,
  servers,
  skills,
} from "./db";
import { readScenario } from "./scenario";

// Development mocks for the API in packages/api-client/openapi.yaml. List endpoints implement
// server-side search, status filter, sort and pagination, like the real API.

type Row = Record<string, unknown>;

function requestId() {
  return `req_${Math.random().toString(16).slice(2, 10)}`;
}

/** Applies the dev scenario: latency, forced errors, forced empty lists. */
async function scenario(): Promise<{ empty: boolean; error: Response | null }> {
  const s = readScenario();
  await delay(s === "slow" ? 2500 : 250);
  if (s === "error") {
    return {
      empty: false,
      error: HttpResponse.json<Schemas["Problem"]>(
        { title: "Service unavailable", detail: "Mock scenario: error", requestId: requestId() },
        { status: 503 },
      ),
    };
  }
  return { empty: s === "empty", error: null };
}

function list<T extends Row>(rows: T[], url: URL, searchFields: (keyof T)[], empty: boolean) {
  const q = url.searchParams.get("q")?.trim().toLowerCase();
  const status = url.searchParams.get("status");
  const sort = url.searchParams.get("sort");
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") ?? 20) || 20));

  let result = empty ? [] : rows;
  if (q) result = result.filter((r) => searchFields.some((f) => String(r[f] ?? "").toLowerCase().includes(q)));
  if (status) result = result.filter((r) => r.status === status || r.decision === status);
  if (sort) {
    const [field, dir] = sort.split(":");
    if (field) {
      result = [...result].sort((a, b) => {
        const x = a[field];
        const y = b[field];
        const order = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
        return dir === "desc" ? -order : order;
      });
    }
  }
  return {
    items: result.slice((page - 1) * pageSize, page * pageSize),
    total: result.length,
    page,
    pageSize,
  };
}

const notFound = () =>
  HttpResponse.json<Schemas["Problem"]>({ title: "Not found", requestId: requestId() }, { status: 404 });

const serverById = (id: string) => servers.find((s) => s.server.id === id);
const skillById = (id: string) => skills.find((s) => s.skill.id === id);
const summary = (s: (typeof servers)[number]): Schemas["Server"] => {
  const { endpointUrl: _e, pinned: _p, served: _s, users: _u, createdAt: _c, ...rest } = s.server;
  return rest;
};

export const handlers = [
  http.get("/api/licence", () => HttpResponse.json<Schemas["Licence"]>({ plan: "Enterprise", releases: ["R1"] })),
  http.get("/api/me", () =>
    HttpResponse.json<Schemas["Me"]>({
      id: "usr-1",
      name: "Priya Raman",
      email: "priya.raman@example.com",
      workspaces: [{ id: "ws-default", name: "Default workspace" }],
    }),
  ),
  http.get("/api/inbox/counts", () =>
    HttpResponse.json<Schemas["InboxCounts"]>({
      reviews: reviews.filter((r) => r.status !== "changesRequested").length,
      approvals: calls.filter((c) => c.decision === "requiresApproval").length,
      notifications: notifications.filter((n) => !n.read).length,
    }),
  ),

  http.get("/api/home", async () => {
    const { error, empty } = await scenario();
    if (error) return error;
    const today = new Date().toISOString().slice(0, 10);
    const todays = calls.filter((c) => c.time.startsWith(today));
    return HttpResponse.json<Schemas["HomeSummary"]>({
      servers: empty ? 0 : servers.length,
      skills: empty ? 0 : skills.length,
      brokenSeals: empty ? 0 : servers.filter((s) => s.server.sealState === "broken").length,
      pendingReviews: empty ? 0 : reviews.length,
      heldCalls: empty ? 0 : calls.filter((c) => c.decision === "requiresApproval").length,
      callsToday: empty ? 0 : todays.length,
      blockedToday: empty ? 0 : todays.filter((c) => c.decision === "blocked" || c.decision === "denied").length,
      attention: empty
        ? []
        : servers.filter((s) => s.server.sealState === "broken" || s.server.status === "blocked").map(summary),
      recentCalls: empty ? [] : calls.slice(0, 8),
    });
  }),

  http.get("/api/servers", async ({ request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    return HttpResponse.json(list(servers.map(summary), new URL(request.url), ["name", "description", "owner"], empty));
  }),
  http.get("/api/servers/:id", async ({ params }) => {
    const { error } = await scenario();
    if (error) return error;
    const s = serverById(String(params.id));
    return s ? HttpResponse.json<Schemas["ServerDetail"]>(s.server) : notFound();
  }),
  http.get("/api/servers/:id/tools", async ({ params, request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    const s = serverById(String(params.id));
    if (!s) return notFound();
    return HttpResponse.json(list(s.tools, new URL(request.url), ["name", "description"], empty));
  }),
  http.get("/api/servers/:id/versions", async ({ params, request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    const s = serverById(String(params.id));
    if (!s) return notFound();
    return HttpResponse.json(list(s.versions, new URL(request.url), ["summary"], empty));
  }),

  http.get("/api/skills", async ({ request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    return HttpResponse.json(list(skills.map((s) => s.skill), new URL(request.url), ["name", "description", "author"], empty));
  }),
  http.get("/api/skills/:id", async ({ params }) => {
    const { error } = await scenario();
    if (error) return error;
    const s = skillById(String(params.id));
    return s ? HttpResponse.json<Schemas["Skill"]>(s.skill) : notFound();
  }),
  http.get("/api/skills/:id/files", async ({ params }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    const s = skillById(String(params.id));
    return s ? HttpResponse.json<Schemas["SkillFileList"]>({ items: empty ? [] : s.files }) : notFound();
  }),
  http.get("/api/skills/:id/findings", async ({ params, request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    const s = skillById(String(params.id));
    if (!s) return notFound();
    return HttpResponse.json(list(s.findings, new URL(request.url), ["rule", "file", "message"], empty));
  }),
  http.get("/api/skills/:id/versions", async ({ params }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    const s = skillById(String(params.id));
    return s ? HttpResponse.json<Schemas["SkillVersionList"]>({ items: empty ? [] : s.versions }) : notFound();
  }),

  http.get("/api/reviews", async ({ request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    return HttpResponse.json(list(reviews, new URL(request.url), ["objectName", "requestedBy"], empty));
  }),

  http.get("/api/calls", async ({ request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    const url = new URL(request.url);
    const serverId = url.searchParams.get("serverId");
    const rows = (serverId ? calls.filter((c) => c.serverId === serverId) : calls).map(
      ({ request: _r, response: _s, policy: _p, ...call }) => call,
    );
    return HttpResponse.json(list(rows, url, ["user", "server", "tool", "client"], empty));
  }),
  http.get("/api/calls/:id", async ({ params }) => {
    const { error } = await scenario();
    if (error) return error;
    const call = calls.find((c) => c.id === params.id);
    return call ? HttpResponse.json<Schemas["CallDetail"]>(call) : notFound();
  }),

  http.get("/api/audit", async ({ request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    return HttpResponse.json(list(audit, new URL(request.url), ["actor", "action", "target"], empty));
  }),
  http.get("/api/discovery/items", async ({ request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    return HttpResponse.json(list(discovered, new URL(request.url), ["name", "source"], empty));
  }),
  http.get("/api/discovery/endpoints", async ({ request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    return HttpResponse.json(list(endpoints, new URL(request.url), ["hostname", "user", "os"], empty));
  }),
  http.get("/api/catalogue", async ({ request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    return HttpResponse.json(list(catalogue, new URL(request.url), ["name", "description", "owner"], empty));
  }),
  http.get("/api/members", async ({ request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    return HttpResponse.json(list(members, new URL(request.url), ["name", "email", "role"], empty));
  }),
  http.get("/api/notifications", async ({ request }) => {
    const { error, empty } = await scenario();
    if (error) return error;
    return HttpResponse.json(list(notifications, new URL(request.url), ["title"], empty));
  }),
];
