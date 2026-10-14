import { createFileRoute } from "@tanstack/react-router";
import { listSearchSchema } from "../../../modules/data/list-search";
import { useListSearchUpdater } from "../../../modules/data/use-list-search";
import { SkillsPage } from "../../../modules/skills/SkillsPages";

export const Route = createFileRoute("/app/skills/")({
  staticData: { screenId: "SK-01" },
  validateSearch: listSearchSchema,
  component: Screen,
});

function Screen() {
  const search = Route.useSearch();
  const onSearchChange = useListSearchUpdater(Route.useNavigate());
  return <SkillsPage search={search} onSearchChange={onSearchChange} />;
}
