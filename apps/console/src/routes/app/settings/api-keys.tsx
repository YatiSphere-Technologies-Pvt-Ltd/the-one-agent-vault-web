import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/settings/api-keys")({
  staticData: { screenId: "AD-06" },
  component: () => <ScreenPlaceholder id="AD-06" tabs={<SectionTabs section="settings" />} />,
});
