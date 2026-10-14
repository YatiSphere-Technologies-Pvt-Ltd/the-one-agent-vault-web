import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/posture")({
  staticData: { screenId: "DS-04" },
  component: () => <ScreenPlaceholder id="DS-04" tabs={<SectionTabs section="discovery" />} />,
});
