import * as React from "react";
import { Toaster as Sonner, toast } from "sonner";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";
import { useTheme } from "../theme/ThemeProvider";

const DURATION = 6000;
const DURATION_WITH_UNDO = 10000;

let undoLabel = "Undo";

export interface NotifyOptions {
  description?: React.ReactNode;
  /** Adds an Undo action and keeps the toast for 10 s. */
  onUndo?: () => void;
  id?: string | number;
}

function options({ description, onUndo, id }: NotifyOptions = {}) {
  return {
    ...(description !== undefined ? { description } : {}),
    ...(id !== undefined ? { id } : {}),
    duration: onUndo ? DURATION_WITH_UNDO : DURATION,
    ...(onUndo ? { action: { label: undoLabel, onClick: onUndo } } : {}),
  };
}

/** Toasts: 6 s, 10 s with Undo; errors persist until dismissed. */
export const notify = {
  success: (message: React.ReactNode, opts?: NotifyOptions) => toast.success(message, options(opts)),
  info: (message: React.ReactNode, opts?: NotifyOptions) => toast.info(message, options(opts)),
  error: (message: React.ReactNode, opts?: Omit<NotifyOptions, "onUndo">) =>
    toast.error(message, { ...options(opts), duration: Number.POSITIVE_INFINITY, closeButton: true }),
  dismiss: (id?: string | number) => toast.dismiss(id),
};

/** Inline-end bottom. aria-live comes from sonner's live region. */
function Toaster(props: React.ComponentProps<typeof Sonner>) {
  const { t, i18n } = useTranslation("ui");
  const { resolved } = useTheme();
  React.useEffect(() => {
    undoLabel = t("common.undo");
  }, [t]);
  const dir = i18n.dir();
  return (
    <Sonner
      theme={resolved}
      dir={dir}
      position={dir === "rtl" ? "bottom-left" : "bottom-right"}
      closeButton={false}
      containerAriaLabel={t("shell.notifications")}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn(
            "flex w-(--width) items-start gap-3 rounded-overlay border border-edge bg-raised p-4 text-body text-ink shadow-overlay",
          ),
          title: "text-label text-ink",
          description: "text-body-sm text-ink-secondary",
          actionButton:
            "ms-auto h-(--av-size-control-sm) shrink-0 rounded-control px-3 text-label text-link hover:bg-hover",
          closeButton:
            "order-last ms-auto inline-flex size-6 shrink-0 items-center justify-center rounded-control text-ink-muted hover:bg-hover",
          icon: "mt-0.5 shrink-0",
          success: "[&_[data-icon]]:text-status-success-solid",
          error: "border-status-danger-border [&_[data-icon]]:text-status-danger-solid",
          info: "[&_[data-icon]]:text-status-info-solid",
        },
      }}
      className="z-(--av-z-toast)"
      {...props}
    />
  );
}

export { Toaster };
