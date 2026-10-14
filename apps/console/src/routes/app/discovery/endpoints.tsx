import { createFileRoute } from "@tanstack/react-router";
import { listSearchSchema } from "../../../modules/data/list-search";
import { useListSearchUpdater } from "../../../modules/data/use-list-search";
import { EndpointsPage } from "../../../modules/discovery/DiscoveryPages";

export const Route = createFileRoute("/app/discovery/endpoints")({
  staticData: { screenId: "DS-03" },
  validateSearch: listSearchSchema,
  component: Screen,
});

function Screen() {
  const search = Route.useSearch();
  const onSearchChange = useListSearchUpdater(Route.useNavigate());
  return <EndpointsPage search={search} onSearchChange={onSearchChange} />;
}
