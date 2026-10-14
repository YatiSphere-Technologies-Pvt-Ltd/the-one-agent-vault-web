import * as React from "react";
import { cn } from "../lib/cn";
import { controlClasses, useFieldControlProps } from "./field";

export interface InputProps extends React.ComponentProps<"input"> {
  /** Monospace for URLs, IDs and hashes. */
  mono?: boolean;
}

function Input({ className, type = "text", mono = false, ...props }: InputProps) {
  const fieldProps = useFieldControlProps(props);
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        controlClasses,
        "h-(--av-size-control-md) px-3",
        "file:me-2 file:border-0 file:bg-transparent file:text-label file:text-ink",
        mono && "font-mono text-mono",
        className,
      )}
      {...props}
      {...fieldProps}
    />
  );
}

export { Input };
