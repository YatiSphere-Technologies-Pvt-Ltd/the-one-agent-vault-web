import { createFileRoute } from "@tanstack/react-router";
import { listSearchSchema } from "../../../../modules/data/list-search";
import { useListSearchUpdater } from "../../../../modules/data/use-list-search";
import { ServerVersions } from "../../../../modules/servers/ServerTabs";

export const Route = createFileRoute("/app/servers/$id/versions")({
  staticData: { screenId: "MC-05" },
  validateSearch: listSearchSchema,
  component: Screen,
});

function Screen() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const onSearchChange = useListSearchUpdater(Route.useNavigate());
  return <ServerVersions id={id} search={search} onSearchChange={onSearchChange} />;
}
