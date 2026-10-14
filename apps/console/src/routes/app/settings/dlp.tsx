import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/settings/dlp")({
  staticData: { screenId: "AD-09" },
  component: () => <ScreenPlaceholder id="AD-09" tabs={<SectionTabs section="settings" />} />,
});
