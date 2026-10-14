import { createFileRoute } from "@tanstack/react-router";
import { SkillVersions } from "../../../../modules/skills/SkillsPages";

export const Route = createFileRoute("/app/skills/$id/versions")({
  staticData: { screenId: "SK-06" },
  component: Screen,
});

function Screen() {
  const { id } = Route.useParams();
  return <SkillVersions id={id} />;
}
