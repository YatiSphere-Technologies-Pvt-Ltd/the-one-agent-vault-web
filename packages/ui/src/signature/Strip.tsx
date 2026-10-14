import { useId, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { CircleCheck, Lock, ShieldAlert, UserRound } from "lucide-react";
import { cn } from "../lib/cn";

export type StripState = "person" | "policy" | "approved" | "closed";

export interface StripProps {
  state: StripState;
  /** Short time, e.g. "12 min". */
  time: string;
  /** Below the time, e.g. "waiting". */
  timeNote: string;
  who: ReactNode;
  what: ReactNode;
  /** Optional: without it (and without actions) the strip is the compact three-column form. */
  why?: ReactNode;
  /** Large (44 px) buttons. */
  actions?: ReactNode;
  className?: string;
}

const bay: Record<StripState, { classes: string; icon: typeof Lock }> = {
  person: { classes: "bg-strip-person-bg text-strip-person-fg", icon: UserRound },
  policy: { classes: "bg-strip-policy-bg text-strip-policy-fg", icon: ShieldAlert },
  approved: { classes: "bg-strip-approved-bg text-strip-approved-fg", icon: CircleCheck },
  closed: { classes: "bg-strip-closed-bg text-strip-closed-fg", icon: Lock },
};

/** One approval or held-call row. Render inside StripList. */
export function Strip({ state, time, timeNote, who, what, why, actions, className }: StripProps) {
  const { t } = useTranslation("ui");
  const { classes, icon: Icon } = bay[state];
  const compact = why === undefined && actions === undefined;
  return (
    <li
      data-state={state}
      data-compact={compact || undefined}
      className={cn("av-strip overflow-hidden rounded-control border border-edge bg-surface", className)}
    >
      <div className={cn("flex items-center gap-2 p-3 md:flex-col md:items-start md:gap-1", classes)}>
        <Icon aria-hidden className="size-4" />
        <span className="sr-only">{t(`strip.${state}`)}, </span>
        <span className="text-title-3">{time}</span>
        <span className="text-caption">{timeNote}</span>
      </div>
      <div className="min-w-0 p-3 text-body">{who}</div>
      <div className="min-w-0 p-3 text-body">{what}</div>
      {why !== undefined && <div className="min-w-0 p-3 text-body text-ink-secondary">{why}</div>}
      {actions && <div className="flex flex-wrap items-center gap-2 p-3 md:justify-end">{actions}</div>}
    </li>
  );
}

export function StripList({
  heading,
  children,
  className,
}: {
  heading: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={cn("flex flex-col gap-3", className)}>
      <h2 id={id} className="text-title-3 text-ink">
        {heading}
      </h2>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">{children}</ul>
    </section>
  );
}
