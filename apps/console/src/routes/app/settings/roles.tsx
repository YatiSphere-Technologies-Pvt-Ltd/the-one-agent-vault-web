import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/settings/roles")({
  staticData: { screenId: "AD-04" },
  component: () => <ScreenPlaceholder id="AD-04" tabs={<SectionTabs section="settings" />} />,
});
