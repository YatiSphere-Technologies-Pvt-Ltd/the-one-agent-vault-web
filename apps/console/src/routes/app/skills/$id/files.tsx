import { createFileRoute } from "@tanstack/react-router";
import { SkillFiles } from "../../../../modules/skills/SkillsPages";

export const Route = createFileRoute("/app/skills/$id/files")({
  staticData: { screenId: "SK-04" },
  component: Screen,
});

function Screen() {
  const { id } = Route.useParams();
  return <SkillFiles id={id} />;
}
