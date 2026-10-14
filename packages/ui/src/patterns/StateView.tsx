import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { CircleAlert, Inbox, Lock, TriangleAlert } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "../primitives/button";
import { Skeleton } from "../primitives/skeleton";
import { CopyButton } from "../signature/CopyButton";

type Common = { className?: string };

export type StateViewProps = Common &
  (
    | { kind: "loading"; layout?: "list" | "detail" | "table" }
    | { kind: "empty"; title?: ReactNode; body?: ReactNode; action?: ReactNode }
    | { kind: "error"; title?: ReactNode; body?: ReactNode; requestId: string; onRetry?: () => void }
    | { kind: "no-access"; title?: ReactNode; owner: string }
    | { kind: "partial"; message: ReactNode; children: ReactNode }
  );

function Frame({ icon, title, children, className }: { icon: ReactNode; title: ReactNode; children?: ReactNode; className?: string | undefined }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-panel border border-edge bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      <span aria-hidden className="text-ink-muted [&_svg]:size-6">
        {icon}
      </span>
      <h2 className="m-0 text-title-3 text-ink">{title}</h2>
      {children}
    </div>
  );
}

function LoadingSkeleton({ layout }: { layout: "list" | "detail" | "table" }) {
  if (layout === "detail") {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }
  const rows = layout === "table" ? 8 : 5;
  return (
    <div className="flex flex-col gap-2">
      {layout === "table" && <Skeleton className="h-(--av-size-row-compact)" />}
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-(--av-size-row-comfortable)" />
      ))}
    </div>
  );
}

/** The five states every list and detail screen implements. Copy comes from the spec. */
export function StateView(props: StateViewProps) {
  const { t } = useTranslation("ui");
  switch (props.kind) {
    case "loading":
      return (
        <div role="status" aria-busy="true" className={props.className}>
          <span className="sr-only">{t("state.loadingLabel")}</span>
          <LoadingSkeleton layout={props.layout ?? "list"} />
        </div>
      );
    case "empty":
      return (
        <Frame icon={<Inbox />} title={props.title ?? t("state.emptyTitle")} className={props.className}>
          {props.body && <p className="m-0 max-w-prose text-body text-ink-secondary">{props.body}</p>}
          {props.action}
        </Frame>
      );
    case "error":
      return (
        <Frame icon={<CircleAlert />} title={props.title ?? t("state.errorTitle")} className={props.className}>
          <p className="m-0 max-w-prose text-body text-ink-secondary">{props.body ?? t("state.errorBody")}</p>
          <div className="flex items-center gap-2 text-body-sm text-ink-muted">
            <span>{t("state.requestId")}</span>
            <code className="font-mono text-mono text-ink">{props.requestId}</code>
            <CopyButton value={props.requestId} label={`${t("common.copy")} ${t("state.requestId")}`} />
          </div>
          {props.onRetry && <Button onClick={props.onRetry}>{t("state.retry")}</Button>}
        </Frame>
      );
    case "no-access":
      return (
        <Frame icon={<Lock />} title={props.title ?? t("state.noAccessTitle")} className={props.className}>
          <p className="m-0 text-body text-ink-secondary">{t("state.noAccessBody", { owner: props.owner })}</p>
        </Frame>
      );
    case "partial":
      return (
        <div className={cn("flex flex-col gap-4", props.className)}>
          <div
            role="status"
            className="flex items-start gap-2 rounded-panel border border-status-held-border bg-status-held-bg p-3 text-body text-status-held-fg"
          >
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="m-0 font-semibold">{t("state.partialTitle")}</p>
              <p className="m-0">{props.message}</p>
            </div>
          </div>
          {props.children}
        </div>
      );
  }
}
