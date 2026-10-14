import { Fragment, type ReactNode } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { RiskChip } from "../signature/RiskChip";
import { SealGlyph, type SealState } from "../signature/SealGlyph";
import { StatusPill } from "../signature/StatusPill";
import type { StatusVocabulary } from "../status";
import { OverflowMenu, type OverflowItem } from "./OverflowMenu";

export interface Breadcrumb {
  label: string;
  link?: LinkProps;
}

export interface PageHeaderProps {
  title: ReactNode;
  breadcrumbs?: Breadcrumb[];
  /** Small line under the title, e.g. the screen ID or object ID (mono). */
  meta?: ReactNode;
  seal?: { hash: string; state: SealState; label: string };
  status?: StatusVocabulary;
  risk?: number;
  /** One primary action at inline-end. */
  primaryAction?: ReactNode;
  /** Secondary actions next to the primary one. */
  secondaryActions?: ReactNode;
  overflow?: OverflowItem[];
  className?: string;
}

export function PageHeader({
  title,
  breadcrumbs,
  meta,
  seal,
  status,
  risk,
  primaryAction,
  secondaryActions,
  overflow,
  className,
}: PageHeaderProps) {
  const { t } = useTranslation("ui");
  return (
    <header className={cn("flex flex-col gap-2", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label={t("shell.breadcrumb")}>
          <ol className="m-0 flex list-none flex-wrap items-center gap-1 p-0 text-body-sm">
            {breadcrumbs.map((crumb, index) => {
              const last = index === breadcrumbs.length - 1;
              return (
                <Fragment key={`${crumb.label}-${index}`}>
                  <li>
                    {crumb.link && !last ? (
                      <Link {...crumb.link} className="text-link underline-offset-2 hover:text-link-hover hover:underline">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-ink-muted" aria-current={last ? "page" : undefined}>
                        {crumb.label}
                      </span>
                    )}
                  </li>
                  {!last && (
                    <li aria-hidden className="flex text-ink-muted">
                      <ChevronRight className="size-3 rtl:rotate-180" />
                    </li>
                  )}
                </Fragment>
              );
            })}
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {seal && <SealGlyph hash={seal.hash} state={seal.state} size="md" label={seal.label} />}
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="m-0 text-title-1 text-ink">{title}</h1>
              {status && <StatusPill status={status} />}
              {risk !== undefined && <RiskChip score={risk} />}
            </div>
            {meta && <div className="text-caption text-ink-muted">{meta}</div>}
          </div>
        </div>
        {(primaryAction || secondaryActions || (overflow && overflow.length > 0)) && (
          <div className="flex flex-wrap items-center gap-2">
            {secondaryActions}
            {primaryAction}
            {overflow && <OverflowMenu items={overflow} />}
          </div>
        )}
      </div>
    </header>
  );
}
