import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control text-label",
    "transition-colors duration-(--av-motion-fast) ease-standard",
    "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-action-primary-bg font-semibold text-action-primary-fg",
          "hover:bg-action-primary-bg-hover active:bg-action-primary-bg-pressed",
          "disabled:bg-sunken disabled:text-ink-disabled",
        ],
        secondary: [
          "border border-action-secondary-border bg-action-secondary-bg text-action-secondary-fg",
          "hover:bg-action-secondary-bg-hover active:bg-selected",
          "disabled:border-edge disabled:text-ink-disabled",
        ],
        ghost: [
          "bg-transparent text-link hover:bg-hover hover:text-link-hover active:bg-selected",
          "disabled:text-ink-disabled",
        ],
        danger: [
          "bg-action-danger-bg font-semibold text-action-danger-fg hover:bg-action-danger-bg-hover",
          "disabled:bg-sunken disabled:text-ink-disabled",
        ],
      },
      size: {
        sm: "h-(--av-size-control-sm) px-3",
        md: "h-(--av-size-control-md) px-4",
        lg: "h-(--av-size-control-lg) px-4",
      },
      iconOnly: {
        true: "px-0",
        false: "",
      },
    },
    compoundVariants: [
      { size: "sm", iconOnly: true, className: "w-(--av-size-control-sm)" },
      { size: "md", iconOnly: true, className: "w-(--av-size-control-md)" },
      { size: "lg", iconOnly: true, className: "w-(--av-size-control-lg)" },
    ],
    defaultVariants: { variant: "secondary", size: "md", iconOnly: false },
  },
);

type BaseProps = Omit<React.ComponentProps<"button">, "aria-label"> &
  Omit<VariantProps<typeof buttonVariants>, "iconOnly"> & {
    asChild?: boolean;
    /** Shows a spinner and blocks clicks; the button keeps its width. */
    loading?: boolean;
  };

/** Icon-only buttons must carry an accessible name. */
export type ButtonProps =
  | (BaseProps & { iconOnly: true; "aria-label": string })
  | (BaseProps & { iconOnly?: false; "aria-label"?: string });

function Button({
  className,
  variant,
  size,
  iconOnly = false,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? "secondary"}
      className={cn(buttonVariants({ variant, size, iconOnly }), className)}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      {...(asChild ? {} : { type: props.type ?? "button" })}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>{children}</span>
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
            </span>
          )}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
