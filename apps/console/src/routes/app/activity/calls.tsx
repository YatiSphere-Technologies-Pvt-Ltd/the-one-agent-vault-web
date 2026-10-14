import { createFileRoute } from "@tanstack/react-router";
import { CallsPage } from "../../../modules/activity/ActivityPages";
import { listSearchShape } from "../../../modules/data/list-search";
import { optionalString, searchSchema } from "../../../modules/data/search-params";
import { useListSearchUpdater } from "../../../modules/data/use-list-search";

const search = searchSchema({ ...listSearchShape, call: optionalString });

/** MC-13 tool-call explorer; MC-14 call detail is a drawer on ?call=<id>. */
export const Route = createFileRoute("/app/activity/calls")({
  staticData: { screenId: "MC-13" },
  validateSearch: search,
  component: Screen,
});

function Screen() {
  const { call, ...list } = Route.useSearch();
  const navigate = Route.useNavigate();
  const onSearchChange = useListSearchUpdater(navigate);
  return (
    <CallsPage
      search={list}
      onSearchChange={onSearchChange}
      callId={call}
      onCallChange={(id) => void navigate({ search: (prev) => ({ ...prev, call: id }) })}
    />
  );
}
