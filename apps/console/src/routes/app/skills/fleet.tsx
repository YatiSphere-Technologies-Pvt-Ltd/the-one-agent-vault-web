import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";
import { SectionTabs } from "../../../modules/screens/SectionTabs";

export const Route = createFileRoute("/app/skills/fleet")({
  staticData: { screenId: "SK-09" },
  component: () => <ScreenPlaceholder id="SK-09" tabs={<SectionTabs section="skills" />} />,
});
