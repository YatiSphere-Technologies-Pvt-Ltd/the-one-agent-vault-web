import { createFileRoute } from "@tanstack/react-router";
import { listSearchSchema } from "../../../modules/data/list-search";
import { useListSearchUpdater } from "../../../modules/data/use-list-search";
import { ServersPage } from "../../../modules/servers/ServersPage";

export const Route = createFileRoute("/app/servers/")({
  staticData: { screenId: "MC-01" },
  validateSearch: listSearchSchema,
  component: Screen,
});

function Screen() {
  const search = Route.useSearch();
  const onSearchChange = useListSearchUpdater(Route.useNavigate());
  return <ServersPage search={search} onSearchChange={onSearchChange} />;
}
