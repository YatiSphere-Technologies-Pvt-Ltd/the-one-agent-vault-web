import { createFileRoute } from "@tanstack/react-router";
import { listSearchSchema } from "../../../modules/data/list-search";
import { useListSearchUpdater } from "../../../modules/data/use-list-search";
import { ReviewsPage } from "../../../modules/reviews/ReviewsPage";

export const Route = createFileRoute("/app/reviews/")({
  staticData: { screenId: "RV-01" },
  validateSearch: listSearchSchema,
  component: Screen,
});

function Screen() {
  const search = Route.useSearch();
  const onSearchChange = useListSearchUpdater(Route.useNavigate());
  return <ReviewsPage search={search} onSearchChange={onSearchChange} />;
}
