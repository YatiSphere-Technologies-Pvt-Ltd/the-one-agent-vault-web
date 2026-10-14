import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "../../modules/notifications/Notifications";

export const Route = createFileRoute("/app/notifications")({
  staticData: { screenId: "SH-05" },
  component: NotificationsPage,
});
