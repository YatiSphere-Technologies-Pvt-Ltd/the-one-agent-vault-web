import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../modules/screens/ScreenPlaceholder";

export const Route = createFileRoute("/app/me")({
  staticData: { screenId: "SH-06" },
  component: () => <ScreenPlaceholder id="SH-06"  />,
});
