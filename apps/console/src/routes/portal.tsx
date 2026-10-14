import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PortalLayout } from "../modules/shell/ConsoleLayout";
import { requireSession } from "../modules/auth/session";

export const Route = createFileRoute("/portal")({
  beforeLoad: requireSession,
  component: () => (
    <PortalLayout>
      <Outlet />
    </PortalLayout>
  ),
});
