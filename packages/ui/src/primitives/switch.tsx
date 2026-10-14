import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

/** 40×24 track; the thumb position carries state, not colour alone. */
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-10 shrink-0 items-center rounded-pill border border-edge-strong p-0.5",
        "bg-sunken transition-colors duration-(--av-motion-fast)",
        "data-[state=checked]:border-action-primary-bg data-[state=checked]:bg-action-primary-bg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-pill bg-ink-muted transition-transform duration-(--av-motion-fast)",
          "data-[state=checked]:translate-x-4 data-[state=checked]:bg-action-primary-fg rtl:data-[state=checked]:-translate-x-4",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
