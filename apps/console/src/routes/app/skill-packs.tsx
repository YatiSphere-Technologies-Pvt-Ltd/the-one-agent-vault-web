import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/skill-packs")({
  staticData: { screenId: "SK-08" },
  component: () => <ScreenPlaceholder id="SK-08" tabs={<SectionTabs section="skills" />} />,
});
