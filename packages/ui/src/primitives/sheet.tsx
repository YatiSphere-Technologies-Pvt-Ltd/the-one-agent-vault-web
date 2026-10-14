import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";
import { registerSheet } from "../lib/overlay-registry";

const SheetCloseContext = React.createContext<() => void>(() => {});

/** Drawer from the inline-end edge. One open at a time; Esc closes and focus returns to the trigger. */
function Sheet({ onOpenChange, ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  const close = React.useCallback(() => onOpenChange?.(false), [onOpenChange]);
  return (
    <SheetCloseContext.Provider value={close}>
      <SheetPrimitive.Root data-slot="sheet" {...(onOpenChange ? { onOpenChange } : {})} {...props} />
    </SheetCloseContext.Provider>
  );
}

function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

export interface SheetContentProps extends React.ComponentProps<typeof SheetPrimitive.Content> {
  /** default = 480 px, wide = 720 px. */
  width?: "default" | "wide";
}

function SheetContent({ className, children, width = "default", ...props }: SheetContentProps) {
  const { t } = useTranslation("ui");
  const close = React.useContext(SheetCloseContext);
  React.useEffect(() => registerSheet(close), [close]);
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay
        data-slot="sheet-overlay"
        className="fixed inset-0 z-(--av-z-drawer) bg-inverse/20 data-[state=open]:animate-av-fade-in"
      />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed inset-y-0 end-0 z-(--av-z-drawer) flex w-full flex-col rounded-none border-s border-edge bg-raised text-ink shadow-overlay",
          "data-[state=open]:animate-av-slide-in",
          width === "default" ? "max-w-(--av-size-drawer)" : "max-w-(--av-size-drawer-wide)",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          className="absolute end-4 top-4 inline-flex size-8 items-center justify-center rounded-control text-ink-muted hover:bg-hover hover:text-ink"
          aria-label={t("common.close")}
        >
          <X aria-hidden className="size-4" />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1 border-b border-edge-subtle p-6 pe-12", className)}
      {...props}
    />
  );
}

function SheetBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sheet-body" className={cn("flex-1 overflow-auto p-6", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("flex justify-end gap-2 border-t border-edge-subtle p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={cn("text-title-2 text-ink", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-body text-ink-secondary", className)}
      {...props}
    />
  );
}

export { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger };
