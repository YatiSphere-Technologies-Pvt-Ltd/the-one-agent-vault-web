# AgentVault UI kickoff bundle (Seal direction)

1. Create an empty folder for the repo and copy this whole bundle into it as `./kickoff/`.
2. Open your coding agent in that folder and paste the content of `PROMPT.md` (below its line).
3. Review the agent's final report (step 9 of the prompt) before merging.

Contents
- `PROMPT.md`: the full setup prompt (workspace, tokens, theme, signature components, shell, all 56 routes, quality gates).
- `AGENTS.md`: permanent rules for every coding agent working in the repo.
- `TOKENS.md`: readable table of every token, light and dark.
- `tokens/*.json`: the design tokens (W3C Design Tokens format), the source of truth.
- `reference/tokens.css`: exact CSS the token build must output.
- `reference/tailwind-theme.css`, `reference/tailwind-names.json`: Tailwind v4 mapping.
- `reference/seal-geometry.ts`: deterministic seal geometry.
