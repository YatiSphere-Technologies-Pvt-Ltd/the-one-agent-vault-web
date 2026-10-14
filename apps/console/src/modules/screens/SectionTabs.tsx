import { useTranslation } from "react-i18next";
import type { LinkProps } from "@tanstack/react-router";
import { RouteTabs, type RouteTab } from "@agentvault/ui";
import { isReleased, useFlags } from "../../flags";
import { screenById, type ScreenId } from "../../screens";

export type Section = "servers" | "skills" | "activity" | "discovery" | "settings";

/** Pages of each console area, in order. Shared by the section tabs and the sidebar. */
export const sections: Record<Section, { id: ScreenId; to: LinkProps["to"] }[]> = {
  servers: [
    { id: "MC-01", to: "/app/servers" },
    { id: "MC-09", to: "/app/virtual-servers" },
    { id: "MC-10", to: "/app/policies" },
    { id: "MC-15", to: "/app/endpoints" },
  ],
  skills: [
    { id: "SK-01", to: "/app/skills" },
    { id: "SK-08", to: "/app/skill-packs" },
    { id: "SK-09", to: "/app/skills/fleet" },
  ],
  activity: [
    { id: "MC-13", to: "/app/activity/calls" },
    { id: "AD-07", to: "/app/audit" },
  ],
  discovery: [
    { id: "DS-01", to: "/app/discovery" },
    { id: "DS-03", to: "/app/discovery/endpoints" },
    { id: "DS-04", to: "/app/posture" },
  ],
  settings: [
    { id: "AD-01", to: "/app/settings/org" },
    { id: "AD-02", to: "/app/settings/workspaces" },
    { id: "AD-03", to: "/app/settings/members" },
    { id: "AD-04", to: "/app/settings/roles" },
    { id: "AD-05", to: "/app/settings/identity" },
    { id: "AD-06", to: "/app/settings/api-keys" },
    { id: "AD-08", to: "/app/settings/security" },
    { id: "AD-09", to: "/app/settings/dlp" },
    { id: "AD-10", to: "/app/settings/integrations" },
    { id: "AD-11", to: "/app/settings/gateways" },
    { id: "AD-12", to: "/app/settings/licence" },
  ],
};

/** Secondary navigation between sibling pages of one area, filtered by release flags. */
export function SectionTabs({ section }: { section: Section }) {
  const { t } = useTranslation("app");
  const flags = useFlags();
  const tabs: RouteTab[] = sections[section]
    .filter((s) => isReleased(screenById[s.id].release, flags))
    .map((s) => ({ value: s.id, label: t(`screens.${s.id}`), link: { to: s.to }, exact: true }));
  return <RouteTabs tabs={tabs} label={t(`sections.${section}`)} />;
}
