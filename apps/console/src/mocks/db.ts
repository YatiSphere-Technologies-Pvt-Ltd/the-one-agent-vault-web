// Seeded mock database for development. Deterministic: the same seed gives the same data on
// every reload. Times are relative to page load so the console always looks "live".
import type { Schemas } from "@agentvault/api-client";

type Status = Schemas["Status"];

// ---- deterministic random --------------------------------------------------------------------
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261014);
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const pick = <T,>(list: readonly T[]): T => list[Math.floor(rand() * list.length)] as T;
const weighted = <T,>(entries: readonly (readonly [T, number])[]): T => {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [value, w] of entries) {
    r -= w;
    if (r <= 0) return value;
  }
  return entries[0]![0];
};
const hex = (n: number) => Array.from({ length: n }, () => Math.floor(rand() * 16).toString(16)).join("");
const sha = () => `sha256:${hex(64)}`;

const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const ago = (ms: number) => new Date(NOW - ms).toISOString();

// ---- people ------------------------------------------------------------------------------------
const people = [
  "Priya Raman", "Amara Okafor", "Jonah Fischer", "Lena Park", "Mateo Alvarez", "Sofia Rossi",
  "Kenji Watanabe", "Noor Haddad", "Elias Berg", "Chloé Martin", "Arjun Mehta", "Grace Liu",
  "Tomás Silva", "Hannah Weber", "Yusuf Demir", "Ines Duarte", "Oliver Grant", "Mira Kovač",
  "Daniel Osei", "Freya Lindqvist", "Ravi Shankar", "Zara Ahmed", "Lucas Moreau", "Ana Petrović",
];
const emailOf = (name: string) =>
  `${name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, ".")}@example.com`;
const clients = ["Claude Desktop", "Claude Code", "Cursor", "VS Code", "Sales ops agent", "Support triage agent", "Pipeline sync"];
const gateways = ["gw-eu-west-1", "gw-us-east-2", "gw-ap-south-1"];

// ---- servers ----------------------------------------------------------------------------------
const serverSeeds: [string, string, string[]][] = [
  ["salesforce-crm", "Read and update accounts, opportunities and contacts in Salesforce.", ["create_record", "update_opportunity", "export_report", "search_accounts", "get_contact", "list_opportunities", "log_activity", "get_pipeline", "merge_accounts", "list_campaigns", "get_quote", "close_case"]],
  ["github", "Repositories, issues and pull requests in the company GitHub organisation.", ["search_code", "create_issue", "comment_on_pr", "list_pull_requests", "get_file", "create_branch", "merge_pull_request"]],
  ["jira-cloud", "Search, create and transition Jira issues.", ["search_issues", "create_issue", "transition_issue", "add_comment", "get_issue"]],
  ["confluence", "Read and search Confluence spaces.", ["search_pages", "get_page", "list_spaces"]],
  ["snowflake-analytics", "Run read-only SQL against the analytics warehouse.", ["run_query", "list_tables", "describe_table", "export_csv"]],
  ["google-drive", "Search and read files in shared drives.", ["search_files", "read_file", "list_folder", "share_file"]],
  ["slack", "Post messages and read channel history.", ["post_message", "read_channel", "search_messages", "list_channels", "upload_file"]],
  ["zendesk", "Tickets, users and macros in Zendesk.", ["get_ticket", "update_ticket", "search_tickets", "apply_macro"]],
  ["postgres-orders", "Read-only access to the orders database replica.", ["run_query", "list_tables"]],
  ["stripe-billing", "Invoices, subscriptions and refunds.", ["get_invoice", "list_subscriptions", "issue_refund", "get_customer"]],
  ["hubspot-marketing", "Contacts, lists and campaign stats.", ["get_contact", "list_campaigns", "add_to_list"]],
  ["servicenow-itsm", "Incidents and change requests.", ["create_incident", "get_incident", "list_changes", "approve_change"]],
  ["workday-hr", "Employee directory and time-off balances.", ["get_employee", "search_directory", "get_time_off"]],
  ["aws-cost-explorer", "Cost and usage reports.", ["get_costs", "forecast", "list_accounts"]],
  ["datadog", "Metrics, monitors and incidents.", ["query_metrics", "list_monitors", "mute_monitor", "get_incident"]],
  ["notion-wiki", "Pages and databases in Notion.", ["search", "get_page", "update_page"]],
  ["sharepoint-legal", "Contracts library for the legal team.", ["search_documents", "get_document"]],
  ["okta-admin", "Users, groups and app assignments.", ["get_user", "list_groups", "assign_app", "suspend_user"]],
  ["figma", "Read design files and comments.", ["get_file", "list_comments"]],
  ["linear", "Issues and cycles in Linear.", ["create_issue", "search_issues", "list_cycles"]],
  ["pagerduty", "On-call schedules and incidents.", ["list_oncall", "trigger_incident", "ack_incident"]],
  ["box-finance", "Finance team documents in Box.", ["search", "download"]],
  ["internal-pricing-api", "Pricing calculator for quotes.", ["price_quote", "list_skus"]],
  ["gong-calls", "Sales call transcripts and summaries.", ["search_calls", "get_transcript"]],
  ["filesystem-local", "Local filesystem access (unmanaged, found on endpoints).", ["read_file", "write_file", "list_directory"]],
  ["web-fetch", "Fetch arbitrary URLs.", ["fetch"]],
  ["sentry", "Errors and releases.", ["list_issues", "get_event", "resolve_issue"]],
  ["intercom-support", "Conversations and help centre articles.", ["search_conversations", "reply", "get_article"]],
];

const serverStatus = (i: number): Status =>
  i === 0
    ? "heldDefinitionChanged"
    : weighted<Status>([
        ["approved", 14],
        ["heldDefinitionChanged", 2],
        ["inReview", 3],
        ["disabled", 1],
        ["blocked", 1],
        ["draft", 1],
        ["unmanaged", 1],
      ]);
const sealFor = (status: Status): Schemas["SealState"] =>
  status === "heldDefinitionChanged" ? "broken" : status === "blocked" ? "revoked" : status === "approved" || status === "disabled" ? "intact" : "pending";

export interface ServerRecord {
  server: Schemas["ServerDetail"];
  tools: Schemas["Tool"][];
  versions: Schemas["Version"][];
}

export const servers: ServerRecord[] = serverSeeds.map(([name, description, toolNames], i) => {
  const status = serverStatus(i);
  const sealState = sealFor(status);
  const pinnedVersion = int(1, 9);
  const changedCount = sealState === "broken" ? (i === 0 ? 3 : int(1, Math.min(3, toolNames.length))) : 0;
  const tools: Schemas["Tool"][] = toolNames.map((tool, t) => {
    const changed = t < changedCount;
    return {
      name: tool,
      description: `${tool.replace(/_/g, " ")} on ${name}.`,
      risk: changed ? int(40, 85) : int(5, 55),
      status: changed ? (t === 2 ? "requiresApproval" : "modified") : "approved",
      changed,
      callsLast24h: int(0, 900),
    };
  });
  const pinnedHash = sha();
  const versions: Schemas["Version"][] = Array.from({ length: pinnedVersion }, (_, v) => {
    const version = pinnedVersion - v;
    return {
      version,
      hash: v === 0 ? pinnedHash : sha(),
      status: v === 0 ? "approved" : "deprecated",
      approvedBy: pick(people),
      approvedAt: ago(v * int(10, 40) * DAY + int(1, 9) * DAY),
      toolCount: Math.max(1, toolNames.length - v),
      summary: v === pinnedVersion - 1 ? "First approved definition" : pick(["Added tools", "Tightened input schemas", "Description updates", "Removed a deprecated tool", "New required parameter"]),
    };
  });
  const pinnedApproved = versions[0]!;
  const gateway = pick(gateways);
  return {
    tools,
    versions,
    server: {
      id: `srv-${name}`,
      name,
      description,
      owner: pick(people),
      transport: pick(["http", "http", "sse", "stdio"] as const),
      status,
      sealState,
      hash: sealState === "broken" ? sha() : pinnedHash,
      pinnedVersion,
      toolCount: toolNames.length,
      risk: i === 0 ? 62 : Math.max(...tools.map((t) => t.risk)),
      gateway,
      callsLast24h: tools.reduce((s, t) => s + t.callsLast24h, 0),
      updatedAt: ago(int(5, 60 * 24 * 20) * MIN),
      endpointUrl: `https://mcp.internal.example.com/${name}`,
      pinned: {
        hash: pinnedHash,
        version: pinnedVersion,
        approvedAt: pinnedApproved.approvedAt,
        approvedBy: pinnedApproved.approvedBy,
        toolCount: toolNames.length,
      },
      served:
        sealState === "broken"
          ? { hash: sha(), seenAt: ago(int(10, 300) * MIN), gateway, changedCount }
          : null,
      users: int(5, 420),
      createdAt: ago(int(60, 400) * DAY),
    },
  };
});

// ---- skills -------------------------------------------------------------------------------------
const skillSeeds: [string, string][] = [
  ["summarise-meeting", "Summarise a meeting transcript into decisions and actions."],
  ["draft-customer-email", "Draft a reply to a customer from a support ticket."],
  ["pdf-extract", "Extract tables and text from PDF files."],
  ["sql-review", "Review SQL for correctness and performance."],
  ["release-notes", "Write release notes from merged pull requests."],
  ["contract-redline", "Suggest redlines for supplier contracts."],
  ["brand-voice", "Rewrite copy in the company brand voice."],
  ["incident-postmortem", "Draft a blameless postmortem from incident notes."],
  ["spreadsheet-clean", "Clean and normalise spreadsheet data."],
  ["code-migration", "Migrate code between framework versions."],
  ["expense-check", "Check expense reports against policy."],
  ["onboarding-plan", "Create a 30-60-90 day onboarding plan."],
  ["security-questionnaire", "Answer vendor security questionnaires from the trust centre."],
  ["slide-outline", "Outline a slide deck from a brief."],
  ["translate-docs", "Translate documentation, keeping terminology."],
  ["test-writer", "Write unit tests for a module."],
  ["data-dictionary", "Generate a data dictionary from a schema."],
  ["okr-draft", "Draft team OKRs from strategy notes."],
];
export interface SkillRecord {
  skill: Schemas["Skill"];
  files: Schemas["SkillFile"][];
  findings: Schemas["Finding"][];
  versions: Schemas["SkillVersion"][];
}
const rules = [
  ["prompt-injection", "Instruction tells the model to ignore prior instructions"],
  ["network-egress", "Script makes outbound requests to an unlisted host"],
  ["secret-in-file", "Possible API key committed in file"],
  ["shell-exec", "Script runs shell commands with user-provided input"],
  ["broad-file-access", "Reads files outside the skill directory"],
  ["unpinned-dependency", "Dependency installed without a pinned version"],
] as const;
export const skills: SkillRecord[] = skillSeeds.map(([name, description], i) => {
  const status = weighted<Status>([["approved", 10], ["inReview", 3], ["changesRequested", 1], ["heldDefinitionChanged", 1], ["draft", 1], ["blocked", 1]]);
  const sealState = sealFor(status);
  const fileCount = int(2, 7);
  const files: Schemas["SkillFile"][] = [
    { path: "SKILL.md", size: int(800, 6000), kind: "instructions" as const },
    ...Array.from({ length: fileCount }, (_, f) =>
      pick([
        { path: `scripts/${["extract", "format", "check", "run"][f % 4]}.py`, size: int(400, 9000), kind: "script" as const },
        { path: `reference/${["style", "examples", "glossary", "policy"][f % 4]}.md`, size: int(300, 12000), kind: "reference" as const },
        { path: `assets/template-${f}.docx`, size: int(9000, 90000), kind: "asset" as const },
      ]),
    ),
  ].filter((file, idx, all) => all.findIndex((x) => x.path === file.path) === idx);
  const findings: Schemas["Finding"][] = Array.from({ length: status === "approved" ? int(0, 2) : int(1, 6) }, (_, f) => {
    const [rule, message] = pick(rules);
    return {
      id: `fnd-${i}-${f}`,
      severity: weighted([["critical", 1], ["high", 2], ["medium", 3], ["low", 4]] as const),
      rule,
      file: pick(files).path,
      line: int(1, 220),
      message,
      status: weighted<Status>([["pending", 3], ["acceptedRisk", 1], ["resolved", 2]]),
    };
  });
  const count = (s: Schemas["Finding"]["severity"]) => findings.filter((x) => x.severity === s && x.status !== "resolved").length;
  const major = int(1, 3);
  const minor = int(0, 6);
  const versions: Schemas["SkillVersion"][] = Array.from({ length: minor + 1 }, (_, v) => ({
    version: `${major}.${minor - v}.0`,
    hash: sha(),
    status: v === 0 ? status : "deprecated",
    publishedAt: ago((v * int(5, 20) + int(0, 4)) * DAY),
    publishedBy: pick(people),
    summary: pick(["Initial release", "Clearer instructions", "New reference file", "Script hardening", "Fixed formatting", "Added examples"]),
  }));
  return {
    files,
    findings,
    versions,
    skill: {
      id: `skl-${name}`,
      name,
      description,
      author: pick(people),
      source: `git@github.com:example/skills.git#${name}`,
      version: versions[0]!.version,
      status,
      sealState,
      hash: versions[0]!.hash,
      risk: Math.min(100, count("critical") * 30 + count("high") * 15 + count("medium") * 6 + int(3, 20)),
      findings: { critical: count("critical"), high: count("high"), medium: count("medium"), low: count("low") },
      installs: int(0, 640),
      updatedAt: versions[0]!.publishedAt,
    },
  };
});

// ---- reviews ------------------------------------------------------------------------------------
export const reviews: Schemas["Review"][] = [
  ...servers
    .filter((s) => ["heldDefinitionChanged", "inReview"].includes(s.server.status))
    .map((s, i) => ({
      id: `rev-srv-${101 + i}`,
      kind: "server" as const,
      objectId: s.server.id,
      objectName: s.server.name,
      reason: s.server.status === "heldDefinitionChanged" ? ("definitionChange" as const) : ("newServer" as const),
      requestedBy: pick(people),
      requestedAt: ago(int(20, 60 * 72) * MIN),
      risk: s.server.risk,
      status: weighted<Status>([["inReview", 3], ["pending", 2], ["escalated", 1]]),
      assignee: rand() > 0.4 ? pick(people) : null,
    })),
  ...skills
    .filter((s) => ["inReview", "changesRequested", "heldDefinitionChanged"].includes(s.skill.status))
    .map((s, i) => ({
      id: `rev-skl-${202 + i}`,
      kind: "skill" as const,
      objectId: s.skill.id,
      objectName: s.skill.name,
      reason: s.skill.status === "heldDefinitionChanged" ? ("skillUpdate" as const) : ("newSkill" as const),
      requestedBy: s.skill.author,
      requestedAt: ago(int(20, 60 * 96) * MIN),
      risk: s.skill.risk,
      status: s.skill.status === "changesRequested" ? ("changesRequested" as Status) : weighted<Status>([["inReview", 2], ["pending", 2]]),
      assignee: rand() > 0.5 ? pick(people) : null,
    })),
];

// ---- tool calls --------------------------------------------------------------------------------
const approvedServers = servers.filter((s) => s.server.status !== "draft");
export const calls: Schemas["CallDetail"][] = Array.from({ length: 480 }, (_, i) => {
  const record = pick(approvedServers);
  const tool = pick(record.tools);
  const decision = record.server.status === "blocked"
    ? "blocked"
    : tool.changed
      ? weighted<Status>([["requiresApproval", 3], ["blocked", 1]])
      : weighted<Status>([["allowed", 40], ["warned", 3], ["redacted", 3], ["denied", 2], ["blocked", 1], ["error", 1]]);
  const user = pick(people);
  return {
    id: `call-${9001 + i}`,
    time: ago(i * int(1, 6) * MIN + int(0, 59) * 1000),
    user,
    client: pick(clients),
    serverId: record.server.id,
    server: record.server.name,
    tool: tool.name,
    decision,
    latencyMs: decision === "error" ? int(5000, 30000) : int(40, 1800),
    gateway: record.server.gateway,
    request: JSON.stringify({ tool: tool.name, arguments: { query: "renewals closing this quarter", limit: 25, requestedBy: emailOf(user) } }, null, 2),
    response:
      decision === "allowed" || decision === "warned"
        ? JSON.stringify({ ok: true, items: int(1, 25), note: "Results truncated for display" }, null, 2)
        : decision === "redacted"
          ? JSON.stringify({ ok: true, items: 3, email: "[redacted by DLP]", phone: "[redacted by DLP]" }, null, 2)
          : decision === "error"
            ? "Upstream timeout after 30 s"
            : "Not executed",
    policy:
      decision === "blocked" ? "No bulk export from CRM servers without approval"
      : decision === "denied" ? "User is not in a group with access to this server"
      : decision === "redacted" ? "DLP: personal contact details"
      : decision === "requiresApproval" ? "Definition changed after approval: hold until reviewed"
      : decision === "warned" ? "Unusual volume for this user"
      : null,
  };
}).sort((a, b) => b.time.localeCompare(a.time));

// ---- audit --------------------------------------------------------------------------------------
const auditActions: [string, () => string][] = [
  ["Approved server version", () => `${pick(servers).server.name} v${int(2, 9)}`],
  ["Kept pinned version", () => pick(servers).server.name],
  ["Disabled server", () => pick(servers).server.name],
  ["Approved skill", () => pick(skills).skill.name],
  ["Requested changes on skill", () => pick(skills).skill.name],
  ["Changed access policy", () => pick(["Sales can use CRM", "Contractors read-only", "No export without approval"])],
  ["Created API key", () => `svc-${hex(6)}`],
  ["Revoked API key", () => `svc-${hex(6)}`],
  ["Signed in", () => "Console"],
  ["Changed role", () => `${pick(people)} → Reviewer`],
  ["Updated DLP rule", () => pick(["Personal contact details", "Payment card numbers", "Source code secrets"])],
];
export const audit: Schemas["AuditEvent"][] = Array.from({ length: 260 }, (_, i) => {
  const [action, target] = pick(auditActions);
  return {
    id: `aud-${50001 + i}`,
    time: ago(i * int(4, 40) * MIN),
    actor: pick(people),
    action,
    target: target(),
    ip: `10.${int(0, 40)}.${int(0, 255)}.${int(1, 254)}`,
  };
});

// ---- discovery ----------------------------------------------------------------------------------
const hostnames = Array.from({ length: 64 }, (_, i) => `${pick(["mbp", "win", "lnx"])}-${pick(people).split(" ")[0]!.toLowerCase()}-${100 + i}`);
export const endpoints: Schemas["Endpoint"][] = hostnames.map((hostname, i) => ({
  id: `ep-${i + 1}`,
  hostname,
  user: pick(people),
  os: hostname.startsWith("mbp") ? `macOS ${pick(["15.6", "26.0", "26.1"])}` : hostname.startsWith("win") ? "Windows 11" : "Ubuntu 24.04",
  agentVersion: pick(["1.8.2", "1.8.2", "1.8.2", "1.7.9", "1.6.4"]),
  lastSeen: ago(int(1, 60 * 24 * 6) * MIN),
  status: weighted<Status>([["inSync", 10], ["outOfDate", 2], ["agentOffline", 1]]),
  servers: int(0, 9),
  skills: int(0, 14),
}));
export const discovered: Schemas["DiscoveredItem"][] = [
  ...["filesystem-local", "web-fetch", "puppeteer", "sqlite-local", "personal-notion", "chatgpt-bridge", "git-local", "docker"].map((name, i) => ({
    id: `dsc-${70 + i}`,
    name,
    kind: "server" as const,
    source: pick(["npx", "uvx", "docker", "binary"]) + " · claude_desktop_config.json",
    endpoints: int(1, 40),
    firstSeen: ago(int(1, 60) * DAY),
    status: weighted<Status>([["unmanaged", 4], ["inReview", 1], ["blocked", 1]]),
    risk: int(20, 90),
  })),
  ...["excel-macros", "resume-screener", "jira-helper", "personal-style", "web-research"].map((name, i) => ({
    id: `dsc-${90 + i}`,
    name,
    kind: "skill" as const,
    source: "~/.claude/skills",
    endpoints: int(1, 18),
    firstSeen: ago(int(1, 60) * DAY),
    status: weighted<Status>([["unmanaged", 3], ["onboarding", 1]]),
    risk: int(10, 70),
  })),
];

// ---- portal catalogue ---------------------------------------------------------------------------
export const catalogue: Schemas["CatalogueItem"][] = [
  ...servers
    .filter((s) => s.server.status === "approved" || s.server.status === "heldDefinitionChanged")
    .map((s) => ({
      id: s.server.id,
      kind: "server" as const,
      name: s.server.name,
      description: s.server.description,
      owner: s.server.owner,
      access: weighted([["granted", 3], ["available", 2], ["requiresApproval", 2]] as const),
      sealState: s.server.sealState,
      hash: s.server.hash,
    })),
  ...skills
    .filter((s) => s.skill.status === "approved")
    .map((s) => ({
      id: s.skill.id,
      kind: "skill" as const,
      name: s.skill.name,
      description: s.skill.description,
      owner: s.skill.author,
      access: weighted([["granted", 2], ["available", 3]] as const),
      sealState: s.skill.sealState,
      hash: s.skill.hash,
    })),
];

// ---- members ------------------------------------------------------------------------------------
export const members: Schemas["Member"][] = people.map((name, i) => ({
  id: `usr-${i + 1}`,
  name,
  email: emailOf(name),
  role: i === 0 ? "Owner" : weighted([["Admin", 2], ["Reviewer", 3], ["Auditor", 1], ["Member", 10]] as const),
  groups: Array.from(new Set(Array.from({ length: int(1, 3) }, () => pick(["Sales", "Engineering", "Support", "Finance", "Legal", "Security", "People"])))),
  lastActive: ago(int(1, 60 * 24 * 30) * MIN),
  status: weighted<Status>([["enabled", 12], ["pending", 1], ["disabled", 1]]),
}));

// ---- notifications ------------------------------------------------------------------------------
const held = servers.find((s) => s.server.sealState === "broken")!;
export const notifications: Schemas["Notification"][] = [
  { id: "ntf-1", time: ago(14 * MIN), title: `${held.server.name} changed its definition`, body: `${held.server.served?.changedCount ?? 0} of ${held.server.toolCount} tools differ from pinned version ${held.server.pinnedVersion}. Calls are held.`, read: false, href: `/app/servers/${held.server.id}` },
  { id: "ntf-2", time: ago(52 * MIN), title: "3 tool calls wait for approval", body: "Held because the served definition changed.", read: false, href: "/app/activity/calls" },
  { id: "ntf-3", time: ago(3 * HOUR), title: `Review assigned to you: ${reviews[0]?.objectName ?? "server"}`, body: "Requested by a workspace admin.", read: false, href: "/app/reviews" },
  { id: "ntf-4", time: ago(26 * HOUR), title: "5 endpoints run an out-of-date agent", body: "Update to agent 1.8.2 to keep discovery accurate.", read: true, href: "/app/discovery/endpoints" },
  { id: "ntf-5", time: ago(3 * DAY), title: "New unmanaged server found: puppeteer", body: "Seen on 7 endpoints.", read: true, href: "/app/discovery" },
];

export const now = NOW;
export const dayMs = DAY;
