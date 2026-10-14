import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";

export const Route = createFileRoute("/app/approvals/")({
  staticData: { screenId: "MC-11" },
  component: () => <ScreenPlaceholder id="MC-11"  />,
});
