import { createFileRoute } from "@tanstack/react-router";
import { ServerOverview } from "../../../../modules/servers/ServerTabs";

export const Route = createFileRoute("/app/servers/$id/")({
  staticData: { screenId: "MC-03" },
  component: Screen,
});

function Screen() {
  const { id } = Route.useParams();
  return <ServerOverview id={id} />;
}
