import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { Schemas } from "@agentvault/api-client";
import { PageHeader, RiskChip, StatusPill, type DataTableColumn } from "@agentvault/ui";
import { useReviews } from "../data/api";
import type { ListSearch } from "../data/list-search";
import { ScreenMeta } from "../screens/ScreenPlaceholder";
import { ListTable } from "../shared/ListTable";
import { Time } from "../shared/cells";

/** RV-01 */
export function ReviewsPage({ search, onSearchChange }: { search: ListSearch; onSearchChange: (n: Partial<ListSearch>) => void }) {
  const { t } = useTranslation("app");
  const query = useReviews(search);
  const columns = useMemo<DataTableColumn<Schemas["Review"]>[]>(
    () => [
      {
        accessorKey: "objectName",
        header: t("cols.object"),
        cell: (c) => (
          <div className="flex flex-col">
            <Link
              to="/app/reviews/$id"
              params={{ id: c.row.original.id }}
              className="font-mono text-mono text-link hover:text-link-hover hover:underline"
            >
              {c.row.original.objectName}
            </Link>
            <span className="text-body-sm text-ink-muted">{t(`kinds.${c.row.original.kind}`)}</span>
          </div>
        ),
      },
      { accessorKey: "reason", header: t("cols.reason"), cell: (c) => t(`reasons.${c.row.original.reason}`) },
      { accessorKey: "risk", header: t("cols.risk"), cell: (c) => <RiskChip score={c.row.original.risk} /> },
      { accessorKey: "status", header: t("cols.status"), cell: (c) => <StatusPill status={c.row.original.status} /> },
      { accessorKey: "requestedBy", header: t("cols.requestedBy") },
      { accessorKey: "requestedAt", header: t("cols.requested"), cell: (c) => <Time value={c.row.original.requestedAt} /> },
      {
        accessorKey: "assignee",
        header: t("cols.assignee"),
        cell: (c) => c.row.original.assignee ?? <span className="text-ink-muted">{t("unassigned")}</span>,
      },
    ],
    [t],
  );
  return (
    <div className="flex flex-col gap-6" data-screen="RV-01">
      <PageHeader title={t("screens.RV-01")} meta={<ScreenMeta id="RV-01" />} />
      <ListTable
        id="reviews"
        caption={t("screens.RV-01")}
        query={query}
        columns={columns}
        getRowId={(r) => r.id}
        search={search}
        onSearchChange={onSearchChange}
        statuses={["inReview", "pending", "escalated", "changesRequested"]}
        emptyTitle={t("reviews.empty")}
        emptyBody={t("reviews.emptyBody")}
      />
    </div>
  );
}
