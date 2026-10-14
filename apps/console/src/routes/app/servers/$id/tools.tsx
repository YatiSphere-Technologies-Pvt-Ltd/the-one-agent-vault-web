import { createFileRoute } from "@tanstack/react-router";
import { listSearchSchema } from "../../../../modules/data/list-search";
import { useListSearchUpdater } from "../../../../modules/data/use-list-search";
import { ServerTools } from "../../../../modules/servers/ServerTabs";

export const Route = createFileRoute("/app/servers/$id/tools")({
  staticData: { screenId: "MC-04" },
  validateSearch: listSearchSchema,
  component: Screen,
});

function Screen() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const onSearchChange = useListSearchUpdater(Route.useNavigate());
  return <ServerTools id={id} search={search} onSearchChange={onSearchChange} />;
}
