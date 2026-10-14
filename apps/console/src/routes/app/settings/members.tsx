import { createFileRoute } from "@tanstack/react-router";
import { listSearchSchema } from "../../../modules/data/list-search";
import { useListSearchUpdater } from "../../../modules/data/use-list-search";
import { MembersPage } from "../../../modules/settings/MembersPage";

export const Route = createFileRoute("/app/settings/members")({
  staticData: { screenId: "AD-03" },
  validateSearch: listSearchSchema,
  component: Screen,
});

function Screen() {
  const search = Route.useSearch();
  const onSearchChange = useListSearchUpdater(Route.useNavigate());
  return <MembersPage search={search} onSearchChange={onSearchChange} />;
}
