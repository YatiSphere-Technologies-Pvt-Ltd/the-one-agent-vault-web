import { foundation } from "@agentvault/tokens";
import { cn } from "../lib/cn";
import { sealGeometry, type SealState } from "./seal-geometry";

export type { SealState };
export type SealSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SealGlyphProps {
  /** Hash of the approved definition, e.g. "sha256:9f2c41…". At least 14 hex digits. */
  hash: string;
  state: SealState;
  size: SealSize;
  /** Accessible name, e.g. "Seal intact: definition matches pinned version 4". */
  label: string;
  /** Hide from assistive technology when adjacent text already names it (e.g. the wordmark). */
  decorative?: boolean;
  className?: string;
}

/** Pixel size per seal size, read from the size tokens. */
export const sealSizePx: Record<SealSize, number> = {
  xs: parseInt(foundation.size["seal-xs"], 10),
  sm: parseInt(foundation.size["seal-sm"], 10),
  md: parseInt(foundation.size["seal-md"], 10),
  lg: parseInt(foundation.size["seal-lg"], 10),
  xl: parseInt(foundation.size["seal-xl"], 10),
};

const sizeClass: Record<SealSize, string> = {
  xs: "size-(--av-size-seal-xs)",
  sm: "size-(--av-size-seal-sm)",
  md: "size-(--av-size-seal-md)",
  lg: "size-(--av-size-seal-lg)",
  xl: "size-(--av-size-seal-xl)",
};

const ringColour: Record<SealState, string> = {
  intact: "var(--av-seal-intact)",
  broken: "var(--av-seal-intact)",
  pending: "var(--av-seal-pending)",
  revoked: "var(--av-seal-revoked)",
};

const C = { x: 36, y: 36 };

/**
 * The seal: a ring whose dash pattern and rotation come from the definition hash.
 * Rendering rules follow the comments in seal-geometry.ts. The break arc and crack are fixed at
 * the upper right; the arc is measured from 12 o'clock (base rotation -90°), which is where the
 * crack path meets the ring. Below 40 px only the ring (and, when broken, its break arc) is drawn.
 */
export function SealGlyph({ hash, state, size, label, decorative = false, className }: SealGlyphProps) {
  const px = sealSizePx[size];
  const g = sealGeometry(hash, state, px);
  const ring = ringColour[state];
  return (
    <svg
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
      viewBox={g.viewBox}
      data-state={state}
      data-size={size}
      className={cn("shrink-0", sizeClass[size], className)}
      fill="none"
    >
      <circle
        cx={C.x}
        cy={C.y}
        r={g.ringRadius}
        stroke={ring}
        strokeWidth={g.ringWidth}
        strokeDasharray={g.dashArray}
        transform={`rotate(${g.rotation} ${C.x} ${C.y})`}
        data-part="ring"
      />
      {g.breakArc && (
        <circle
          cx={C.x}
          cy={C.y}
          r={g.ringRadius}
          stroke="var(--av-seal-broken)"
          strokeWidth={g.ringWidth}
          strokeDasharray={g.breakArc.dashArray}
          strokeDashoffset={g.breakArc.dashOffset}
          transform={`rotate(-90 ${C.x} ${C.y})`}
          data-part="break-arc"
        />
      )}
      {g.showCore && state === "intact" && (
        <>
          <circle cx={C.x} cy={C.y} r={g.coreRadius} fill="var(--av-seal-core-intact)" stroke={ring} strokeWidth={1.5} />
          <path data-part="check" pathLength={1} d="M30 36l4 4 8-9" stroke={ring} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {g.showCore && state === "broken" && (
        <>
          <circle
            cx={C.x}
            cy={C.y}
            r={g.coreRadius}
            fill="var(--av-seal-core-broken)"
            stroke="var(--av-seal-broken)"
            strokeWidth={1.5}
          />
          {g.crackPath && (
            <path
              d={g.crackPath}
              stroke="var(--av-seal-broken)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              data-part="crack"
            />
          )}
        </>
      )}
      {g.showCore && state === "revoked" && (
        <path d="M16 56 L56 16" stroke={ring} strokeWidth={3} strokeLinecap="round" data-part="revoked" />
      )}
    </svg>
  );
}
