import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/policies")({
  staticData: { screenId: "MC-10" },
  component: () => <ScreenPlaceholder id="MC-10" tabs={<SectionTabs section="servers" />} />,
});
