import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/settings/security")({
  staticData: { screenId: "AD-08" },
  component: () => <ScreenPlaceholder id="AD-08" tabs={<SectionTabs section="settings" />} />,
});
