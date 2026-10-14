import { createFileRoute } from "@tanstack/react-router";
import { NotBuilt } from "../../../../modules/screens/ScreenPlaceholder";

export const Route = createFileRoute("/app/skills/$id/distribution")({
  staticData: { screenId: "SK-07" },
  component: () => <NotBuilt id="SK-07" />,
});
