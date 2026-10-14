import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { isReleased, useFlags } from "../../flags";
import { useTranslation } from "react-i18next";
import type { Schemas } from "@agentvault/api-client";
import { PageHeader, RiskChip, StatusPill, type DataTableColumn } from "@agentvault/ui";
import { useDiscovered, useEndpoints } from "../data/api";
import type { ListSearch } from "../data/list-search";
import { ScreenMeta } from "../screens/ScreenPlaceholder";
import { SectionTabs } from "../screens/SectionTabs";
import { ListTable } from "../shared/ListTable";
import { Mono, Time } from "../shared/cells";

type Search = { search: ListSearch; onSearchChange: (n: Partial<ListSearch>) => void };

/** DS-01 */
export function DiscoveryPage({ search, onSearchChange }: Search) {
  const { t } = useTranslation("app");
  const detailReleased = isReleased("R2", useFlags()); // DS-02 is an R2 screen
  const query = useDiscovered(search);
  const columns = useMemo<DataTableColumn<Schemas["DiscoveredItem"]>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("cols.name"),
        cell: (c) => (
          <div className="flex flex-col">
            {detailReleased ? (
              <Link
                to="/app/discovery/$id"
                params={{ id: c.row.original.id }}
                className="font-mono text-mono text-link hover:text-link-hover hover:underline"
              >
                {c.row.original.name}
              </Link>
            ) : (
              <Mono>{c.row.original.name}</Mono>
            )}
            <span className="text-body-sm text-ink-muted">{t(`kinds.${c.row.original.kind}`)}</span>
          </div>
        ),
      },
      { accessorKey: "status", header: t("cols.status"), cell: (c) => <StatusPill status={c.row.original.status} /> },
      { accessorKey: "risk", header: t("cols.risk"), cell: (c) => <RiskChip score={c.row.original.risk} /> },
      { accessorKey: "endpoints", header: t("cols.endpoints") },
      { accessorKey: "source", header: t("cols.source"), enableSorting: false, cell: (c) => <Mono>{c.row.original.source}</Mono> },
      { accessorKey: "firstSeen", header: t("cols.firstSeen"), cell: (c) => <Time value={c.row.original.firstSeen} /> },
    ],
    [t, detailReleased],
  );
  return (
    <div className="flex flex-col gap-6" data-screen="DS-01">
      <SectionTabs section="discovery" />
      <PageHeader title={t("screens.DS-01")} meta={<ScreenMeta id="DS-01" />} />
      <ListTable
        id="discovery"
        caption={t("screens.DS-01")}
        query={query}
        columns={columns}
        getRowId={(r) => r.id}
        search={search}
        onSearchChange={onSearchChange}
        statuses={["unmanaged", "inReview", "onboarding", "blocked"]}
        emptyTitle={t("discovery.empty")}
        emptyBody={t("discovery.emptyBody")}
      />
    </div>
  );
}

/** DS-03 */
export function EndpointsPage({ search, onSearchChange }: Search) {
  const { t } = useTranslation("app");
  const query = useEndpoints(search);
  const columns = useMemo<DataTableColumn<Schemas["Endpoint"]>[]>(
    () => [
      { accessorKey: "hostname", header: t("cols.hostname"), cell: (c) => <Mono>{c.row.original.hostname}</Mono> },
      { accessorKey: "user", header: t("cols.user") },
      { accessorKey: "status", header: t("cols.status"), cell: (c) => <StatusPill status={c.row.original.status} /> },
      { accessorKey: "os", header: t("cols.os") },
      { accessorKey: "agentVersion", header: t("cols.agent"), cell: (c) => <Mono>{c.row.original.agentVersion}</Mono> },
      { accessorKey: "servers", header: t("cols.servers") },
      { accessorKey: "skills", header: t("cols.skills") },
      { accessorKey: "lastSeen", header: t("cols.lastSeen"), cell: (c) => <Time value={c.row.original.lastSeen} /> },
    ],
    [t],
  );
  return (
    <div className="flex flex-col gap-6" data-screen="DS-03">
      <SectionTabs section="discovery" />
      <PageHeader title={t("screens.DS-03")} meta={<ScreenMeta id="DS-03" />} />
      <ListTable
        id="endpoints"
        caption={t("screens.DS-03")}
        query={query}
        columns={columns}
        getRowId={(r) => r.id}
        search={search}
        onSearchChange={onSearchChange}
        statuses={["inSync", "outOfDate", "agentOffline"]}
        emptyTitle={t("discovery.endpointsEmpty")}
      />
    </div>
  );
}
