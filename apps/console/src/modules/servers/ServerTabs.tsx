import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Schemas } from "@agentvault/api-client";
import { RiskChip, SafeText, SealCompare, StateView, StatusPill, type DataTableColumn } from "@agentvault/ui";
import { requestIdOf, useServer, useServerTools, useServerVersions, useCalls } from "../data/api";
import type { ListSearch } from "../data/list-search";
import { ListTable } from "../shared/ListTable";
import { Details, Hash, Mono, Panel, Time } from "../shared/cells";
import { useCallColumns, callDecisions } from "../activity/callColumns";

type Props = { id: string; search: ListSearch; onSearchChange: (n: Partial<ListSearch>) => void };

/** MC-03 */
export function ServerOverview({ id }: { id: string }) {
  const { t } = useTranslation("app");
  const query = useServer(id);
  if (query.isError) return <StateView kind="error" requestId={requestIdOf(query.error)} onRetry={() => void query.refetch()} />;
  if (!query.data) return <StateView kind="loading" layout="detail" />;
  const s = query.data;
  return (
    <div className="flex flex-col gap-6">
      <SealCompare pinned={s.pinned} served={s.served} />
      <Panel title={t("server.details")}>
        <SafeText as="p" text={s.description} className="m-0 text-body text-ink-secondary" />
        <Details
          items={[
            { label: t("cols.owner"), value: s.owner },
            { label: t("server.transport"), value: <Mono>{s.transport}</Mono> },
            { label: t("server.endpointUrl"), value: <Mono>{s.endpointUrl}</Mono> },
            { label: t("cols.gateway"), value: <Mono>{s.gateway}</Mono> },
            { label: t("server.pinnedVersion"), value: s.pinnedVersion },
            { label: t("server.users"), value: s.users },
            { label: t("cols.tools"), value: s.toolCount },
            { label: t("server.created"), value: <Time value={s.createdAt} /> },
          ]}
        />
      </Panel>
    </div>
  );
}

/** MC-04 */
export function ServerTools({ id, search, onSearchChange }: Props) {
  const { t, i18n } = useTranslation("app");
  const query = useServerTools(id, search);
  const columns = useMemo<DataTableColumn<Schemas["Tool"]>[]>(
    () => [
      { accessorKey: "name", header: t("cols.tool"), cell: (c) => <Mono>{c.row.original.name}</Mono> },
      {
        accessorKey: "description",
        header: t("cols.description"),
        enableSorting: false,
        cell: (c) => <SafeText text={c.row.original.description} className="text-ink-secondary" />,
      },
      { accessorKey: "risk", header: t("cols.risk"), cell: (c) => <RiskChip score={c.row.original.risk} /> },
      { accessorKey: "status", header: t("cols.status"), cell: (c) => <StatusPill status={c.row.original.status} /> },
      {
        accessorKey: "callsLast24h",
        header: t("cols.calls24h"),
        cell: (c) => new Intl.NumberFormat(i18n.language).format(c.row.original.callsLast24h),
      },
    ],
    [t, i18n.language],
  );
  return (
    <ListTable
      id="server-tools"
      caption={t("screens.MC-04")}
      query={query}
      columns={columns}
      getRowId={(r) => r.name}
      search={search}
      onSearchChange={onSearchChange}
      statuses={["approved", "modified", "requiresApproval"]}
      emptyTitle={t("server.toolsEmpty")}
    />
  );
}

/** MC-05 */
export function ServerVersions({ id, search, onSearchChange }: Props) {
  const { t } = useTranslation("app");
  const query = useServerVersions(id, search);
  const columns = useMemo<DataTableColumn<Schemas["Version"]>[]>(
    () => [
      { accessorKey: "version", header: t("cols.version"), enableSorting: false, cell: (c) => <Mono>v{c.row.original.version}</Mono> },
      { accessorKey: "hash", header: t("cols.hash"), enableSorting: false, cell: (c) => <Hash value={c.row.original.hash} /> },
      { accessorKey: "status", header: t("cols.status"), enableSorting: false, cell: (c) => <StatusPill status={c.row.original.status} /> },
      { accessorKey: "approvedBy", header: t("cols.approvedBy"), enableSorting: false },
      { accessorKey: "approvedAt", header: t("cols.approved"), enableSorting: false, cell: (c) => <Time value={c.row.original.approvedAt} /> },
      { accessorKey: "toolCount", header: t("cols.tools"), enableSorting: false },
      { accessorKey: "summary", header: t("cols.summary"), enableSorting: false, cell: (c) => <SafeText text={c.row.original.summary} /> },
    ],
    [t],
  );
  return (
    <ListTable
      id="server-versions"
      caption={t("screens.MC-05")}
      query={query}
      columns={columns}
      getRowId={(r) => String(r.version)}
      search={search}
      onSearchChange={onSearchChange}
      noSearch
      emptyTitle={t("server.versionsEmpty")}
    />
  );
}

/** MC-08 */
export function ServerActivity({ id, search, onSearchChange }: Props) {
  const { t } = useTranslation("app");
  const query = useCalls(search, id);
  const columns = useCallColumns({ withServer: false });
  return (
    <ListTable
      id="server-activity"
      caption={t("screens.MC-08")}
      query={query}
      columns={columns}
      getRowId={(r) => r.id}
      search={search}
      onSearchChange={onSearchChange}
      statuses={[...callDecisions]}
      emptyTitle={t("server.activityEmpty")}
    />
  );
}
