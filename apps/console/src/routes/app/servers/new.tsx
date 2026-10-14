import { createFileRoute } from "@tanstack/react-router";
import { optionalEnum, searchSchema } from "../../../modules/data/search-params";
import { useTranslation } from "react-i18next";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";

const search = searchSchema({ type: optionalEnum("hosted") });

/** MC-02, or MC-17 when ?type=hosted. */
export const Route = createFileRoute("/app/servers/new")({
  validateSearch: search,
  component: AddServer,
});

function AddServer() {
  const { t } = useTranslation("app");
  const { type } = Route.useSearch();
  return (
    <ScreenPlaceholder
      id={type === "hosted" ? "MC-17" : "MC-02"}
      breadcrumbs={[{ label: t("nav.servers"), link: { to: "/app/servers" } }, { label: t("screens.MC-02") }]}
    />
  );
}
