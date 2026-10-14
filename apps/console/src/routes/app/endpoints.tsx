import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/endpoints")({
  staticData: { screenId: "MC-15" },
  component: () => <ScreenPlaceholder id="MC-15" tabs={<SectionTabs section="servers" />} />,
});
