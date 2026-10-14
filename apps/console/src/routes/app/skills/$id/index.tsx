import { createFileRoute } from "@tanstack/react-router";
import { SkillOverview } from "../../../../modules/skills/SkillsPages";

export const Route = createFileRoute("/app/skills/$id/")({
  staticData: { screenId: "SK-03" },
  component: Screen,
});

function Screen() {
  const { id } = Route.useParams();
  return <SkillOverview id={id} />;
}
