import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/settings/integrations")({
  staticData: { screenId: "AD-10" },
  component: () => <ScreenPlaceholder id="AD-10" tabs={<SectionTabs section="settings" />} />,
});
