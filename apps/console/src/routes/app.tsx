import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ConsoleLayout } from "../modules/shell/ConsoleLayout";

export const Route = createFileRoute("/app")({
  component: () => (
    <ConsoleLayout>
      <Outlet />
    </ConsoleLayout>
  ),
});
