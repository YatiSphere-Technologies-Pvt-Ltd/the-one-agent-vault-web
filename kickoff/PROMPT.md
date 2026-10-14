# AgentVault UI: project setup prompt for a coding agent

Paste everything below the line into your coding agent (Claude Code, Codex, Cursor) from an
empty folder that contains this kickoff bundle as `./kickoff/`. Work through the steps in
order, check each acceptance list before moving on, and finish with the report in step 9.

---

## Mission

Set up the front-end foundation for **AgentVault**, an enterprise platform that governs MCP
servers and Agent Skills. This task is **setup only**: workspace, design tokens, theme,
component library foundations, the signature components, the app shell, every route as a
placeholder, quality gates and docs. Do **not** build product screens beyond placeholders.

The visual direction is **Seal**: trust you can check. Every server and skill shows a seal
drawn from the hash of its approved definition; when the served definition stops matching,
the seal visibly breaks. The rest of the interface is calm, dense and exact: mineral greys,
deep seal green for action and "intact", rust for "held" or "broken", IBM Plex type, borders
rather than shadows, no gradients, no AI clichés.

## Inputs in `./kickoff/`

| File | Use |
|---|---|
| `AGENTS.md` | Copy to the repo root unchanged. Also create `CLAUDE.md` containing one line: `Read AGENTS.md before doing anything.` |
| `tokens/primitives.json`, `tokens/semantic.light.json`, `tokens/semantic.dark.json`, `tokens/foundation.json` | The design tokens (W3C Design Tokens format). Copy to `packages/tokens/src/` unchanged. They are the only source of visual values. |
| `reference/tokens.css` | The exact CSS your token build must produce. |
| `reference/tailwind-theme.css` | The exact Tailwind v4 mapping. Copy to `packages/ui/src/styles/tailwind-theme.css`. |
| `reference/tailwind-names.json` | Semantic token → Tailwind colour name map (e.g. `text-muted` → `ink-muted`). |
| `reference/seal-geometry.ts` | Reference geometry for the seal. Copy unchanged; build `SealGlyph` on it. |

Do not change any value in these files. If something seems wrong, stop and report it.

## Non-negotiables

1. Tokens are the only source of colour, type, space, radius, shadow, motion, size and z-index.
2. Light and dark themes from the first commit, switched by `data-theme` on `<html>`
   (`system` default, user override stored per user in `localStorage` key `av.theme`).
3. WCAG 2.2 AA: every token pair is already verified; keep it that way (visible focus, labels,
   keyboard, no meaning by colour alone, target size at least 24 px, 44 px for primary
   touch targets).
4. Fonts self-hosted (no CDN), because customers run air-gapped installs.
5. Logical CSS properties only (RTL-ready for Arabic later); all strings through i18n.
6. No server runtime: the app builds to static files.

## Stack (use the latest stable release of each at install time and pin exact versions, no `^` or `~`)

- Node.js 24 LTS, pnpm 10 workspaces. No Turborepo or Nx.
- TypeScript (strict, `noUncheckedIndexedAccess`), Vite, React 19.
- Tailwind CSS v4 (CSS-first config, `@tailwindcss/vite`).
- shadcn/ui on Radix primitives, generated into `packages/ui` and restyled with tokens.
- TanStack Router (file-based routes, validated search params), TanStack Query, TanStack Table, TanStack Virtual.
- React Hook Form + Zod. `cmdk` for the command palette. `lucide-react` icons. Recharts.
- CodeMirror 6 with `@codemirror/merge` for code and diff viewing.
- i18next + react-i18next (ICU messages).
- MSW for mocks. `openapi-typescript` + `openapi-fetch` for the API client.
- `@fontsource/ibm-plex-sans` (400, 500, 600), `@fontsource/ibm-plex-mono` (400, 500), `@fontsource/ibm-plex-sans-arabic` (400, 500, 600; loaded only for `lang="ar"`).
- Vitest + Testing Library, Playwright, `@axe-core/playwright`, Storybook (React + Vite) with the a11y addon.
- ESLint (flat config) + Prettier.

## Repository layout

```
agentvault-web/
  AGENTS.md  CLAUDE.md  README.md  package.json  pnpm-workspace.yaml  tsconfig.base.json
  apps/console/                 the SPA: /app (console) and /portal (employee portal)
    src/main.tsx  src/router.tsx  src/routes/  src/modules/<area>/  src/i18n/  src/mocks/
  packages/tokens/              src/*.json → dist/tokens.css, dist/tokens.ts
  packages/ui/                  primitives, signature components, patterns, styles, stories
  packages/icons/               concept → Lucide icon map
  packages/api-client/          openapi.yaml (stub), generated types, client
  e2e/                          Playwright: smoke, a11y, screenshots
  scripts/check-classes.mjs     token-discipline checker (step 7)
  .github/workflows/verify.yml
```

## Step 1. Workspace

- Create the layout above, root scripts: `dev`, `build`, `lint`, `typecheck`, `test`,
  `test:e2e`, `storybook`, `tokens`, `verify` (runs tokens → check-classes → lint →
  typecheck → test → build → budgets).
- `.nvmrc` with Node 24, `packageManager` field pinned, `.editorconfig`, Prettier config.

**Accept when:** `pnpm install && pnpm verify` runs (with empty packages) and exits 0.

## Step 2. Tokens package

- Copy the four JSON files to `packages/tokens/src/`.
- Write `packages/tokens/build.mjs` (plain Node, no Style Dictionary) that resolves `{color.x.y}`
  references and emits:
  - `dist/tokens.css`: identical to `kickoff/reference/tokens.css` (same variable names, order and values).
  - `dist/tokens.ts`: typed exports `tokens.color.light`, `tokens.color.dark`, `tokens.foundation`
    and a `SemanticColor` union type of the 71 semantic names.
- Package exports: `@agentvault/tokens/tokens.css`, `@agentvault/tokens` (TS).
- Test `tokens.snapshot.test.ts`: generated CSS equals the reference file byte for byte
  (ignoring a trailing newline); every semantic token resolves in both themes; no unresolved `{…}`.

**Accept when:** `pnpm tokens` produces both files and the snapshot test passes.

## Step 3. UI package: theme, fonts, primitives

- Copy `reference/tailwind-theme.css` to `packages/ui/src/styles/tailwind-theme.css`.
  `packages/ui/src/styles/index.css` imports the fonts, then that file.
- Theme provider: `ThemeProvider` + `useTheme()` setting `data-theme` on `<html>`; a
  `ThemeSwitch` component (System, Light, Dark).
- Run shadcn init into `packages/ui` and generate: button, input, textarea, select, checkbox,
  radio-group, switch, label, tabs, tooltip, dropdown-menu, popover, dialog, sheet, toast
  (sonner), skeleton, separator, scroll-area, command, table. Then **restyle every one** to
  the tokens and these specs, removing any shadcn default colour or radius:

| Component | Spec |
|---|---|
| Button | Variants `primary` (bg-action-primary-bg, hover/pressed tokens, fg action-primary-fg), `secondary` (bg-action-secondary-bg, 1px border action-secondary-border), `ghost` (text-link, no border), `danger` (bg-action-danger-bg). Sizes sm 32, md 36 (default), lg 44 px high; padding-inline 12/16/16; radius-control; text-label weight 500 (primary 600). Loading keeps width. Icon-only requires `aria-label`. |
| Input, Textarea, Select, Combobox | Height 36; 1px border-edge-strong; radius-control; bg-surface; placeholder text-ink-muted; label above (text-label), help below (text-caption, ink-muted); error replaces help in status-danger-fg with an icon and `aria-describedby`. `mono` prop for URLs and IDs. |
| Tabs | Underline style: active tab text-ink weight 600 with a 2px bottom border in action-primary-bg; inactive text-ink-muted. Tab value lives in the URL (provide a `RouteTabs` wrapper). |
| Dialog | Widths 480 (confirm) and 640 (form); radius-overlay; shadow-dialog; focus trapped; no nested dialogs. |
| Sheet (Drawer) | From the inline-end edge; 480 or 720 wide; radius 0; shadow-overlay; one open at a time; Esc closes and returns focus. |
| Toast | Inline-end bottom; 6 s, 10 s when it has Undo; errors persist until dismissed; `aria-live`. |
| Tooltip | 500 ms delay; supplementary only. |
| Menu, Popover | shadow-overlay, radius-overlay, bg-raised; destructive items last, separated, in status-danger-fg. |
| Table | Header bg-sunken, text-label ink-muted; rows 44 (comfortable) or 36 (compact) with 1px border-edge-subtle; hover bg-hover; selected bg-selected; numbers tabular. |

**Accept when:** every primitive renders in both themes using only token classes, and
`scripts/check-classes.mjs` (step 7) reports zero violations in `packages/ui`.

## Step 4. Signature components

Build these in `packages/ui/src/signature/` with stories for every state and size.

**SealGlyph** `({ hash: string; state: "intact" | "broken" | "pending" | "revoked"; size: "xs" | "sm" | "md" | "lg" | "xl"; label: string })`
- Copy `reference/seal-geometry.ts` unchanged and render from `sealGeometry()` as inline SVG,
  following the rendering rules in the comments at the end of that file exactly.
- Sizes from tokens (`--av-size-seal-*`). Below 40 px, ring only. `role="img"` + `aria-label`.
- Unit tests: the same hash gives the same `dashArray` and `rotation`; different hashes differ;
  `showCore` is false at 16 and 24 px; broken adds `breakArc` and `crackPath`.
- Story: a grid of 8 sample hashes × 4 states × 5 sizes, light and dark.

**SealCompare** `({ pinned: { hash, version, approvedAt, approvedBy, toolCount }, served: { hash, seenAt, gateway, changedCount } | null })`
- Two equal panels side by side (stacked below 768 px): pinned seal (intact, xl) with version,
  approver, mono hash truncated in the middle (`sha256:9f2c41…e81a`) with copy, tool count;
  served seal (broken, xl) with seen time, gateway and "N of M tools differ" in status-held-fg,
  on bg `status-held-bg` at reduced emphasis. When `served` is null, a single intact panel.

**StatusPill** `({ status: StatusVocabulary })`
- Pill (radius-pill), padding 2×10, text-label 600, a 6px dot in the tone's solid colour,
  fg/bg/border from the tone. The status text is the enum's label; no custom text accepted.

**RiskChip** `({ score: number })` (0–100)
- Level from score: Low 0–24, Medium 25–49, High 50–74, Critical 75–100. Shows a shape icon
  (circle, triangle, diamond, square) plus "Risk {level}, {score}"; colours from `risk-*` tokens.

**Strip** `({ state: "person" | "policy" | "approved" | "closed"; time: string; timeNote: string; who: ReactNode; what: ReactNode; why: ReactNode; actions?: ReactNode })`
- The approvals and held-call row. CSS grid: bay `--av-size-strip-bay` (112 px) | who | what | why | actions.
  Bay uses `strip-{state}-bg/fg`, shows time in text-title-3 and the note below. Strip has a 1px
  border-edge, radius-control, bg-surface, no shadow. Below 768 px, the bay becomes a top band
  and columns stack. Rendered as a list item inside `StripList` (a `<ul>` with a heading).
- Action buttons are lg (44 px).

**StatusVocabulary** (one enum + tone map in `packages/ui/src/status.ts`):

| Tone | Statuses |
|---|---|
| success | Approved, Enabled, Allowed, In sync, Resolved |
| info | In review, Onboarding, Pending, Escalated |
| held | Changes requested, Held (definition changed), Requires approval, Warned, Redacted, Out of date, Modified, Accepted risk |
| danger | Blocked, Denied, Error, Unmanaged |
| neutral | Draft, Disabled, Deprecated, Expired, Agent offline |

**Accept when:** all five render correctly in Storybook in both themes; unit tests pass; axe has no violations.

## Step 5. Patterns (skeletons, enough for the shell and placeholders)

- **AppShell**: top bar (`--av-size-topbar` 56 px, bg-surface, bottom border-edge) with wordmark
  (a 24 px intact SealGlyph from a fixed hash + "AgentVault" in title-3), workspace switcher
  (hidden when one workspace), search field opening the command palette (`Ctrl K` / `⌘K`),
  notifications button with an unread dot (status-held-solid), avatar menu (profile, theme
  switch, switch to portal, sign out). Left navigation 216 px (64 px collapsed, state
  remembered), items in this fixed order: Home, MCP servers, Skills, Reviews, Approvals,
  Activity, Discovery, Settings. Active item: bg-surface on bg-canvas, weight 600. A dot on
  Reviews and Approvals when something waits. A global banner slot between the top bar and
  the page. Below 1024 px the navigation collapses to icons with tooltips.
- **PortalShell**: same top bar, no left navigation, content max `--av-size-portal-max`.
- **PageHeader**: breadcrumb (text-body-sm, link tokens), title (text-title-1), optional
  SealGlyph md, StatusPill, RiskChip, one primary action at inline-end, overflow menu.
- **StateView** `({ kind: "loading" | "empty" | "error" | "no-access" | "partial"; … })`:
  loading = skeleton matching the layout; error shows a copyable request ID; no-access names
  who to ask.
- **DataTable**: TanStack Table wrapper with server-side sort/filter/pagination props, density
  toggle (stored per table), sticky header, row actions on hover and focus, empty and error rows.
- **ConfirmDialog** `({ tier: 0 | 1 | 2 | 3; … })`: tier 0 returns an undo toast instead of a
  dialog; tier 1 impact summary; tier 2 impact summary + mandatory reason + type the object's
  name to enable the button; tier 3 "Save as proposal" (second admin approves).
- **SafeText**: renders untrusted text as plain text, preserving line breaks, never HTML.
- **CommandPalette**: `cmdk` dialog listing routes from the route table below (actions later).

## Step 6. Console app and routes

- Vite + React + TanStack Router (file-based) + TanStack Query + i18next + MSW (dev only).
- Create a route for **every** screen below. Each renders the right shell, a `PageHeader` with
  the screen title and ID, and `StateView kind="empty"` with the text "Not built yet: {ID}".
  Tabs routes render inside their parent's `RouteTabs`. Drawer and modal screens are mounted
  as search params on their parent (`?call=<id>`, `?request=1`, `?killswitch=1`).
- Feature flags: screens marked R2 or R3 are hidden from navigation unless the flag is on
  (`src/flags.ts`, read from `/api/licence` later; for now a dev toggle in the avatar menu).

| ID | Screen | Route | Release |
|---|---|---|---|
| SH-01 | Sign-in | /login | R1 |
| SH-02 | First-run setup wizard | /app/setup | R1 |
| SH-03 | Home | /app | R1 |
| SH-04 | Search and command palette | ⌘K / Ctrl K overlay | R1 |
| SH-05 | Notification centre | bell panel, /app/notifications | R1 |
| SH-06 | Profile and connected accounts | /app/me | R1 |
| PT-01 | Portal catalogue | /portal | R1 |
| PT-02 | Portal item detail | /portal/servers/:id, /portal/skills/:id | R1 |
| PT-03 | Request access | drawer on PT-02 (?request=1) | R1 |
| PT-04 | My access and requests | /portal/me | R1 |
| PT-05 | Set up my client | /portal/setup | R1 |
| MC-01 | Servers | /app/servers | R1 |
| MC-02 | Add server wizard | /app/servers/new | R1 |
| MC-03 | Server: Overview | /app/servers/:id | R1 |
| MC-04 | Server: Tools | /app/servers/:id/tools | R1 |
| MC-05 | Server: Versions and definition changes | /app/servers/:id/versions | R1 |
| MC-06 | Server: Access | /app/servers/:id/access | R1 |
| MC-07 | Server: Credentials | /app/servers/:id/credentials | R1 |
| MC-08 | Server: Activity | /app/servers/:id/activity | R1 |
| RV-01 | Review queue | /app/reviews | R1 |
| RV-02 | Server review workspace | /app/reviews/:id | R1 |
| RV-03 | Skill review workspace | /app/reviews/:id | R1 |
| MC-09 | Virtual servers | /app/virtual-servers | R1 |
| MC-10 | Access policies | /app/policies | R1 |
| MC-11 | Approvals inbox | /app/approvals | R2 |
| MC-12 | Approval detail | /app/approvals/:id | R2 |
| MC-13 | Tool-call explorer | /app/activity/calls | R1 |
| MC-14 | Call detail | drawer on MC-13 (?call=<id>) | R1 |
| MC-15 | Gateway endpoints and client setup | /app/endpoints | R1 |
| MC-16 | Kill switch | modal from any server or tool (?killswitch=1) | R1 |
| MC-17 | Hosted servers and OpenAPI to MCP | /app/servers/new?type=hosted | R2 |
| SK-01 | Skills | /app/skills | R1 |
| SK-02 | Import skill wizard | /app/skills/new | R1 |
| SK-03 | Skill: Overview | /app/skills/:id | R1 |
| SK-04 | Skill: Files | /app/skills/:id/files | R1 |
| SK-05 | Skill: Findings | /app/skills/:id/findings | R1 |
| SK-06 | Skill: Versions | /app/skills/:id/versions | R1 |
| SK-07 | Skill: Distribution | /app/skills/:id/distribution | R1 |
| SK-08 | Skill packs | /app/skill-packs | R2 |
| SK-09 | Fleet distribution status | /app/skills/fleet | R1 |
| DS-01 | Discovery overview | /app/discovery | R1 |
| DS-02 | Discovered item | /app/discovery/:id | R2 |
| DS-03 | Endpoint inventory | /app/discovery/endpoints | R1 |
| DS-04 | Posture | /app/posture | R3 |
| AD-01 | Organisation | /app/settings/org | R1 |
| AD-02 | Workspaces | /app/settings/workspaces | R1 |
| AD-03 | Members and groups | /app/settings/members | R1 |
| AD-04 | Roles and permissions | /app/settings/roles | R1 |
| AD-05 | Identity: SSO and SCIM | /app/settings/identity | R1 (SSO), R2 (SCIM) |
| AD-06 | API keys and service accounts | /app/settings/api-keys | R1 |
| AD-07 | Audit log | /app/audit | R1 |
| AD-08 | Security centre | /app/settings/security | R2 |
| AD-09 | DLP rules and inspector | /app/settings/dlp | R1 |
| AD-10 | Integrations | /app/settings/integrations | R1–R2 |
| AD-11 | Gateways and deployments | /app/settings/gateways | R2 |
| AD-12 | Licence and plan | /app/settings/licence | R2 |

Note: `/app/skills/fleet` and `/app/skills/new` must be matched before `/app/skills/:id`.
RV-02 and RV-03 share `/app/reviews/:id`; the review's type decides which workspace renders.

- **Reference page:** build one real demo route, `/app/_reference`, showing the definition-change
  moment with mock data: PageHeader (seal broken md, "salesforce-crm", StatusPill
  "Held (definition changed)", RiskChip 62, actions "Keep pinned version" and "Review the
  change"), SealCompare, a DataTable of the 3 changed tools, and a StripList with two
  "person" strips and one "policy" strip. This page is the visual benchmark for every later screen.

**Accept when:** every route in the table loads; navigation, breadcrumbs, ⌘K, theme switch
and collapse work by keyboard; the reference page matches the Seal direction in both themes.

## Step 7. Quality gates

- `scripts/check-classes.mjs` (no dependencies) scans `apps/**` and `packages/ui/**` source and
  fails on: hex/rgb/hsl colour literals outside `packages/tokens`; arbitrary Tailwind values
  (`-[`…`]`); physical direction classes (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`,
  `text-left`, `text-right`, `rounded-l-`, `rounded-r-`, `border-l-`, `border-r-`); spacing
  steps outside 0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16; primitive colour names
  (`seal-`, `rust-`, `neutral-`, `night-`, `ochre-`, `red-`, `blue-`) in class strings;
  `dangerouslySetInnerHTML`. Prints file:line for each violation.
- ESLint: `no-restricted-imports` for `@radix-ui/*`, `cmdk` and `packages/ui` internals outside
  `packages/ui`; `jsx-a11y` recommended; React hooks rules.
- Vitest: tokens snapshot, seal geometry, status map, ConfirmDialog tier behaviour.
- Playwright: smoke test visiting every route; axe on every route in both themes (fail on
  serious or critical); screenshots of the reference page and Storybook signature stories in
  both themes (committed baselines).
- Budgets: initial JS per route under 250 KB compressed (fail the build if exceeded).
- `.github/workflows/verify.yml` runs `pnpm verify` and Playwright on pull requests.

**Accept when:** `pnpm verify` and `pnpm test:e2e` pass; introducing `bg-[#fff]` or `ml-4`
anywhere makes `pnpm verify` fail with the file and line.

## Step 8. Docs

- `README.md`: what this is, requirements, commands, folder map, how to add a screen
  (brief → mocks → stories → screen → journey test), how theming works.
- `packages/ui/README.md`: token naming (Tailwind names from `tailwind-names.json`), the five
  signature components, how to request a new component.
- Storybook "Foundations" pages: colour (semantic swatches, both themes), type scale,
  spacing, radius, elevation, motion, seal anatomy.

## Step 9. Final report (reply with exactly this)

1. Commands run and their results (`pnpm verify`, `pnpm test:e2e`).
2. Exact versions installed (from the lockfile) for every package named in Stack.
3. Anything in the kickoff files you believe is wrong, with the reason (do not change it).
4. Deviations from this prompt, with the reason.
5. Screenshots: reference page light and dark; SealGlyph grid; Storybook foundations.

## Stop and ask, instead of guessing, if

- A token or reference file seems inconsistent.
- A library cannot do what a spec line requires.
- You would need a dependency not named in Stack.
- Any step's acceptance list cannot be met.
