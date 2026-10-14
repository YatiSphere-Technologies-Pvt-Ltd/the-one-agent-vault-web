import type { APIRoute } from "astro";
import { tokens } from "@agentvault/tokens";
import { sealGeometry } from "@agentvault/ui";

// Favicon drawn from the wordmark hash with the seal geometry; colours from the tokens.
export const GET: APIRoute = () => {
  const g = sealGeometry("sha256:5ea1a6e17c0de4b9f2c41d07a3e8b6f9c2d5e81a", "intact", 24);
  const ring = tokens.color.light["seal-intact"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${g.viewBox}"><circle cx="36" cy="36" r="${g.ringRadius}" fill="none" stroke="${ring}" stroke-width="8" stroke-dasharray="${g.dashArray}" transform="rotate(${g.rotation} 36 36)"/><circle cx="36" cy="36" r="13" fill="${ring}"/></svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
};
