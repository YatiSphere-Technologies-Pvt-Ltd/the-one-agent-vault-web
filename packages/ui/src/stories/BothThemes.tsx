import type { ReactNode } from "react";

/**
 * Renders the same content on a light panel and a dark panel side by side.
 * The dark panel re-scopes the semantic tokens with data-theme="dark".
 */
export function BothThemes({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div data-theme="light" className="rounded-panel border border-edge bg-canvas p-4 text-ink">
        {children}
      </div>
      <div data-theme="dark" className="rounded-panel border border-edge bg-canvas p-4 text-ink">
        {children}
      </div>
    </div>
  );
}
