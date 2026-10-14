import { createFileRoute } from "@tanstack/react-router";
import { listSearchSchema } from "../../../../modules/data/list-search";
import { useListSearchUpdater } from "../../../../modules/data/use-list-search";
import { ServerActivity } from "../../../../modules/servers/ServerTabs";

export const Route = createFileRoute("/app/servers/$id/activity")({
  staticData: { screenId: "MC-08" },
  validateSearch: listSearchSchema,
  component: Screen,
});

function Screen() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const onSearchChange = useListSearchUpdater(Route.useNavigate());
  return <ServerActivity id={id} search={search} onSearchChange={onSearchChange} />;
}
