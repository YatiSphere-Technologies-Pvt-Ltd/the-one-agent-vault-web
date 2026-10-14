import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { foundation, semanticColors, tokens } from "@agentvault/tokens";
import { SealGlyph } from "../signature/SealGlyph";
import { sealGeometry } from "../signature/seal-geometry";

const meta = { title: "Foundations" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="m-0 text-title-2">{title}</h2>
      {children}
    </section>
  );
}

/** Swatch whose fill is the CSS variable itself, so it always shows the live theme value. */
function Swatch({ name }: { name: (typeof semanticColors)[number] }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    ref.current?.style.setProperty("background", `var(--av-${name})`);
  }, [name]);
  return (
    <div className="flex items-center gap-3 rounded-control border border-edge-subtle bg-surface p-2">
      <span ref={ref} aria-hidden className="size-8 shrink-0 rounded-control border border-edge" />
      <div className="flex min-w-0 flex-col">
        <code className="truncate font-mono text-mono-sm text-ink">{name}</code>
        <span className="font-mono text-mono-sm text-ink-muted">
          {tokens.color.light[name]} · {tokens.color.dark[name]}
        </span>
      </div>
    </div>
  );
}

export const Colour: Story = {
  render: () => (
    <Section title="Semantic colour (light value · dark value)">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {semanticColors.map((name) => (
          <Swatch key={name} name={name} />
        ))}
      </div>
    </Section>
  ),
};

const textStyles = ["display", "title-1", "title-2", "title-3", "body", "body-sm", "label", "caption", "mono", "mono-sm"] as const;
const textClass: Record<(typeof textStyles)[number], string> = {
  display: "text-display",
  "title-1": "text-title-1",
  "title-2": "text-title-2",
  "title-3": "text-title-3",
  body: "text-body",
  "body-sm": "text-body-sm",
  label: "text-label",
  caption: "text-caption",
  mono: "font-mono text-mono",
  "mono-sm": "font-mono text-mono-sm",
};

export const Type: Story = {
  render: () => (
    <Section title="Type scale: IBM Plex Sans, Plex Mono for hashes and IDs only">
      <div className="flex flex-col gap-3">
        {textStyles.map((style) => {
          const t = foundation.text[style];
          return (
            <div key={style} className="flex items-baseline gap-6 border-b border-edge-subtle pb-3">
              <code className="w-24 shrink-0 font-mono text-mono-sm text-ink-muted">{style}</code>
              <span className={textClass[style]}>Trust you can check</span>
              <span className="ms-auto font-mono text-mono-sm text-ink-muted">
                {t.size} / {t.line} · {t.weight}
              </span>
            </div>
          );
        })}
      </div>
    </Section>
  ),
};

const spaceClass: Record<string, string> = {
  "0": "w-0", "0-5": "w-0.5", "1": "w-1", "2": "w-2", "3": "w-3", "4": "w-4", "5": "w-5",
  "6": "w-6", "8": "w-8", "10": "w-10", "12": "w-12", "16": "w-16",
};

export const Spacing: Story = {
  render: () => (
    <Section title="Spacing steps (Tailwind step = px)">
      <div className="flex flex-col gap-2">
        {Object.entries(foundation.space).map(([step, value]) => (
          <div key={step} className="flex items-center gap-4">
            <code className="w-12 font-mono text-mono-sm text-ink-muted">{step.replace("-", ".")}</code>
            <span className={`h-4 bg-action-primary-bg ${spaceClass[step] ?? ""}`} />
            <span className="font-mono text-mono-sm text-ink-muted">{value}</span>
          </div>
        ))}
      </div>
    </Section>
  ),
};

const radiusClass = { none: "rounded-none", control: "rounded-control", panel: "rounded-panel", overlay: "rounded-overlay", pill: "rounded-pill" } as const;

export const Radius: Story = {
  render: () => (
    <Section title="Radius">
      <div className="flex flex-wrap gap-4">
        {(Object.keys(radiusClass) as (keyof typeof radiusClass)[]).map((r) => (
          <div key={r} className="flex flex-col items-center gap-2">
            <span className={`size-16 border border-edge-strong bg-surface ${radiusClass[r]}`} />
            <code className="font-mono text-mono-sm text-ink-muted">
              {r} {foundation.radius[r]}
            </code>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Elevation: Story = {
  render: () => (
    <Section title="Elevation: borders for structure, shadows only on overlays">
      <div className="flex flex-wrap gap-6">
        <div className="flex size-40 items-end rounded-panel border border-edge bg-surface p-3 text-caption">surface + border</div>
        <div className="flex size-40 items-end rounded-overlay border border-edge bg-raised p-3 text-caption shadow-overlay">shadow-overlay (menus, drawers)</div>
        <div className="flex size-40 items-end rounded-overlay border border-edge bg-raised p-3 text-caption shadow-dialog">shadow-dialog</div>
      </div>
    </Section>
  ),
};

export const Motion: Story = {
  render: function Render() {
    const [on, setOn] = useState(false);
    return (
      <Section title="Motion: fast 120 ms, base 200 ms, slow 280 ms; zero with reduced motion">
        <button type="button" className="w-fit rounded-control border border-edge-strong px-3 py-1 text-label" onClick={() => setOn(!on)}>
          Toggle
        </button>
        {(["fast", "base", "slow"] as const).map((speed) => (
          <div key={speed} className="flex items-center gap-4">
            <code className="w-12 font-mono text-mono-sm text-ink-muted">{speed}</code>
            <div className="h-6 w-64 rounded-control bg-sunken">
              <span
                className={`block h-6 rounded-control bg-action-primary-bg transition-all ease-standard ${
                  speed === "fast" ? "duration-(--av-motion-fast)" : speed === "base" ? "duration-(--av-motion-base)" : "duration-(--av-motion-slow)"
                } ${on ? "w-full" : "w-8"}`}
              />
            </div>
            <span className="font-mono text-mono-sm text-ink-muted">{foundation.motion[speed]}</span>
          </div>
        ))}
      </Section>
    );
  },
};

const anatomyHash = "sha256:9f2c41d0b7a3e5c8f1d24a6b90e7c3f5d81e2a4c6b8d0f1e3a5c7e9b2d4fe81a";

export const SealAnatomy: Story = {
  name: "Seal anatomy",
  render: () => {
    const g = sealGeometry(anatomyHash, "broken", 96);
    return (
      <Section title="Seal anatomy">
        <div className="flex flex-wrap items-start gap-8">
          <SealGlyph hash={anatomyHash} state="intact" size="xl" label="Seal intact" />
          <SealGlyph hash={anatomyHash} state="broken" size="xl" label="Seal broken" />
          <ul className="m-0 flex max-w-prose flex-col gap-2 ps-4 text-body">
            <li>Ring: radius {g.ringRadius}, width {g.ringWidth}. Its dash pattern (12 dashes from the first 12 hex digits) and rotation ({g.rotation}° from digits 13–14) are unique to the approved definition hash.</li>
            <li>Core: radius {g.coreRadius} with a check mark when intact. Drawn from 40 px up; below that only the ring.</li>
            <li>Break: when the served definition differs, a rust arc and a crack appear at the upper right, never rotated.</li>
            <li>The seal never carries meaning alone: a status pill or text always sits beside it.</li>
          </ul>
        </div>
      </Section>
    );
  },
};
