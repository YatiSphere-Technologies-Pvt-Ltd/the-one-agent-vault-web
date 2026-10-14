import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/settings/identity")({
  staticData: { screenId: "AD-05" },
  component: () => <ScreenPlaceholder id="AD-05" tabs={<SectionTabs section="settings" />} />,
});
