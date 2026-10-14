import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import {
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { cn } from "../lib/cn";
import { storage } from "../lib/storage";
import { Button } from "../primitives/button";
import { Skeleton } from "../primitives/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableDensity,
} from "../primitives/table";

export const dataTableFeatures = tableFeatures({ rowSortingFeature, columnFilteringFeature, rowPaginationFeature });
export type DataTableFeatures = typeof dataTableFeatures;
export type DataTableColumn<TData extends object> = ColumnDef<DataTableFeatures, TData>;
export type { ColumnFiltersState, PaginationState, SortingState };

export interface DataTableProps<TData extends object> {
  /** Stable id; the density choice is stored per table under av.table.<id>.density. */
  id: string;
  /** Accessible name for the table. */
  caption: string;
  columns: DataTableColumn<TData>[];
  data: TData[];
  getRowId: (row: TData) => string;
  /** Server-side state: the caller fetches the processed page and passes it in. */
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  rowCount?: number;
  status?: "ready" | "loading" | "error";
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  /** Shown at inline-end on hover and focus. */
  rowActions?: (row: TData) => ReactNode;
  selectedRowId?: string | null;
  toolbar?: ReactNode;
  className?: string;
}

const densityKey = (id: string) => `av.table.${id}.density`;
const emptyFilters: ColumnFiltersState = [];
const emptySorting: SortingState = [];

export function DataTable<TData extends object>({
  id,
  caption,
  columns,
  data,
  getRowId,
  sorting = emptySorting,
  onSortingChange,
  columnFilters = emptyFilters,
  onColumnFiltersChange,
  pagination,
  onPaginationChange,
  rowCount,
  status = "ready",
  emptyMessage,
  errorMessage,
  rowActions,
  selectedRowId,
  toolbar,
  className,
}: DataTableProps<TData>) {
  const { t } = useTranslation("ui");
  const [density, setDensityState] = useState<TableDensity>(() =>
    storage.get(densityKey(id)) === "compact" ? "compact" : "comfortable",
  );
  const setDensity = (next: TableDensity) => {
    storage.set(densityKey(id), next);
    setDensityState(next);
  };

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId: (row: TData) => getRowId(row),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    ...(rowCount !== undefined ? { rowCount } : {}),
    state: {
      sorting,
      columnFilters,
      ...(pagination ? { pagination } : {}),
    },
    ...(onSortingChange ? { onSortingChange } : {}),
    ...(onColumnFiltersChange ? { onColumnFiltersChange } : {}),
    ...(onPaginationChange ? { onPaginationChange } : {}),
  });

  const columnCount = columns.length + (rowActions ? 1 : 0);
  const rows = table.getRowModel().rows;
  const pageCount = pagination ? table.getPageCount() : 1;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">{toolbar}</div>
        <div role="group" aria-label={t("table.density")} className="inline-flex rounded-control border border-edge-strong p-0.5">
          {(["comfortable", "compact"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={density === d}
              onClick={() => setDensity(d)}
              className={cn(
                "min-h-6 rounded-control px-2 text-label text-ink-muted",
                density === d && "bg-selected font-semibold text-ink",
              )}
            >
              {t(`table.${d}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-full overflow-auto rounded-panel border border-edge bg-surface">
        <Table density={density}>
          <TableCaption className="sr-only">{caption}</TableCaption>
          <TableHeader className="sticky top-0 z-(--av-z-sticky)">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className="border-b border-edge">
                {group.headers.map((header) => {
                  const canSort = header.column.getCanSort() && Boolean(onSortingChange);
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : canSort ? "none" : undefined}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="-mx-1 inline-flex min-h-6 items-center gap-1 rounded-control px-1 hover:text-ink"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />
                          {sorted === "asc" ? (
                            <ArrowUp aria-hidden className="size-3" />
                          ) : sorted === "desc" ? (
                            <ArrowDown aria-hidden className="size-3" />
                          ) : (
                            <ChevronsUpDown aria-hidden className="size-3" />
                          )}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
                {rowActions && (
                  <TableHead className="text-end">
                    <span className="sr-only">{t("table.rowActions")}</span>
                  </TableHead>
                )}
              </tr>
            ))}
          </TableHeader>
          <TableBody>
            {status === "loading" &&
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={`loading-${i}`} aria-hidden>
                  <TableCell colSpan={columnCount}>
                    <Skeleton className="h-4" />
                  </TableCell>
                </TableRow>
              ))}
            {status === "error" && (
              <TableRow>
                <TableCell colSpan={columnCount} className="text-center text-status-danger-fg">
                  {errorMessage ?? t("table.error")}
                </TableCell>
              </TableRow>
            )}
            {status === "ready" && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnCount} className="text-center text-ink-muted">
                  {emptyMessage ?? t("table.empty")}
                </TableCell>
              </TableRow>
            )}
            {status === "ready" &&
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.id === selectedRowId ? "selected" : undefined}
                  className="group"
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100">
                        {rowActions(row.original)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      {pagination && onPaginationChange && pageCount > 1 && (
        <div className="flex items-center justify-end gap-2 text-body-sm text-ink-muted">
          <span>{t("table.page", { page: pagination.pageIndex + 1, pages: pageCount })}</span>
          <Button
            size="sm"
            iconOnly
            aria-label={t("table.previous")}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft aria-hidden className="rtl:rotate-180" />
          </Button>
          <Button
            size="sm"
            iconOnly
            aria-label={t("table.next")}
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight aria-hidden className="rtl:rotate-180" />
          </Button>
        </div>
      )}
    </div>
  );
}
