import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "../lib/cn";
import { useTheme, type ThemePreference } from "./ThemeProvider";

const options: { value: ThemePreference; icon: typeof Sun }[] = [
  { value: "system", icon: Monitor },
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
];

/** Segmented System / Light / Dark control. Arrow keys move between options (native radios). */
export function ThemeSwitch({ className }: { className?: string }) {
  const { t } = useTranslation("ui");
  const { preference, setPreference } = useTheme();
  const name = useId();
  return (
    <fieldset className={cn("flex flex-col gap-1", className)}>
      <legend className="text-label text-ink-muted">{t("theme.label")}</legend>
      <div className="mt-1 inline-flex rounded-control border border-edge-strong bg-surface p-0.5">
        {options.map(({ value, icon: Icon }) => (
          <label
            key={value}
            className={cn(
              "flex min-h-6 cursor-pointer items-center gap-1 rounded-control px-2 py-0.5 text-label text-ink-muted",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus has-[:focus-visible]:outline-offset-2",
              preference === value && "bg-selected font-semibold text-ink",
            )}
          >
            <input
              type="radio"
              className="sr-only"
              name={name}
              value={value}
              checked={preference === value}
              onChange={() => setPreference(value)}
            />
            <Icon aria-hidden className="size-4" />
            {t(`theme.${value}`)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
