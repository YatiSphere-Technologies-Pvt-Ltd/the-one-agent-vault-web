import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { CommandPaletteItem } from "@agentvault/ui";
import { isReleased, useFlags } from "../../flags";
import { screens } from "../../screens";

/** Palette entries: every routable screen allowed by the release flags, plus the reference page. */
export function usePaletteItems(): CommandPaletteItem[] {
  const { t } = useTranslation("app");
  const navigate = useNavigate();
  const flags = useFlags();
  return useMemo(() => {
    const items: CommandPaletteItem[] = screens
      .filter((s) => s.kind !== "overlay" && isReleased(s.release, flags))
      .map((s) => ({
        id: s.id,
        label: t(`screens.${s.id}`),
        group: s.area === "portal" ? t("palette.portal") : t("palette.console"),
        keywords: [s.id, s.route],
        hint: s.id,
        onSelect: () => void navigate({ href: s.sample }),
      }));
    items.push({
      id: "reference",
      label: t("palette.reference"),
      group: t("palette.design"),
      keywords: ["reference", "benchmark"],
      onSelect: () => void navigate({ to: "/app/_reference" }),
    });
    return items;
  }, [t, navigate, flags]);
}
