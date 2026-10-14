import type { APIRoute } from "astro";
import { tokens } from "@agentvault/tokens";
import { sealGeometry } from "@agentvault/ui";
import { copy } from "../content/en";

// 1200×630 social card source. Converted once to public/og.png (see apps/site/README.md).
export const GET: APIRoute = () => {
  const c = tokens.color.light;
  const g = sealGeometry(copy.hero.kinds[0].hash, "intact", 240);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${c["bg-canvas"]}"/>
  <svg x="790" y="135" width="360" height="360" viewBox="0 0 72 72">
    <circle cx="36" cy="36" r="${g.ringRadius}" fill="none" stroke="${c["seal-intact"]}" stroke-width="${g.ringWidth}" stroke-dasharray="${g.dashArray}" transform="rotate(${g.rotation} 36 36)"/>
    <circle cx="36" cy="36" r="${g.coreRadius}" fill="${c["seal-core-intact"]}" stroke="${c["seal-intact"]}" stroke-width="1.5"/>
    <path d="M30 36l4 4 8-9" fill="none" stroke="${c["seal-intact"]}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <text x="80" y="120" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="36" font-weight="600" fill="${c["text-primary"]}">${copy.brand}</text>
  <text font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="92" font-weight="600" letter-spacing="-3" fill="${c["text-primary"]}">
    <tspan x="80" y="320">AI agents,</tspan><tspan x="80" y="420">under seal.</tspan>
  </text>
  <text x="80" y="520" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif" font-size="28" fill="${c["text-secondary"]}">Build, run and govern agents.</text>
</svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
};
