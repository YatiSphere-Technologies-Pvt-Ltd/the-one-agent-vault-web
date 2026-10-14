import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { StateView } from "@agentvault/ui";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
  notFoundComponent: NotFound,
});

function NotFound() {
  const { t } = useTranslation("app");
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-(--av-size-form-max) flex-col justify-center p-6">
      <StateView
        kind="empty"
        title={t("notFound.title")}
        body={t("notFound.body")}
        action={
          <Link to="/app" className="text-link hover:text-link-hover hover:underline">
            {t("notFound.home")}
          </Link>
        }
      />
    </main>
  );
}
