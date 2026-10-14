import { Strip, type StripState } from "@agentvault/ui";
import "../lib/ui";

/** One example decision, rendered with the shared Strip (compact, three columns). */
export function DecisionStrip({ state, time, note, tool, reason }: { state: StripState; time: string; note: string; tool: string; reason: string }) {
  return (
    <Strip
      state={state}
      time={time}
      timeNote={note}
      who={<code className="font-mono text-mono font-semibold text-ink">{tool}</code>}
      what={<span className="text-site-small text-ink-secondary">{reason}</span>}
    />
  );
}
