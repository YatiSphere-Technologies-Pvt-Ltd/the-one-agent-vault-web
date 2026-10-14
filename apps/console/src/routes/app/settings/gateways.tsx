import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/settings/gateways")({
  staticData: { screenId: "AD-11" },
  component: () => <ScreenPlaceholder id="AD-11" tabs={<SectionTabs section="settings" />} />,
});
