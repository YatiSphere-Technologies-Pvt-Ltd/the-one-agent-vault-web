import { createFileRoute } from "@tanstack/react-router";
import { listSearchSchema } from "../../modules/data/list-search";
import { useListSearchUpdater } from "../../modules/data/use-list-search";
import { AuditPage } from "../../modules/activity/ActivityPages";

export const Route = createFileRoute("/app/audit")({
  staticData: { screenId: "AD-07" },
  validateSearch: listSearchSchema,
  component: Screen,
});

function Screen() {
  const search = Route.useSearch();
  const onSearchChange = useListSearchUpdater(Route.useNavigate());
  return <AuditPage search={search} onSearchChange={onSearchChange} />;
}
