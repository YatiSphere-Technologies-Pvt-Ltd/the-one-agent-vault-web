import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { Schemas } from "@agentvault/api-client";
import { Button, PageHeader, RiskChip, StatusPill, type DataTableColumn } from "@agentvault/ui";
import { useServers } from "../data/api";
import type { ListSearch } from "../data/list-search";
import { ScreenMeta } from "../screens/ScreenPlaceholder";
import { SectionTabs } from "../screens/SectionTabs";
import { ListTable } from "../shared/ListTable";
import { Mono, ObjectLink, Time } from "../shared/cells";

type Server = Schemas["Server"];

/** MC-01 */
export function ServersPage({ search, onSearchChange }: { search: ListSearch; onSearchChange: (n: Partial<ListSearch>) => void }) {
  const { t, i18n } = useTranslation("app");
  const query = useServers(search);
  const columns = useMemo<DataTableColumn<Server>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("cols.name"),
        cell: (c) => (
          <ObjectLink
            name={c.row.original.name}
            link={{ to: "/app/servers/$id", params: { id: c.row.original.id } }}
            seal={{ hash: c.row.original.hash, state: c.row.original.sealState }}
            sub={c.row.original.description}
          />
        ),
      },
      { accessorKey: "status", header: t("cols.status"), cell: (c) => <StatusPill status={c.row.original.status} /> },
      { accessorKey: "risk", header: t("cols.risk"), cell: (c) => <RiskChip score={c.row.original.risk} /> },
      { accessorKey: "toolCount", header: t("cols.tools") },
      {
        accessorKey: "callsLast24h",
        header: t("cols.calls24h"),
        cell: (c) => new Intl.NumberFormat(i18n.language).format(c.row.original.callsLast24h),
      },
      { accessorKey: "gateway", header: t("cols.gateway"), enableSorting: false, cell: (c) => <Mono>{c.row.original.gateway}</Mono> },
      { accessorKey: "updatedAt", header: t("cols.updated"), cell: (c) => <Time value={c.row.original.updatedAt} /> },
    ],
    [t, i18n.language],
  );
  return (
    <div className="flex flex-col gap-6" data-screen="MC-01">
      <SectionTabs section="servers" />
      <PageHeader
        title={t("screens.MC-01")}
        meta={<ScreenMeta id="MC-01" />}
        primaryAction={
          <Button asChild variant="primary">
            <Link to="/app/servers/new">{t("server.add")}</Link>
          </Button>
        }
      />
      <ListTable
        id="servers"
        caption={t("screens.MC-01")}
        query={query}
        columns={columns}
        getRowId={(r) => r.id}
        search={search}
        onSearchChange={onSearchChange}
        statuses={["approved", "heldDefinitionChanged", "inReview", "draft", "disabled", "blocked", "unmanaged"]}
        emptyTitle={t("server.empty")}
        emptyBody={t("server.emptyBody")}
      />
    </div>
  );
}
