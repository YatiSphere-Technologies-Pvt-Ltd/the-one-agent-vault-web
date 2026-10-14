import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ConsoleLayout } from "../modules/shell/ConsoleLayout";
import { requireSession } from "../modules/auth/session";

export const Route = createFileRoute("/app")({
  beforeLoad: requireSession,
  component: () => (
    <ConsoleLayout>
      <Outlet />
    </ConsoleLayout>
  ),
});
