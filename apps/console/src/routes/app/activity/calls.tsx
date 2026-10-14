import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod/mini";
import { CallsPage } from "../../../modules/activity/ActivityPages";
import { listSearchSchema } from "../../../modules/data/list-search";
import { useListSearchUpdater } from "../../../modules/data/use-list-search";

const search = z.extend(listSearchSchema, {
  call: z.catch(z.optional(z.string().check(z.minLength(1))), undefined),
});

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
