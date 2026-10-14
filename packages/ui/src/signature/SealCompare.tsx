import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";
import { formatDateTime, truncateHash } from "../lib/format";
import { CopyButton } from "./CopyButton";
import { SealGlyph } from "./SealGlyph";

export interface PinnedDefinition {
  hash: string;
  version: string | number;
  approvedAt: string;
  approvedBy: string;
  toolCount: number;
}

export interface ServedDefinition {
  hash: string;
  seenAt: string;
  gateway: string;
  changedCount: number;
}

export interface SealCompareProps {
  pinned: PinnedDefinition;
  served: ServedDefinition | null;
  className?: string;
}

function HashLine({ hash }: { hash: string }) {
  const { t } = useTranslation("ui");
  return (
    <div className="flex items-center gap-1">
      <code className="font-mono text-mono text-ink-secondary" title={hash}>
        {truncateHash(hash)}
      </code>
      <CopyButton value={hash} label={t("seal.copyHash")} />
    </div>
  );
}

function Panel({
  heading,
  seal,
  children,
  tone,
}: {
  heading: string;
  seal: ReactNode;
  children: ReactNode;
  tone: "intact" | "held";
}) {
  return (
    <section
      aria-label={heading}
      className={cn(
        "flex flex-1 items-start gap-4 rounded-panel border p-5",
        tone === "intact" ? "border-edge bg-surface" : "border-status-held-border bg-status-held-bg",
      )}
    >
      {seal}
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="text-label text-ink-muted">{heading}</h3>
        {children}
      </div>
    </section>
  );
}

/** Pinned (approved) definition beside the definition the gateway is actually serving. */
export function SealCompare({ pinned, served, className }: SealCompareProps) {
  const { t, i18n } = useTranslation("ui");
  const when = (v: string) => formatDateTime(v, i18n.language);
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row", className)}>
      <Panel
        tone="intact"
        heading={t("seal.pinned")}
        seal={
          <SealGlyph
            hash={pinned.hash}
            state="intact"
            size="xl"
            label={`${t("seal.intact")} ${pinned.version}`}
          />
        }
      >
        <p className="text-title-3 text-ink">{t("seal.version", { version: pinned.version })}</p>
        <p className="text-body-sm text-ink-secondary">
          {t("seal.approvedBy", { name: pinned.approvedBy })} · {t("seal.approvedAt", { time: when(pinned.approvedAt) })}
        </p>
        <HashLine hash={pinned.hash} />
        <p className="text-body-sm text-ink-secondary">{t("seal.toolCount", { count: pinned.toolCount })}</p>
        {served === null && <p className="text-body-sm text-status-success-fg">{t("seal.matches")}</p>}
      </Panel>
      {served && (
        <Panel
          tone="held"
          heading={t("seal.served")}
          seal={<SealGlyph hash={served.hash} state="broken" size="xl" label={t("seal.broken")} />}
        >
          <p className="text-title-3 text-status-held-fg">
            {t("seal.toolsDiffer", { changed: served.changedCount, total: pinned.toolCount })}
          </p>
          <p className="text-body-sm text-ink-secondary">
            {t("seal.seenAt", { time: when(served.seenAt) })} · {t("seal.gateway", { gateway: served.gateway })}
          </p>
          <HashLine hash={served.hash} />
        </Panel>
      )}
    </div>
  );
}
