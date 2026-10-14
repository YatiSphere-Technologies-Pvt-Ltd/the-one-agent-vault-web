import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn, SealGlyph, SkipLink, StatusPill, WORDMARK_HASH } from "@agentvault/ui";

// Sample objects for the brand panel's seal check (decorative, labelled as sample data).
const ledger = [
  { kind: "server", name: "salesforce-crm", hash: "sha256:9f2c41d0b7a3e5c8f1d24a6b90e7c3f5d81e2a4c6b8d0f1e3a5c7e9b2d4fe81a" },
  { kind: "skill", name: "contract-review", hash: "sha256:3b7e0c9a4f12d6e8b5a1c3f7e9d2b4a6c8e0f1d3b5a7c9e2f4d6b8a0c1e3d5f7" },
  { kind: "model", name: "drafting", hash: "sha256:0a7d52c9e81f3b6a4d0c2e5f7a9b1c3d5e7f9a1b3c5d7e9f0a2b4c6d8e0f2a4b" },
  { kind: "agent", name: "invoice-processing", hash: "sha256:c4e19b7a2f05d83e6a1b9c7d5e3f1a0b2c4d6e8f0a1b3c5d7e9f2a4b6c8d0e1f" },
] as const;

const short = (hash: string) => `${hash.slice(7, 13)}…${hash.slice(-4)}`;

function Wordmark({ className }: { className?: string }) {
  const { t } = useTranslation("ui");
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <SealGlyph hash={WORDMARK_HASH} state="intact" size="md" label={t("shell.wordmark")} decorative />
      <span className="text-title-2 text-ink">{t("shell.wordmark")}</span>
    </span>
  );
}

/** Dark brand panel (desktop): the seal, the promise, and a sample seal check. */
function BrandPanel() {
  const { t } = useTranslation("app");
  return (
    <aside
      data-theme="dark"
      className="relative hidden overflow-hidden bg-canvas text-ink lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:justify-between lg:gap-8 lg:p-10 xl:p-16"
    >
      <SealGlyph
        hash={WORDMARK_HASH}
        state="intact"
        size="xl"
        label=""
        decorative
        className="pointer-events-none absolute -end-16 -bottom-16 size-96 opacity-10"
      />
      <Wordmark className="relative" />

      <div className="relative flex min-h-0 flex-col gap-8 short:gap-5">
        <SealGlyph
          hash={ledger[0].hash}
          state="intact"
          size="xl"
          label=""
          decorative
          className="av-seal-draw size-28 xl:size-40 short:size-20"
        />
        <div className="flex flex-col gap-3">
          <p className="m-0 max-w-lg text-title-1 text-ink xl:text-display">{t("auth.brand.title")}</p>
          <p className="m-0 max-w-lg text-body text-ink-secondary xl:text-title-3 xl:font-normal">{t("auth.brand.lead")}</p>
        </div>

        <div aria-hidden className="max-w-lg rounded-overlay border border-edge bg-surface short:hidden">
          <div className="border-b border-edge-subtle px-4 py-3">
            <span className="text-label text-ink">{t("auth.brand.ledger")}</span>
          </div>
          <ul className="m-0 flex list-none flex-col p-0">
            {ledger.map((row, i) => (
              <li
                key={row.name}
                style={{ "--i": i + 3 } as React.CSSProperties}
                className="av-rise flex items-center gap-3 border-b border-edge-subtle px-4 py-3 last:border-b-0"
              >
                <SealGlyph hash={row.hash} state="intact" size="sm" label="" decorative />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-mono text-mono text-ink">{row.name}</span>
                  <span className="text-caption text-ink-muted">
                    {t(`auth.brand.kinds.${row.kind}`)} · <span className="font-mono">{short(row.hash)}</span>
                  </span>
                </div>
                <span style={{ "--i": i + 5 } as React.CSSProperties} className="av-rise">
                  <StatusPill status="inSync" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="relative m-0 text-caption text-ink-muted">{t("auth.help")}</p>
    </aside>
  );
}

/** Chrome for every sign-in screen: brand panel on desktop, wordmark header on smaller screens. */
export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation("app");
  return (
    <div className="grid min-h-dvh bg-canvas text-ink lg:grid-cols-2">
      <SkipLink />
      <BrandPanel />
      <div className="flex min-h-dvh min-w-0 flex-col lg:bg-surface">
        <header className="flex justify-center px-4 pt-10 pb-6 sm:pt-16 lg:hidden">
          <Wordmark />
        </header>
        <main
          id="main"
          tabIndex={-1}
          className="mx-auto flex w-full max-w-(--av-size-dialog) flex-1 flex-col justify-center px-4 pb-10 outline-none sm:px-6 lg:px-10 lg:py-12"
        >
          {children}
        </main>
        <footer className="px-4 pb-8 text-center text-caption text-ink-muted lg:hidden">{t("auth.help")}</footer>
      </div>
    </div>
  );
}

export function AuthCard({ title, lead, children }: { title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section
      aria-labelledby="auth-title"
      className="flex flex-col gap-6 rounded-overlay border border-edge bg-surface p-6 sm:p-8 lg:border-0 lg:bg-transparent lg:p-0"
    >
      <div className="flex flex-col gap-2">
        <h1 id="auth-title" className="m-0 text-title-2 text-ink lg:text-title-1">
          {title}
        </h1>
        {lead && <p className="m-0 text-body text-ink-secondary">{lead}</p>}
      </div>
      {children}
    </section>
  );
}

/** The moment between signing in and arriving: the seal's check draws, then we continue. */
export function SealVerified({ name, destination }: { name: string; destination: string }) {
  const { t } = useTranslation("app");
  return (
    <div role="status" className="flex flex-col items-center gap-4 py-8 text-center">
      <SealGlyph hash={WORDMARK_HASH} state="intact" size="xl" label="" decorative className="av-seal-draw" />
      <p className="m-0 text-title-2 text-ink">{t("auth.success.title")}</p>
      <p className="m-0 text-body text-ink-secondary">{t("auth.success.body", { name, destination })}</p>
    </div>
  );
}

/** How long the verified moment shows before navigating (none with reduced motion). */
export function verifiedPauseMs(): number {
  return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 1400;
}

export const LAST_METHOD_KEY = "av.auth.last";
