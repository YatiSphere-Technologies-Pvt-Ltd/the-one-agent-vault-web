import { createFileRoute } from "@tanstack/react-router";
import { optionalString, searchSchema } from "../../modules/data/search-params";
import { ResetPage } from "../../modules/auth/ResetPage";

/** SH-01: request a password reset link. */
export const Route = createFileRoute("/login/reset")({
  staticData: { screenId: "SH-01" },
  validateSearch: searchSchema({ redirect: optionalString }),
  component: Screen,
});

function Screen() {
  const { redirect } = Route.useSearch();
  return <ResetPage redirect={redirect} />;
}
