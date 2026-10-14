import { createFileRoute } from "@tanstack/react-router";
import { listSearchSchema } from "../../../../modules/data/list-search";
import { useListSearchUpdater } from "../../../../modules/data/use-list-search";
import { SkillFindings } from "../../../../modules/skills/SkillsPages";

export const Route = createFileRoute("/app/skills/$id/findings")({
  staticData: { screenId: "SK-05" },
  validateSearch: listSearchSchema,
  component: Screen,
});

function Screen() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const onSearchChange = useListSearchUpdater(Route.useNavigate());
  return <SkillFindings id={id} search={search} onSearchChange={onSearchChange} />;
}
