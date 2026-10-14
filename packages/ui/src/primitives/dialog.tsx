import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";
import { registerDialog } from "../lib/overlay-registry";

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-(--av-z-dialog) bg-inverse/40 data-[state=open]:animate-av-fade-in",
        className,
      )}
      {...props}
    />
  );
}

export interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  /** confirm = 480 px, form = 640 px. */
  width?: "confirm" | "form";
  showClose?: boolean;
}

/** Centred, focus-trapped, radius-overlay, shadow-dialog. Nested dialogs are not allowed. */
function DialogContent({ className, children, width = "confirm", showClose = true, ...props }: DialogContentProps) {
  const { t } = useTranslation("ui");
  React.useEffect(() => registerDialog(), []);
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed inset-x-4 inset-y-0 z-(--av-z-dialog) m-auto flex h-fit max-h-full flex-col gap-4 overflow-auto",
          "rounded-overlay border border-edge bg-raised p-6 text-ink shadow-dialog",
          "data-[state=open]:animate-av-fade-in",
          width === "confirm" ? "max-w-(--av-size-dialog)" : "max-w-(--av-size-dialog-form)",
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            className="absolute end-4 top-4 inline-flex size-8 items-center justify-center rounded-control text-ink-muted hover:bg-hover hover:text-ink"
            aria-label={t("common.close")}
          >
            <X aria-hidden className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1 pe-8", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-title-2 text-ink", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-body text-ink-secondary", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
};
