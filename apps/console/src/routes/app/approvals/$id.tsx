import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";

export const Route = createFileRoute("/app/approvals/$id")({
  staticData: { screenId: "MC-12" },
  component: Detail,
});

function Detail() {
  const { t } = useTranslation("app");
  const { id } = Route.useParams();
  return (
    <ScreenPlaceholder
      id="MC-12"
      breadcrumbs={[{ label: t("nav.approvals"), link: { to: "/app/approvals" } }, { label: id }]}
    />
  );
}
