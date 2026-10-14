import * as React from "react";
import { cn } from "../lib/cn";
import { controlClasses, useFieldControlProps } from "./field";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  mono?: boolean;
}

function Textarea({ className, mono = false, rows = 4, ...props }: TextareaProps) {
  const fieldProps = useFieldControlProps(props);
  return (
    <textarea
      data-slot="textarea"
      rows={rows}
      className={cn(controlClasses, "min-h-(--av-size-control-md) px-3 py-2", mono && "font-mono text-mono", className)}
      {...props}
      {...fieldProps}
    />
  );
}

export { Textarea };
