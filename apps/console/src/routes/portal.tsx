import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalLayout } from "../modules/shell/ConsoleLayout";

export const Route = createFileRoute("/portal")({
  component: () => (
    <PortalLayout>
      <Outlet />
    </PortalLayout>
  ),
});
