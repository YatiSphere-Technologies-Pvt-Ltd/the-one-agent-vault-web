import { createFileRoute } from "@tanstack/react-router";
import { listSearchSchema } from "../../../modules/data/list-search";
import { useListSearchUpdater } from "../../../modules/data/use-list-search";
import { DiscoveryPage } from "../../../modules/discovery/DiscoveryPages";

export const Route = createFileRoute("/app/discovery/")({
  staticData: { screenId: "DS-01" },
  validateSearch: listSearchSchema,
  component: Screen,
});

function Screen() {
  const search = Route.useSearch();
  const onSearchChange = useListSearchUpdater(Route.useNavigate());
  return <DiscoveryPage search={search} onSearchChange={onSearchChange} />;
}
