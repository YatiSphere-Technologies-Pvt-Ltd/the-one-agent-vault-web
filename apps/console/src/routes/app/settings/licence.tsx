import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/settings/licence")({
  staticData: { screenId: "AD-12" },
  component: () => <ScreenPlaceholder id="AD-12" tabs={<SectionTabs section="settings" />} />,
});
