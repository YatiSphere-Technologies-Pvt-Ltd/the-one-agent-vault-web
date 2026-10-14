import { useEffect, type ReactNode } from "react";
import type { Decorator, Preview } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { createI18n } from "../src/i18n";
import { ThemeProvider, type ResolvedTheme } from "../src/theme";
import { TooltipProvider } from "../src/primitives/tooltip";
import { Toaster } from "../src/primitives/sonner";
import "../src/styles/index.css";

createI18n();

/** Components that render router links need a router; each story gets a memory router. */
function WithRouter({ children }: { children: ReactNode }) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => <>{children}</> }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return <RouterProvider router={router} />;
}

function ThemeRoot({ theme, children }: { theme: ResolvedTheme; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return (
    <ThemeProvider key={theme} defaultPreference={theme}>
      <TooltipProvider>
        <div className="bg-canvas p-6 text-ink">{children}</div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

const withProviders: Decorator = (Story, context) => (
  <ThemeRoot theme={context.globals.theme === "dark" ? "dark" : "light"}>
    <WithRouter>
      <Story />
    </WithRouter>
  </ThemeRoot>
);

const preview: Preview = {
  decorators: [withProviders],
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
    controls: { expanded: true },
  },
};

export default preview;
