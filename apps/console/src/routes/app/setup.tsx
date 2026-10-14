import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../modules/screens/ScreenPlaceholder";

export const Route = createFileRoute("/app/setup")({
  staticData: { screenId: "SH-02" },
  component: () => <ScreenPlaceholder id="SH-02"  />,
});
