import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "../lib/cn";

/** Underline tabs. For tabs that are routes or URL state, use RouteTabs instead. */
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-4", className)} {...props} />;
}

export const tabListClasses = "flex items-end gap-4 border-b border-edge-subtle";

export const tabTriggerClasses = cn(
  "-mb-px inline-flex min-h-10 items-center gap-2 border-b-2 border-transparent px-1 text-body text-ink-muted",
  "hover:text-ink transition-colors duration-(--av-motion-fast)",
);

export const tabTriggerActiveClasses = "border-action-primary-bg font-semibold text-ink";

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List data-slot="tabs-list" className={cn(tabListClasses, className)} {...props} />;
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        tabTriggerClasses,
        "data-[state=active]:border-action-primary-bg data-[state=active]:font-semibold data-[state=active]:text-ink",
        "disabled:text-ink-disabled",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn("outline-none", className)} {...props} />;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
