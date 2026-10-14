# AgentVault design tokens (Seal direction)

Source of truth: `tokens/*.json` (W3C Design Tokens format). This page is a readable copy. All text pairs meet WCAG 2.2 AA (4.5:1), and input borders, focus rings and seal strokes meet 3:1, in both themes.

## Semantic colours

| Token (CSS `--av-…`) | Tailwind name | Light | Dark |
|---|---|---|---|
| `bg-canvas` | `canvas` | #EEF1EF (neutral.100) | #0D1416 (night.900) |
| `bg-surface` | `surface` | #FFFFFF (neutral.0) | #141C1F (night.850) |
| `bg-raised` | `raised` | #FFFFFF (neutral.0) | #1B2528 (night.800) |
| `bg-sunken` | `sunken` | #F5F7F6 (neutral.50) | #1B2528 (night.800) |
| `bg-hover` | `hover` | #F5F7F6 (neutral.50) | #1B2528 (night.800) |
| `bg-selected` | `selected` | #EAF4F0 (seal.50) | #12322A (tint-dark.seal) |
| `bg-inverse` | `inverse` | #172024 (neutral.900) | #E4EAE7 (night.50) |
| `border-subtle` | `edge-subtle` | #E4E8E6 (neutral.200) | #222D30 (night.750) |
| `border-default` | `edge` | #D5DBD8 (neutral.300) | #2A3539 (night.700) |
| `border-strong` | `edge-strong` | #85908C (neutral.500) | #5F6C70 (night.500) |
| `border-focus` | `focus` | #2B7C65 (seal.500) | #5FA88E (seal.400) |
| `text-primary` | `ink` | #172024 (neutral.900) | #E4EAE7 (night.50) |
| `text-secondary` | `ink-secondary` | #3E494F (neutral.700) | #BAC5C0 (night.100) |
| `text-muted` | `ink-muted` | #55616A (neutral.600) | #8E9A96 (night.300) |
| `text-disabled` | `ink-disabled` | #A7B0AC (neutral.400) | #5F6C70 (night.500) |
| `text-inverse` | `ink-inverse` | #FFFFFF (neutral.0) | #0D1416 (night.900) |
| `text-link` | `link` | #175747 (seal.700) | #7FCBB0 (seal.300) |
| `text-link-hover` | `link-hover` | #134538 (seal.800) | #A9D1C2 (seal.200) |
| `action-primary-bg` | `action-primary-bg` | #175747 (seal.700) | #5FA88E (seal.400) |
| `action-primary-bg-hover` | `action-primary-bg-hover` | #134538 (seal.800) | #7FCBB0 (seal.300) |
| `action-primary-bg-pressed` | `action-primary-bg-pressed` | #10372D (seal.900) | #A9D1C2 (seal.200) |
| `action-primary-fg` | `action-primary-fg` | #FFFFFF (neutral.0) | #0A231D (seal.950) |
| `action-secondary-bg` | `action-secondary-bg` | #FFFFFF (neutral.0) | #141C1F (night.850) |
| `action-secondary-bg-hover` | `action-secondary-bg-hover` | #F5F7F6 (neutral.50) | #1B2528 (night.800) |
| `action-secondary-border` | `action-secondary-border` | #85908C (neutral.500) | #5F6C70 (night.500) |
| `action-secondary-fg` | `action-secondary-fg` | #172024 (neutral.900) | #E4EAE7 (night.50) |
| `action-danger-bg` | `action-danger-bg` | #B3261E (red.600) | #E08F86 (red.300) |
| `action-danger-bg-hover` | `action-danger-bg-hover` | #8A1C12 (red.700) | #F4A39C (red.200) |
| `action-danger-fg` | `action-danger-fg` | #FFFFFF (neutral.0) | #0D1416 (night.900) |
| `status-success-fg` | `status-success-fg` | #175747 (seal.700) | #7FCBB0 (seal.300) |
| `status-success-bg` | `status-success-bg` | #EAF4F0 (seal.50) | #12322A (tint-dark.seal) |
| `status-success-border` | `status-success-border` | #A9D1C2 (seal.200) | #175747 (seal.700) |
| `status-success-solid` | `status-success-solid` | #1D6B57 (seal.600) | #5FA88E (seal.400) |
| `status-held-fg` | `status-held-fg` | #8A3B08 (rust.700) | #F0A878 (rust.300) |
| `status-held-bg` | `status-held-bg` | #FDF3EC (rust.50) | #3A2010 (tint-dark.rust) |
| `status-held-border` | `status-held-border` | #F5C9AA (rust.200) | #8A3B08 (rust.700) |
| `status-held-solid` | `status-held-solid` | #A8480C (rust.600) | #D97B45 (rust.400) |
| `status-danger-fg` | `status-danger-fg` | #8A1C12 (red.700) | #F4A39C (red.200) |
| `status-danger-bg` | `status-danger-bg` | #FCEBE9 (red.50) | #3A1512 (tint-dark.red) |
| `status-danger-border` | `status-danger-border` | #F4A39C (red.200) | #8A1C12 (red.700) |
| `status-danger-solid` | `status-danger-solid` | #B3261E (red.600) | #E08F86 (red.300) |
| `status-info-fg` | `status-info-fg` | #2A527E (blue.700) | #9DBCE3 (blue.200) |
| `status-info-bg` | `status-info-bg` | #E8EFF7 (blue.50) | #172A40 (tint-dark.blue) |
| `status-info-border` | `status-info-border` | #9DBCE3 (blue.200) | #2A527E (blue.700) |
| `status-info-solid` | `status-info-solid` | #2A527E (blue.700) | #9DBCE3 (blue.200) |
| `status-neutral-fg` | `status-neutral-fg` | #3E494F (neutral.700) | #BAC5C0 (night.100) |
| `status-neutral-bg` | `status-neutral-bg` | #EEF1EF (neutral.100) | #1B2528 (night.800) |
| `status-neutral-border` | `status-neutral-border` | #D5DBD8 (neutral.300) | #2A3539 (night.700) |
| `status-neutral-solid` | `status-neutral-solid` | #55616A (neutral.600) | #8E9A96 (night.300) |
| `risk-low-fg` | `risk-low-fg` | #175747 (seal.700) | #7FCBB0 (seal.300) |
| `risk-low-bg` | `risk-low-bg` | #EAF4F0 (seal.50) | #12322A (tint-dark.seal) |
| `risk-medium-fg` | `risk-medium-fg` | #6E5205 (ochre.700) | #E8C877 (ochre.300) |
| `risk-medium-bg` | `risk-medium-bg` | #F6EDD4 (ochre.100) | #33290A (tint-dark.ochre) |
| `risk-high-fg` | `risk-high-fg` | #8A3B08 (rust.700) | #F0A878 (rust.300) |
| `risk-high-bg` | `risk-high-bg` | #FBE6D8 (rust.100) | #3A2010 (tint-dark.rust) |
| `risk-critical-fg` | `risk-critical-fg` | #8A1C12 (red.700) | #F4A39C (red.200) |
| `risk-critical-bg` | `risk-critical-bg` | #FCEBE9 (red.50) | #3A1512 (tint-dark.red) |
| `seal-intact` | `seal-intact` | #1D6B57 (seal.600) | #5FA88E (seal.400) |
| `seal-broken` | `seal-broken` | #A8480C (rust.600) | #D97B45 (rust.400) |
| `seal-pending` | `seal-pending` | #85908C (neutral.500) | #8E9A96 (night.300) |
| `seal-revoked` | `seal-revoked` | #B3261E (red.600) | #E08F86 (red.300) |
| `seal-core-intact` | `seal-core-intact` | #EAF4F0 (seal.50) | #12322A (tint-dark.seal) |
| `seal-core-broken` | `seal-core-broken` | #FBE6D8 (rust.100) | #3A2010 (tint-dark.rust) |
| `strip-person-bg` | `strip-person-bg` | #F2DDA4 (ochre.200) | #D9B95E (ochre.400) |
| `strip-person-fg` | `strip-person-fg` | #172024 (neutral.900) | #0D1416 (night.900) |
| `strip-policy-bg` | `strip-policy-bg` | #F6CFCB (red.100) | #E08F86 (red.300) |
| `strip-policy-fg` | `strip-policy-fg` | #172024 (neutral.900) | #0D1416 (night.900) |
| `strip-approved-bg` | `strip-approved-bg` | #D3E8E0 (seal.100) | #5FA88E (seal.400) |
| `strip-approved-fg` | `strip-approved-fg` | #172024 (neutral.900) | #0D1416 (night.900) |
| `strip-closed-bg` | `strip-closed-bg` | #E4E8E6 (neutral.200) | #2A3539 (night.700) |
| `strip-closed-fg` | `strip-closed-fg` | #172024 (neutral.900) | #E4EAE7 (night.50) |

## Primitive scales

| Scale | Steps |
|---|---|
| neutral | 0 #FFFFFF, 25 #FAFBFA, 50 #F5F7F6, 100 #EEF1EF, 200 #E4E8E6, 300 #D5DBD8, 400 #A7B0AC, 500 #85908C, 600 #55616A, 700 #3E494F, 800 #2A3338, 900 #172024, 950 #0D1416 |
| night | 50 #E4EAE7, 100 #BAC5C0, 300 #8E9A96, 500 #5F6C70, 700 #2A3539, 750 #222D30, 800 #1B2528, 850 #141C1F, 900 #0D1416 |
| seal | 50 #EAF4F0, 100 #D3E8E0, 200 #A9D1C2, 300 #7FCBB0, 400 #5FA88E, 500 #2B7C65, 600 #1D6B57, 700 #175747, 800 #134538, 900 #10372D, 950 #0A231D |
| rust | 50 #FDF3EC, 100 #FBE6D8, 200 #F5C9AA, 300 #F0A878, 400 #D97B45, 500 #C2601F, 600 #A8480C, 700 #8A3B08, 800 #6E3008, 900 #572709 |
| red | 50 #FCEBE9, 100 #F6CFCB, 200 #F4A39C, 300 #E08F86, 500 #D0453B, 600 #B3261E, 700 #8A1C12 |
| ochre | 50 #FBF5E6, 100 #F6EDD4, 200 #F2DDA4, 300 #E8C877, 400 #D9B95E, 700 #6E5205 |
| blue | 50 #E8EFF7, 200 #9DBCE3, 700 #2A527E |
| tint-dark | seal #12322A, rust #3A2010, red #3A1512, blue #172A40, ochre #33290A |
| viz (light) | 1 #1D6B57, 2 #2A527E, 3 #C2601F, 4 #7B4FA0, 5 #3E8FA8, 6 #A23B6B, 7 #6E5205, 8 #85908C |
| viz (dark) | 1 #5FA88E, 2 #9DBCE3, 3 #F0A878, 4 #C5A3E0, 5 #7FC4D9, 6 #E79BBE, 7 #E8C877, 8 #A7B0AC |

## Type

Families: IBM Plex Sans (UI), IBM Plex Mono (hashes, IDs, URLs, code only), IBM Plex Sans Arabic (Arabic locale).

| Style | Size / line | Weight | Tracking |
|---|---|---|---|
| display | 32px / 40px | 600 | -0.01em |
| title-1 | 28px / 36px | 600 | -0.005em |
| title-2 | 20px / 28px | 600 | 0 |
| title-3 | 16px / 24px | 600 | 0 |
| body | 14px / 20px | 400 | 0 |
| body-sm | 13px / 18px | 400 | 0 |
| label | 13px / 18px | 500 | 0 |
| caption | 12px / 16px | 400 | 0.005em |
| mono | 13px / 20px | 400 | 0 |
| mono-sm | 12px / 16px | 400 | 0 |

## Space, radius, shadow, motion, z-index

- **Space** (Tailwind step = px): 0 = 0px, 0.5 = 2px, 1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px, 5 = 20px, 6 = 24px, 8 = 32px, 10 = 40px, 12 = 48px, 16 = 64px
- **Radius:** none 0px, control 4px, panel 6px, overlay 8px, pill 9999px
- **Border width:** default 1px, focus 2px (offset 2px)
- **Shadow (overlays only):** overlay `0 1px 2px rgba(23, 32, 36, 0.06), 0 4px 12px rgba(23, 32, 36, 0.10)`; dialog `0 16px 40px rgba(23, 32, 36, 0.18)`; dark theme uses the `-dark` variants
- **Motion:** fast 120ms, base 200ms, slow 280ms, ease-standard cubic-bezier(0.2, 0, 0, 1), ease-exit cubic-bezier(0.4, 0, 1, 1); reduced motion sets durations to 0
- **Z-index:** base 0, sticky 10, nav 20, dropdown 30, drawer 40, dialog 50, toast 60, tooltip 70
- **Breakpoints:** sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px

## Sizes

| Token | Value |
|---|---|
| size-control-sm | 32px |
| size-control-md | 36px |
| size-control-lg | 44px |
| size-row-compact | 36px |
| size-row-comfortable | 44px |
| size-topbar | 56px |
| size-nav | 216px |
| size-nav-collapsed | 64px |
| size-drawer | 480px |
| size-drawer-wide | 720px |
| size-dialog | 480px |
| size-dialog-form | 640px |
| size-content-max | 1440px |
| size-form-max | 720px |
| size-portal-max | 1120px |
| size-decision-panel | 400px |
| size-icon-sm | 16px |
| size-icon-md | 20px |
| size-strip-bay | 112px |
| size-seal-xs | 16px |
| size-seal-sm | 24px |
| size-seal-md | 40px |
| size-seal-lg | 72px |
| size-seal-xl | 96px |
