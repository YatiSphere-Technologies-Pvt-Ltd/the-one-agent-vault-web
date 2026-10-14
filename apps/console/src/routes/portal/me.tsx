import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../modules/screens/ScreenPlaceholder";

export const Route = createFileRoute("/portal/me")({
  staticData: { screenId: "PT-04" },
  component: () => <ScreenPlaceholder id="PT-04"  />,
});
