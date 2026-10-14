import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/settings/org")({
  staticData: { screenId: "AD-01" },
  component: () => <ScreenPlaceholder id="AD-01" tabs={<SectionTabs section="settings" />} />,
});
