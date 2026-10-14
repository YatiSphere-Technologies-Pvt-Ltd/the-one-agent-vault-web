import type { ReactNode } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { formatDateTime, formatRelativeTime, SealGlyph, truncateHash, type SealState } from "@agentvault/ui";

/** Relative time with the absolute time as a tooltip and machine-readable value. */
export function Time({ value }: { value: string }) {
  const { i18n } = useTranslation();
  return (
    <time dateTime={value} title={formatDateTime(value, i18n.language)} className="whitespace-nowrap tabular-nums">
      {formatRelativeTime(value, i18n.language)}
    </time>
  );
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className="font-mono text-mono">{children}</code>;
}

export function Hash({ value }: { value: string }) {
  return (
    <code className="font-mono text-mono text-ink-secondary" title={value}>
      {truncateHash(value)}
    </code>
  );
}

/** Seal + object name linking to its page. */
export function ObjectLink({
  name,
  link,
  seal,
  sub,
}: {
  name: string;
  link: LinkProps;
  seal?: { hash: string; state: SealState };
  sub?: ReactNode;
}) {
  const { t } = useTranslation("ui");
  return (
    <div className="flex items-center gap-2">
      {seal && <SealGlyph hash={seal.hash} state={seal.state} size="sm" label={t(`seal.${seal.state}`)} />}
      <div className="flex min-w-0 flex-col">
        <Link {...link} className="truncate font-mono text-mono text-link hover:text-link-hover hover:underline">
          {name}
        </Link>
        {sub && <span className="truncate text-body-sm text-ink-muted">{sub}</span>}
      </div>
    </div>
  );
}

/** Two-column label/value list for detail panels. */
export function Details({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="m-0 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 flex-col gap-0.5">
          <dt className="text-label text-ink-muted">{item.label}</dt>
          <dd className="m-0 min-w-0 break-words text-body text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Panel({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-4 rounded-panel border border-edge bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="m-0 text-title-3 text-ink">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

/** Number tile for summaries. Tone only adds emphasis; the label carries the meaning. */
export function StatTile({
  label,
  value,
  tone = "neutral",
  link,
}: {
  label: string;
  value: number;
  tone?: "neutral" | "held" | "danger";
  link?: LinkProps;
}) {
  const { i18n } = useTranslation();
  const body = (
    <>
      <span className="text-label text-ink-muted">{label}</span>
      <span
        className={
          tone === "held" ? "text-title-1 text-status-held-fg" : tone === "danger" ? "text-title-1 text-status-danger-fg" : "text-title-1 text-ink"
        }
      >
        {new Intl.NumberFormat(i18n.language).format(value)}
      </span>
    </>
  );
  const classes = "flex flex-col gap-1 rounded-panel border border-edge bg-surface p-4 tabular-nums";
  return link ? (
    <Link {...link} className={`${classes} no-underline hover:bg-hover`}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  );
}
