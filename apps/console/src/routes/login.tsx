import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthLayout } from "../modules/auth/AuthLayout";

/** Shared chrome for every sign-in screen (SH-01). */
export const Route = createFileRoute("/login")({
  component: () => (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ),
});
