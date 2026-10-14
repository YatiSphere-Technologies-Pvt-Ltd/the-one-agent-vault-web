import { createFileRoute } from "@tanstack/react-router";
import { optionalString, searchSchema } from "../../modules/data/search-params";
import { CallbackPage } from "../../modules/auth/CallbackPage";

/** SH-01: return from the identity provider (?code, ?state, or ?error). */
export const Route = createFileRoute("/login/callback")({
  staticData: { screenId: "SH-01" },
  validateSearch: searchSchema({ code: optionalString, state: optionalString, error: optionalString }),
  component: Screen,
});

function Screen() {
  const search = Route.useSearch();
  return <CallbackPage code={search.code} state={search.state} error={search.error} />;
}
