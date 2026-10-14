import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check, Minus } from "lucide-react";
import { cn } from "../lib/cn";

/** 16px box inside a 24px target. */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative inline-flex size-4 shrink-0 items-center justify-center rounded-control border border-edge-strong bg-surface",
        "before:absolute before:-inset-1",
        "data-[state=checked]:border-action-primary-bg data-[state=checked]:bg-action-primary-bg data-[state=checked]:text-action-primary-fg",
        "data-[state=indeterminate]:border-action-primary-bg data-[state=indeterminate]:bg-action-primary-bg data-[state=indeterminate]:text-action-primary-fg",
        "disabled:cursor-not-allowed disabled:border-edge disabled:bg-sunken",
        "aria-invalid:border-status-danger-solid",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex items-center justify-center">
        {props.checked === "indeterminate" ? (
          <Minus aria-hidden className="size-3" />
        ) : (
          <Check aria-hidden className="size-3" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
