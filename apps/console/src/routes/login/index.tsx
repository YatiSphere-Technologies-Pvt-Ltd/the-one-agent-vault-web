import { createFileRoute, redirect } from "@tanstack/react-router";
import { optionalString, searchSchema } from "../../modules/data/search-params";
import { SignInPage } from "../../modules/auth/SignInPage";
import { safeRedirect, sessionQueryOptions } from "../../modules/auth/session";

const authSearch = searchSchema({ redirect: optionalString });

/** SH-01 sign-in. Already signed in: go straight on. */
export const Route = createFileRoute("/login/")({
  staticData: { screenId: "SH-01" },
  validateSearch: authSearch,
  beforeLoad: async ({ context, search }) => {
    const session = await context.queryClient.ensureQueryData(sessionQueryOptions);
    if (session) throw redirect({ href: safeRedirect(search.redirect), replace: true });
  },
  component: Screen,
});

function Screen() {
  const { redirect: target } = Route.useSearch();
  return <SignInPage redirect={target} />;
}
