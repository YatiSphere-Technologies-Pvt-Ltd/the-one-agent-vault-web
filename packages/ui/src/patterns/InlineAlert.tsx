import { forwardRef, type ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "../lib/cn";
import { toneClasses } from "../status";

export interface InlineAlertProps {
  tone: "info" | "success" | "held" | "danger";
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const icons = { info: Info, success: CircleCheck, held: TriangleAlert, danger: CircleAlert };

/**
 * A message inside a page or form (not a toast). Danger and held use role="alert" so they are
 * announced; it accepts a ref and tabIndex -1 so forms can move focus to an error summary.
 */
export const InlineAlert = forwardRef<HTMLDivElement, InlineAlertProps>(function InlineAlert(
  { tone, title, children, className },
  ref,
) {
  const Icon = icons[tone];
  const t = toneClasses[tone];
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={tone === "danger" || tone === "held" ? "alert" : "status"}
      className={cn("flex items-start gap-2 rounded-panel border p-3 text-body outline-none", t.bg, t.border, t.fg, className)}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div className="flex min-w-0 flex-col gap-0.5">
        {title && <p className="m-0 font-semibold">{title}</p>}
        {children && <div className="text-ink-secondary">{children}</div>}
      </div>
    </div>
  );
});
