// Reference implementation of the Seal glyph geometry. Copy into
// packages/ui/src/seal/seal-geometry.ts unchanged; SealGlyph renders from it.
// Pure and deterministic: the same hash always draws the same seal.

export type SealState = "intact" | "broken" | "pending" | "revoked";

export interface SealGeometry {
  viewBox: string;          // always "0 0 72 72"
  ringRadius: number;       // 30
  ringWidth: number;        // 6
  dashArray: string;        // ring pattern unique to the hash
  rotation: number;         // degrees, unique to the hash
  breakArc?: { dashArray: string; dashOffset: number }; // broken state only
  crackPath?: string;       // broken state only
  coreRadius: number;       // 14
  showCore: boolean;        // false below 40 px
}

const R = 30;
const C = 2 * Math.PI * R; // 188.4956

/** Normalise "sha256:9f2c..." or a bare hex string to lowercase hex. */
export function hexOf(hash: string): string {
  const hex = hash.replace(/^sha256:/i, "").toLowerCase().replace(/[^0-9a-f]/g, "");
  if (hex.length < 14) throw new Error("Seal needs at least 14 hex characters of hash");
  return hex;
}

/** Ring pattern: the first 12 hex digits become 12 dashes of length 2..11 with 2-unit gaps,
 *  scaled so the pattern tiles the ring exactly once. Digits 13-14 set the rotation. */
export function sealGeometry(hash: string, state: SealState, sizePx: number): SealGeometry {
  const hex = hexOf(hash);
  const raw: number[] = [];
  for (let i = 0; i < 12; i++) {
    raw.push(2 + (parseInt(hex[i], 16) % 10)); // dash
    raw.push(2);                                // gap
  }
  const total = raw.reduce((a, b) => a + b, 0);
  const scaled = raw.map((v) => +(v * (C / total)).toFixed(3));
  const rotation = Math.round((parseInt(hex.slice(12, 14), 16) / 255) * 360);

  const g: SealGeometry = {
    viewBox: "0 0 72 72",
    ringRadius: R,
    ringWidth: 6,
    dashArray: scaled.join(" "),
    rotation,
    coreRadius: 14,
    showCore: sizePx >= 40,
  };
  if (state === "broken") {
    g.breakArc = { dashArray: `40 ${+(C - 40).toFixed(3)}`, dashOffset: -20 };
    g.crackPath = "M57 14 L46 30 L54 33 L42 50";
  }
  return g;
}

// Rendering rules (SealGlyph):
// - intact:  ring stroke var(--av-seal-intact); core fill var(--av-seal-core-intact), stroke intact 1.5;
//            check mark path "M30 36l4 4 8-9" stroke intact 2.5 (only when showCore).
// - broken:  ring as intact, then the breakArc drawn over it in var(--av-seal-broken),
//            crackPath stroke broken 2.5, core fill var(--av-seal-core-broken), stroke broken 1.5.
//            The break arc and crack are NOT rotated (always upper-right), the ring is.
// - pending: ring stroke var(--av-seal-pending) with the hash pattern, no core fill, no check.
// - revoked: ring stroke var(--av-seal-revoked); a diagonal "M16 56 L56 16" stroke revoked 3.
// - Sizes: xs 16, sm 24, md 40, lg 72, xl 96. Below 40 px draw the ring only.
// - Always role="img" with aria-label, e.g. "Seal intact: definition matches pinned version 4".
//   The seal never carries meaning alone: a status pill or text sits beside it.
