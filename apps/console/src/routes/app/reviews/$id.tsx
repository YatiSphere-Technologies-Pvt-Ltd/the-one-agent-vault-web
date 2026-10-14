import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";

/** RV-02 and RV-03 share this route; the review's type decides which workspace renders. */
export const Route = createFileRoute("/app/reviews/$id")({
  component: ReviewWorkspace,
});

/** Until the API exists, the mock review type is encoded in the ID: rev-skl-* is a skill review. */
export function reviewScreen(id: string) {
  return id.startsWith("rev-skl") ? ("RV-03" as const) : ("RV-02" as const);
}

function ReviewWorkspace() {
  const { t } = useTranslation("app");
  const { id } = Route.useParams();
  return (
    <ScreenPlaceholder
      id={reviewScreen(id)}
      breadcrumbs={[{ label: t("nav.reviews"), link: { to: "/app/reviews" } }, { label: id }]}
    />
  );
}
