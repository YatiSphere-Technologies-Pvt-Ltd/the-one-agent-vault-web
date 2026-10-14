import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { StateView } from "@agentvault/ui";
import { routeTree } from "./routeTree.gen";
import type { ScreenId } from "./screens";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultPendingComponent: () => <StateView kind="loading" />,
  defaultErrorComponent: ({ error }) => (
    <StateView kind="error" requestId={(error as { requestId?: string }).requestId ?? "unavailable"} />
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    /** The UX specification screen this route renders. */
    screenId?: ScreenId;
  }
}
