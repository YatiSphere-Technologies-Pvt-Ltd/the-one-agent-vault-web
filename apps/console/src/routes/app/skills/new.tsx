import { createFileRoute } from "@tanstack/react-router";
import { ScreenPlaceholder } from "../../../modules/screens/ScreenPlaceholder";

export const Route = createFileRoute("/app/skills/new")({
  staticData: { screenId: "SK-02" },
  component: () => <ScreenPlaceholder id="SK-02"  />,
});
