# @agentvault/site

The public landing page. Astro, static output, built from `kickoff/reference/landing.reference.html`.

```bash
pnpm dev:site            # from the repo root: http://localhost:4321
pnpm --filter @agentvault/site build
pnpm --filter @agentvault/site preview
```

- **Copy** lives in `src/content/en.ts`, verbatim from the reference. Bracketed placeholders
  (`[Company legal name]`, `[Attestations, once reports exist]`) are deliberate.
- **Sections** are one component each in `src/sections/`, in page order in `src/pages/index.astro`.
- **Styling** uses the shared tokens through `@agentvault/ui/styles.css`. Dark bands are wrappers
  with `data-theme="dark"`. The marketing type scale, section spacing, line lengths and large seal
  sizes in `src/styles/site.css` are the only site-specific values.
- **Shared components**: `SealGlyph`, `StatusPill` and `Strip` from `@agentvault/ui` are rendered
  to HTML at build time by `@astrojs/react`. No React is shipped to the browser.
- **Motion** (`src/styles/motion.css`, `src/scripts/motion.ts`): restrained by design (no bounce,
  shake, pulse or overshoot). The hero seal draws in and, once, demonstrates a definition change
  (stops on any interaction); sections fade in on scroll; the platform diagram and agent flow loop
  slowly while on screen, each with a pause button (WCAG 2.2.2).
  All motion is behind `html.motion`, set only without `prefers-reduced-motion`; if the script
  fails to start within 3 s, motion is dropped so no content stays hidden. This extends the
  original brief, which allowed one scroll animation (requested later by the product owner).
- **Seal playground** (`src/sections/SealPlayground.astro`): visitors edit a tool definition; the
  live seal is redrawn from its SHA-256 (Web Crypto, same `sealGeometry()` as the console) and
  breaks against the pinned seal. Its copy is **draft**, not from the approved reference.
- **JavaScript**: small inline scripts in `src/scripts/` (seal demo tabs, risk-dot animation,
  partner form), about 2 KB compressed. Budget: 40 KB, checked by `pnpm budgets`.
- **Form**: posts JSON `{ email, company, source }` to `PUBLIC_LEAD_ENDPOINT`. When unset, the
  button stays disabled and development builds show "Form not connected yet".
- **SEO**: title, description, canonical, Open Graph and Twitter tags, `robots.txt`, `sitemap.xml`
  and an SVG favicon (generated from the seal geometry). Set the canonical origin with
  `SITE_URL` (defaults to `https://agentvault.dev`).
- **Social card**: `public/og.png` (1200×630) is rendered from `dist/og.svg` by `tools/render-og.sh`
  (macOS). It uses a system font because IBM Plex is not installed system-wide.
