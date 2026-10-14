import * as React from "react";
import { cn } from "../lib/cn";

export type TableDensity = "comfortable" | "compact";

const DensityContext = React.createContext<TableDensity>("comfortable");

function Table({
  className,
  density = "comfortable",
  ...props
}: React.ComponentProps<"table"> & { density?: TableDensity }) {
  return (
    <DensityContext.Provider value={density}>
      <table
        data-slot="table"
        data-density={density}
        className={cn("w-full caption-bottom border-collapse text-body tabular-nums", className)}
        {...props}
      />
    </DensityContext.Provider>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("bg-sunken", className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("border-t border-edge bg-sunken", className)} {...props} />;
}

/** Rows: 44 px comfortable, 36 px compact; hover bg-hover; selected (data-state=selected) bg-selected. */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  const density = React.useContext(DensityContext);
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-edge-subtle transition-colors duration-(--av-motion-fast)",
        "hover:bg-hover data-[state=selected]:bg-selected",
        density === "compact" ? "h-(--av-size-row-compact)" : "h-(--av-size-row-comfortable)",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn("h-(--av-size-row-compact) px-3 text-start align-middle text-label text-ink-muted", className)}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("px-3 align-middle text-ink", className)} {...props} />;
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption data-slot="table-caption" className={cn("mt-2 text-caption text-ink-muted", className)} {...props} />;
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
