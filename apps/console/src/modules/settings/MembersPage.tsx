import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Schemas } from "@agentvault/api-client";
import { PageHeader, StatusPill, type DataTableColumn } from "@agentvault/ui";
import { useMembers } from "../data/api";
import type { ListSearch } from "../data/list-search";
import { ScreenMeta } from "../screens/ScreenPlaceholder";
import { SectionTabs } from "../screens/SectionTabs";
import { ListTable } from "../shared/ListTable";
import { Time } from "../shared/cells";

/** AD-03 */
export function MembersPage({ search, onSearchChange }: { search: ListSearch; onSearchChange: (n: Partial<ListSearch>) => void }) {
  const { t } = useTranslation("app");
  const query = useMembers(search);
  const columns = useMemo<DataTableColumn<Schemas["Member"]>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("cols.name"),
        cell: (c) => (
          <div className="flex flex-col">
            <span className="text-label text-ink">{c.row.original.name}</span>
            <span className="text-body-sm text-ink-muted">{c.row.original.email}</span>
          </div>
        ),
      },
      { accessorKey: "role", header: t("cols.role") },
      { accessorKey: "groups", header: t("cols.groups"), enableSorting: false, cell: (c) => c.row.original.groups.join(", ") },
      { accessorKey: "status", header: t("cols.status"), cell: (c) => <StatusPill status={c.row.original.status} /> },
      { accessorKey: "lastActive", header: t("cols.lastActive"), cell: (c) => <Time value={c.row.original.lastActive} /> },
    ],
    [t],
  );
  return (
    <div className="flex flex-col gap-6" data-screen="AD-03">
      <SectionTabs section="settings" />
      <PageHeader title={t("screens.AD-03")} meta={<ScreenMeta id="AD-03" />} />
      <ListTable
        id="members"
        caption={t("screens.AD-03")}
        query={query}
        columns={columns}
        getRowId={(r) => r.id}
        search={search}
        onSearchChange={onSearchChange}
        statuses={["enabled", "pending", "disabled"]}
        emptyTitle={t("members.empty")}
      />
    </div>
  );
}
