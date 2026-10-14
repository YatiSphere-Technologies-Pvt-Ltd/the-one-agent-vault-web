import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/settings/workspaces")({
  staticData: { screenId: "AD-02" },
  component: () => <ScreenPlaceholder id="AD-02" tabs={<SectionTabs section="settings" />} />,
});
