import * as React from "react";
import { cn } from "../lib/cn";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("animate-pulse rounded-control bg-sunken motion-reduce:animate-none", className)}
      {...props}
    />
  );
}

export { Skeleton };
