import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "../../modules/home/HomePage";

export const Route = createFileRoute("/app/")({
  staticData: { screenId: "SH-03" },
  component: HomePage,
});
