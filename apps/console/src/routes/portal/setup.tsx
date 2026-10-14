import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../modules/screens/ScreenPlaceholder";

export const Route = createFileRoute("/portal/setup")({
  staticData: { screenId: "PT-05" },
  component: () => <ScreenPlaceholder id="PT-05"  />,
});
