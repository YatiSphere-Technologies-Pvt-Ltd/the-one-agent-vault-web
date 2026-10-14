import { createFileRoute } from "@tanstack/react-router";
import { NotBuilt } from "../../../../modules/screens/ScreenPlaceholder";

export const Route = createFileRoute("/app/servers/$id/access")({
  staticData: { screenId: "MC-06" },
  component: () => <NotBuilt id="MC-06" />,
});
