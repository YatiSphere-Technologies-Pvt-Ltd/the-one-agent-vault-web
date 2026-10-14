import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SealGlyph, SkipLink, WORDMARK_HASH } from "@agentvault/ui";
import { ScreenPlaceholder } from "../modules/screens/ScreenPlaceholder";

/** SH-01: no shell, centred on the canvas. */
export const Route = createFileRoute("/login")({
  staticData: { screenId: "SH-01" },
  component: Login,
});

function Login() {
  const { t } = useTranslation("ui");
  return (
    <div className="flex min-h-dvh flex-col items-center bg-canvas p-6">
      <SkipLink />
      <div className="flex items-center gap-2 py-8">
        <SealGlyph hash={WORDMARK_HASH} state="intact" size="sm" label={t("shell.wordmark")} decorative />
        <span className="text-title-3 text-ink">{t("shell.wordmark")}</span>
      </div>
      <main id="main" tabIndex={-1} className="w-full max-w-(--av-size-form-max) outline-none">
        <ScreenPlaceholder id="SH-01" />
      </main>
    </div>
  );
}
