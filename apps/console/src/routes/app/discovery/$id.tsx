import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";

export const Route = createFileRoute("/app/discovery/$id")({
  staticData: { screenId: "DS-02" },
  component: Detail,
});

function Detail() {
  const { t } = useTranslation("app");
  const { id } = Route.useParams();
  return (
    <ScreenPlaceholder
      id="DS-02"
      breadcrumbs={[{ label: t("nav.discovery"), link: { to: "/app/discovery" } }, { label: id }]}
    />
  );
}
