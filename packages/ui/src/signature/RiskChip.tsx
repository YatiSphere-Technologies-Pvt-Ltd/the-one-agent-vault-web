import { useTranslation } from "react-i18next";
import { Circle, Diamond, Square, Triangle } from "lucide-react";
import { cn } from "../lib/cn";

export type RiskLevel = "low" | "medium" | "high" | "critical";

/** Low 0–24, Medium 25–49, High 50–74, Critical 75–100. */
export function riskLevel(score: number): RiskLevel {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  if (s >= 75) return "critical";
  if (s >= 50) return "high";
  if (s >= 25) return "medium";
  return "low";
}

const levelStyle: Record<RiskLevel, { icon: typeof Circle; classes: string }> = {
  low: { icon: Circle, classes: "bg-risk-low-bg text-risk-low-fg" },
  medium: { icon: Triangle, classes: "bg-risk-medium-bg text-risk-medium-fg" },
  high: { icon: Diamond, classes: "bg-risk-high-bg text-risk-high-fg" },
  critical: { icon: Square, classes: "bg-risk-critical-bg text-risk-critical-fg" },
};

export function RiskChip({ score, className }: { score: number; className?: string }) {
  const { t } = useTranslation("ui");
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const level = riskLevel(clamped);
  const { icon: Icon, classes } = levelStyle[level];
  return (
    <span
      data-level={level}
      className={cn(
        "inline-flex items-center gap-1 rounded-control px-2 py-0.5 text-label whitespace-nowrap tabular-nums",
        classes,
        className,
      )}
    >
      <Icon aria-hidden className="size-3 fill-current" />
      {t("risk.label", { level: t(`risk.${level}`), score: clamped })}
    </span>
  );
}
