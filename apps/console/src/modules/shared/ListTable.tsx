import { useEffect, useState, type ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  DataTable,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StateView,
  type DataTableColumn,
  type StatusVocabulary,
} from "@agentvault/ui";
import { PAGE_SIZE, requestIdOf } from "../data/api";
import { fromSorting, toSorting, type ListSearch } from "../data/list-search";

interface Page<T> {
  items: T[];
  total: number;
}

export interface ListTableProps<T extends object> {
  id: string;
  caption: string;
  query: UseQueryResult<Page<T>>;
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  search: ListSearch;
  onSearchChange: (next: Partial<ListSearch>) => void;
  /** Status filter options; omit to hide the filter. */
  statuses?: StatusVocabulary[];
  /** Hide the text search. */
  noSearch?: boolean;
  emptyTitle: string;
  emptyBody?: ReactNode;
  rowActions?: (row: T) => ReactNode;
  selectedRowId?: string | null;
}

const ALL = "all";

/** Server-side list: search, status filter, sort and page live in the URL; the API does the work. */
export function ListTable<T extends object>({
  id,
  caption,
  query,
  columns,
  getRowId,
  search,
  onSearchChange,
  statuses,
  noSearch,
  emptyTitle,
  emptyBody,
  rowActions,
  selectedRowId,
}: ListTableProps<T>) {
  const { t } = useTranslation("app");
  const { t: tu } = useTranslation("ui");
  const [text, setText] = useState(search.q ?? "");

  // Debounced search: update the URL 300 ms after typing stops.
  useEffect(() => {
    if ((search.q ?? "") === text) return;
    const timer = setTimeout(() => onSearchChange({ q: text || undefined, page: undefined }), 300);
    return () => clearTimeout(timer);
  }, [text, search.q, onSearchChange]);

  const filtered = Boolean(search.q || search.status);
  const data = query.data;

  if (query.isError) {
    return <StateView kind="error" requestId={requestIdOf(query.error)} onRetry={() => void query.refetch()} />;
  }
  if (data && data.total === 0 && !filtered) {
    return <StateView kind="empty" title={emptyTitle} body={emptyBody} />;
  }

  const toolbar = (
    <>
      {!noSearch && (
        <Input
          type="search"
          aria-label={tu("common.search")}
          placeholder={t("list.searchPlaceholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-72 max-w-full"
        />
      )}
      {statuses && (
        <Select
          value={search.status ?? ALL}
          onValueChange={(v) => onSearchChange({ status: v === ALL ? undefined : v, page: undefined })}
        >
          <SelectTrigger aria-label={t("list.statusFilter")} className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("list.allStatuses")}</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {tu(`status.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {data && (
        <span className="text-body-sm text-ink-muted" aria-live="polite">
          {t("list.count", { count: data.total })}
        </span>
      )}
    </>
  );

  return (
    <DataTable
      id={id}
      caption={caption}
      columns={columns}
      data={data?.items ?? []}
      getRowId={getRowId}
      status={!data ? "loading" : "ready"}
      sorting={toSorting(search.sort)}
      onSortingChange={(updater) => {
        const next = typeof updater === "function" ? updater(toSorting(search.sort)) : updater;
        onSearchChange({ sort: fromSorting(next), page: undefined });
      }}
      pagination={{ pageIndex: (search.page ?? 1) - 1, pageSize: PAGE_SIZE }}
      onPaginationChange={(updater) => {
        const current = { pageIndex: (search.page ?? 1) - 1, pageSize: PAGE_SIZE };
        const next = typeof updater === "function" ? updater(current) : updater;
        onSearchChange({ page: next.pageIndex + 1 === 1 ? undefined : next.pageIndex + 1 });
      }}
      rowCount={data?.total ?? 0}
      emptyMessage={t("list.noMatches")}
      toolbar={toolbar}
      {...(rowActions ? { rowActions } : {})}
      {...(selectedRowId !== undefined ? { selectedRowId } : {})}
    />
  );
}
