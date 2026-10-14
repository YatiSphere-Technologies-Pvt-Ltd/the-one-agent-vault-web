// Every screen in the UX specification: ID, route, release. The single source for placeholders,
// the command palette, feature flags and the e2e smoke test.

export type Release = "R1" | "R2" | "R3";
export type ScreenKind = "page" | "tab" | "drawer" | "modal" | "overlay";

export interface ScreenDef {
  id: string;
  /** Route pattern as written in the spec. */
  route: string;
  /** A concrete URL that renders the screen (used by the palette and the smoke test). */
  sample: string;
  release: Release;
  kind: ScreenKind;
  area: "shell" | "portal" | "servers" | "reviews" | "skills" | "discovery" | "activity" | "settings";
}

export const screens = [
  { id: "SH-01", route: "/login", sample: "/login", release: "R1", kind: "page", area: "shell" },
  { id: "SH-02", route: "/app/setup", sample: "/app/setup", release: "R1", kind: "page", area: "shell" },
  { id: "SH-03", route: "/app", sample: "/app", release: "R1", kind: "page", area: "shell" },
  { id: "SH-04", route: "⌘K / Ctrl K", sample: "/app", release: "R1", kind: "overlay", area: "shell" },
  { id: "SH-05", route: "/app/notifications", sample: "/app/notifications", release: "R1", kind: "page", area: "shell" },
  { id: "SH-06", route: "/app/me", sample: "/app/me", release: "R1", kind: "page", area: "shell" },
  { id: "PT-01", route: "/portal", sample: "/portal", release: "R1", kind: "page", area: "portal" },
  { id: "PT-02", route: "/portal/servers/:id", sample: "/portal/servers/srv-salesforce", release: "R1", kind: "page", area: "portal" },
  { id: "PT-03", route: "?request=1", sample: "/portal/servers/srv-salesforce?request=1", release: "R1", kind: "drawer", area: "portal" },
  { id: "PT-04", route: "/portal/me", sample: "/portal/me", release: "R1", kind: "page", area: "portal" },
  { id: "PT-05", route: "/portal/setup", sample: "/portal/setup", release: "R1", kind: "page", area: "portal" },
  { id: "MC-01", route: "/app/servers", sample: "/app/servers", release: "R1", kind: "page", area: "servers" },
  { id: "MC-02", route: "/app/servers/new", sample: "/app/servers/new", release: "R1", kind: "page", area: "servers" },
  { id: "MC-03", route: "/app/servers/:id", sample: "/app/servers/srv-salesforce", release: "R1", kind: "tab", area: "servers" },
  { id: "MC-04", route: "/app/servers/:id/tools", sample: "/app/servers/srv-salesforce/tools", release: "R1", kind: "tab", area: "servers" },
  { id: "MC-05", route: "/app/servers/:id/versions", sample: "/app/servers/srv-salesforce/versions", release: "R1", kind: "tab", area: "servers" },
  { id: "MC-06", route: "/app/servers/:id/access", sample: "/app/servers/srv-salesforce/access", release: "R1", kind: "tab", area: "servers" },
  { id: "MC-07", route: "/app/servers/:id/credentials", sample: "/app/servers/srv-salesforce/credentials", release: "R1", kind: "tab", area: "servers" },
  { id: "MC-08", route: "/app/servers/:id/activity", sample: "/app/servers/srv-salesforce/activity", release: "R1", kind: "tab", area: "servers" },
  { id: "RV-01", route: "/app/reviews", sample: "/app/reviews", release: "R1", kind: "page", area: "reviews" },
  { id: "RV-02", route: "/app/reviews/:id", sample: "/app/reviews/rev-srv-101", release: "R1", kind: "page", area: "reviews" },
  { id: "RV-03", route: "/app/reviews/:id", sample: "/app/reviews/rev-skl-202", release: "R1", kind: "page", area: "reviews" },
  { id: "MC-09", route: "/app/virtual-servers", sample: "/app/virtual-servers", release: "R1", kind: "page", area: "servers" },
  { id: "MC-10", route: "/app/policies", sample: "/app/policies", release: "R1", kind: "page", area: "servers" },
  { id: "MC-11", route: "/app/approvals", sample: "/app/approvals", release: "R2", kind: "page", area: "reviews" },
  { id: "MC-12", route: "/app/approvals/:id", sample: "/app/approvals/apr-301", release: "R2", kind: "page", area: "reviews" },
  { id: "MC-13", route: "/app/activity/calls", sample: "/app/activity/calls", release: "R1", kind: "page", area: "activity" },
  { id: "MC-14", route: "?call=<id>", sample: "/app/activity/calls?call=call-9001", release: "R1", kind: "drawer", area: "activity" },
  { id: "MC-15", route: "/app/endpoints", sample: "/app/endpoints", release: "R1", kind: "page", area: "servers" },
  { id: "MC-16", route: "?killswitch=1", sample: "/app/servers/srv-salesforce?killswitch=1", release: "R1", kind: "modal", area: "servers" },
  { id: "MC-17", route: "/app/servers/new?type=hosted", sample: "/app/servers/new?type=hosted", release: "R2", kind: "page", area: "servers" },
  { id: "SK-01", route: "/app/skills", sample: "/app/skills", release: "R1", kind: "page", area: "skills" },
  { id: "SK-02", route: "/app/skills/new", sample: "/app/skills/new", release: "R1", kind: "page", area: "skills" },
  { id: "SK-03", route: "/app/skills/:id", sample: "/app/skills/skl-summarise", release: "R1", kind: "tab", area: "skills" },
  { id: "SK-04", route: "/app/skills/:id/files", sample: "/app/skills/skl-summarise/files", release: "R1", kind: "tab", area: "skills" },
  { id: "SK-05", route: "/app/skills/:id/findings", sample: "/app/skills/skl-summarise/findings", release: "R1", kind: "tab", area: "skills" },
  { id: "SK-06", route: "/app/skills/:id/versions", sample: "/app/skills/skl-summarise/versions", release: "R1", kind: "tab", area: "skills" },
  { id: "SK-07", route: "/app/skills/:id/distribution", sample: "/app/skills/skl-summarise/distribution", release: "R1", kind: "tab", area: "skills" },
  { id: "SK-08", route: "/app/skill-packs", sample: "/app/skill-packs", release: "R2", kind: "page", area: "skills" },
  { id: "SK-09", route: "/app/skills/fleet", sample: "/app/skills/fleet", release: "R1", kind: "page", area: "skills" },
  { id: "DS-01", route: "/app/discovery", sample: "/app/discovery", release: "R1", kind: "page", area: "discovery" },
  { id: "DS-02", route: "/app/discovery/:id", sample: "/app/discovery/dsc-77", release: "R2", kind: "page", area: "discovery" },
  { id: "DS-03", route: "/app/discovery/endpoints", sample: "/app/discovery/endpoints", release: "R1", kind: "page", area: "discovery" },
  { id: "DS-04", route: "/app/posture", sample: "/app/posture", release: "R3", kind: "page", area: "discovery" },
  { id: "AD-01", route: "/app/settings/org", sample: "/app/settings/org", release: "R1", kind: "page", area: "settings" },
  { id: "AD-02", route: "/app/settings/workspaces", sample: "/app/settings/workspaces", release: "R1", kind: "page", area: "settings" },
  { id: "AD-03", route: "/app/settings/members", sample: "/app/settings/members", release: "R1", kind: "page", area: "settings" },
  { id: "AD-04", route: "/app/settings/roles", sample: "/app/settings/roles", release: "R1", kind: "page", area: "settings" },
  { id: "AD-05", route: "/app/settings/identity", sample: "/app/settings/identity", release: "R1", kind: "page", area: "settings" },
  { id: "AD-06", route: "/app/settings/api-keys", sample: "/app/settings/api-keys", release: "R1", kind: "page", area: "settings" },
  { id: "AD-07", route: "/app/audit", sample: "/app/audit", release: "R1", kind: "page", area: "activity" },
  { id: "AD-08", route: "/app/settings/security", sample: "/app/settings/security", release: "R2", kind: "page", area: "settings" },
  { id: "AD-09", route: "/app/settings/dlp", sample: "/app/settings/dlp", release: "R1", kind: "page", area: "settings" },
  { id: "AD-10", route: "/app/settings/integrations", sample: "/app/settings/integrations", release: "R1", kind: "page", area: "settings" },
  { id: "AD-11", route: "/app/settings/gateways", sample: "/app/settings/gateways", release: "R2", kind: "page", area: "settings" },
  { id: "AD-12", route: "/app/settings/licence", sample: "/app/settings/licence", release: "R2", kind: "page", area: "settings" },
] as const satisfies readonly ScreenDef[];

export type ScreenId = (typeof screens)[number]["id"];

export const screenById = Object.fromEntries(screens.map((s) => [s.id, s])) as Record<ScreenId, ScreenDef>;
