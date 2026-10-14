import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/activity/")({
  beforeLoad: () => {
    throw redirect({ to: "/app/activity/calls", replace: true });
  },
});
