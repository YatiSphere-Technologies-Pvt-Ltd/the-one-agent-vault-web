import { createFileRoute } from "@tanstack/react-router";
import { optionalString, searchSchema } from "../../modules/data/search-params";
import { SamlPage } from "../../modules/auth/SamlPage";

/** SH-01: single sign-on by work email (home-realm discovery). */
export const Route = createFileRoute("/login/sso")({
  staticData: { screenId: "SH-01" },
  validateSearch: searchSchema({ redirect: optionalString }),
  component: Screen,
});

function Screen() {
  const { redirect } = Route.useSearch();
  return <SamlPage redirect={redirect} />;
}
