import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/virtual-servers")({
  staticData: { screenId: "MC-09" },
  component: () => <ScreenPlaceholder id="MC-09" tabs={<SectionTabs section="servers" />} />,
});
