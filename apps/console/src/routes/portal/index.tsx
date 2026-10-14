import { createFileRoute } from "@tanstack/react-router";
import { listSearchSchema } from "../../modules/data/list-search";
import { useListSearchUpdater } from "../../modules/data/use-list-search";
import { CataloguePage } from "../../modules/portal/CataloguePage";

export const Route = createFileRoute("/portal/")({
  staticData: { screenId: "PT-01" },
  validateSearch: listSearchSchema,
  component: Screen,
});

function Screen() {
  const search = Route.useSearch();
  const onSearchChange = useListSearchUpdater(Route.useNavigate());
  return <CataloguePage search={search} onSearchChange={onSearchChange} />;
}
