import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { applyThemeEarly, ThemeProvider, TooltipProvider } from "@agentvault/ui";
import { createAppI18n } from "./i18n";
import { queryClient, router } from "./router";
import "./styles.css";

// The toast region is not needed for first paint.
const Toaster = lazy(() => import("@agentvault/ui/toaster").then((m) => ({ default: m.Toaster })));

applyThemeEarly();
const i18n = createAppI18n();

// Mock API: always in development; in production only for demo builds (VITE_MOCK_API=true).
export const mockApiEnabled = import.meta.env.DEV || import.meta.env.VITE_MOCK_API === "true";

async function enableMocks() {
  if (!mockApiEnabled) return;
  const { worker } = await import("./mocks/browser");
  await worker.start({ quiet: true });
}

void enableMocks().then(() => {
  const root = document.getElementById("root");
  if (!root) throw new Error("#root missing");
  createRoot(root).render(
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <RouterProvider router={router} />
              <Suspense fallback={null}>
                <Toaster />
              </Suspense>
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </I18nextProvider>
    </StrictMode>,
  );
});
