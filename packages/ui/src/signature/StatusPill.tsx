import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";
import { statusLabelKey, statusTone, toneClasses, type StatusVocabulary } from "../status";

export interface StatusPillProps {
  /** Text and tone come only from the vocabulary; custom text is not accepted. */
  status: StatusVocabulary;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  const { t } = useTranslation("ui");
  const tone = toneClasses[statusTone[status]];
  return (
    <span
      data-status={status}
      data-tone={statusTone[status]}
      className={cn(
        "inline-flex items-center gap-1 rounded-pill border px-2 py-0.5 text-label font-semibold whitespace-nowrap",
        tone.fg,
        tone.bg,
        tone.border,
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 shrink-0 rounded-pill", tone.solid)} />
      {t(statusLabelKey(status))}
    </span>
  );
}
