import { createFileRoute } from "@tanstack/react-router";
import { NotBuilt } from "../../../../modules/screens/ScreenPlaceholder";

export const Route = createFileRoute("/app/servers/$id/credentials")({
  staticData: { screenId: "MC-07" },
  component: () => <NotBuilt id="MC-07" />,
});
