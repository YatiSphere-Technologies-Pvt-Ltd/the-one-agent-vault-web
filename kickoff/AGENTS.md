# AgentVault web: rules for coding agents

Read this file completely before changing anything. CLAUDE.md points here.

## What this repo is
The AgentVault admin console (`/app`) and employee portal (`/portal`): one React SPA for
governing MCP servers and Agent Skills. Visual direction: **Seal**. Trust you can check,
shown by a seal drawn from each object's approved definition hash. Calm, dense, exact.

## Sources of truth (in this order)
1. **Behaviour:** the AgentVault UX Specification (screen IDs such as `MC-05`). Never invent
   flows, labels, statuses or numbers. If the spec is silent, stop and ask.
2. **Look:** `packages/tokens` (values) and `packages/ui` (components). Storybook shows every
   allowed component and state.
3. **Data:** `packages/api-client`, generated from `openapi.yaml`. Never hand-write fetch calls.

## Hard rules
1. Build screens only from `packages/ui`. Need something new? Stop and open a design-system
   request. Never import `@radix-ui/*`, `cmdk` or shadcn files outside `packages/ui`.
2. Tokens only. No hex/rgb/hsl values, no pixel values, no z-index numbers, no durations
   in app code. No inline `style` except CSS variables from tokens. No arbitrary Tailwind
   values (`p-[13px]`, `bg-[#fff]`, `w-[371px]`). Spacing steps allowed: 0, 0.5, 1, 2, 3, 4,
   5, 6, 8, 10, 12, 16.
3. Colour classes use semantic names only: `bg-surface`, `text-ink-muted`, `border-edge`,
   `bg-status-held-bg`. Primitive scales (seal, rust, neutral…) are never used in app code.
4. Every list and detail screen implements five states with `StateView`: loading, empty,
   error, no-access, partial. Copy comes from the spec.
5. All view state (tab, filters, sort, page, open drawer item) lives in the URL through the
   route's validated search schema.
6. Destructive actions use `ConfirmDialog` with the tier the spec names (0–3).
7. Status text comes only from the `StatusVocabulary` enum; tones come from its map.
8. Text from servers, skills or users is untrusted: render it with `SafeText`. Never
   `dangerouslySetInnerHTML`, never Markdown without the sanitiser.
9. Logical CSS only (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`).
   No `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right`.
   All user-visible strings go through i18n.
10. Keyboard: every action reachable by keyboard; focus returns to the trigger when a
    dialog or drawer closes; no `onClick` on `div` or `span`.
11. IBM Plex Mono is only for hashes, IDs, URLs, code and JSON, never for labels.
12. Sentence case everywhere. No all-caps labels, no emoji, no sparkle or "AI" icons,
    no gradients.

## Every pull request
- One screen or one pattern. Screen ID in the title, e.g. `MC-04 Tools tab`.
- MSW handlers for every state; one Storybook story per state.
- Playwright test for the journey steps the screen covers; axe passes.
- Screenshots of each state in light and dark attached.
- `pnpm verify` passes locally (lint, typecheck, unit, build, budgets).

## Stop and ask when
- A needed component or pattern is missing from `packages/ui`.
- The spec is silent, ambiguous, or contradicts the API.
- A change would touch `packages/tokens` or `packages/ui` while you are building a screen.
- A dependency would be added that is not already in the repo.
