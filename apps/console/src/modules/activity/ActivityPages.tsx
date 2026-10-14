import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Schemas } from "@agentvault/api-client";
import {
  Button,
  PageHeader,
  SafeText,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  StateView,
  StatusPill,
  type DataTableColumn,
} from "@agentvault/ui";
import { requestIdOf, useAudit, useCall, useCalls } from "../data/api";
import type { ListSearch } from "../data/list-search";
import { ScreenMeta } from "../screens/ScreenPlaceholder";
import { SectionTabs } from "../screens/SectionTabs";
import { ListTable } from "../shared/ListTable";
import { Details, Mono, Time } from "../shared/cells";
import { callDecisions, useCallColumns } from "./callColumns";

type Search = { search: ListSearch; onSearchChange: (n: Partial<ListSearch>) => void };

/** MC-13 with the MC-14 drawer on ?call=<id>. */
export function CallsPage({
  search,
  onSearchChange,
  callId,
  onCallChange,
}: Search & { callId: string | undefined; onCallChange: (id: string | undefined) => void }) {
  const { t } = useTranslation("app");
  const query = useCalls(search);
  const columns = useCallColumns();
  return (
    <div className="flex flex-col gap-6" data-screen="MC-13">
      <SectionTabs section="activity" />
      <PageHeader title={t("screens.MC-13")} meta={<ScreenMeta id="MC-13" />} />
      <ListTable
        id="calls"
        caption={t("screens.MC-13")}
        query={query}
        columns={columns}
        getRowId={(r) => r.id}
        search={search}
        onSearchChange={onSearchChange}
        statuses={[...callDecisions]}
        emptyTitle={t("calls.empty")}
        emptyBody={t("calls.emptyBody")}
        selectedRowId={callId ?? null}
        rowActions={(row) => (
          <Button size="sm" variant="ghost" aria-label={t("calls.open", { id: row.id })} onClick={() => onCallChange(row.id)}>
            {t("portal.open")}
          </Button>
        )}
      />
      <Sheet open={callId !== undefined} onOpenChange={(open) => !open && onCallChange(undefined)}>
        <SheetContent width="wide">
          <SheetHeader>
            <SheetTitle>{t("screens.MC-14")}</SheetTitle>
            <SheetDescription>
              <ScreenMeta id="MC-14" /> · <span className="font-mono">{callId}</span>
            </SheetDescription>
          </SheetHeader>
          <SheetBody>{callId && <CallDetail id={callId} />}</SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CallDetail({ id }: { id: string }) {
  const { t } = useTranslation("app");
  const query = useCall(id);
  if (query.isError) return <StateView kind="error" requestId={requestIdOf(query.error)} onRetry={() => void query.refetch()} />;
  if (!query.data) return <StateView kind="loading" layout="detail" />;
  const c = query.data;
  return (
    <div className="flex flex-col gap-6">
      <Details
        items={[
          { label: t("cols.decision"), value: <StatusPill status={c.decision} /> },
          { label: t("cols.time"), value: <Time value={c.time} /> },
          { label: t("cols.user"), value: c.user },
          { label: t("cols.client"), value: c.client },
          { label: t("cols.server"), value: <Mono>{c.server}</Mono> },
          { label: t("cols.tool"), value: <Mono>{c.tool}</Mono> },
          { label: t("cols.gateway"), value: <Mono>{c.gateway}</Mono> },
          { label: t("cols.latency"), value: t("ms", { ms: c.latencyMs }) },
          { label: t("calls.policy"), value: c.policy ? <SafeText text={c.policy} /> : t("calls.noPolicy") },
        ]}
      />
      {(["request", "response"] as const).map((part) => (
        <section key={part} className="flex flex-col gap-2">
          <h3 className="m-0 text-label text-ink-muted">{t(`calls.${part}`)}</h3>
          <SafeText
            as="div"
            text={c[part]}
            className="overflow-auto rounded-panel border border-edge bg-sunken p-3 font-mono text-mono-sm text-ink"
          />
        </section>
      ))}
    </div>
  );
}

/** AD-07 */
export function AuditPage({ search, onSearchChange }: Search) {
  const { t } = useTranslation("app");
  const query = useAudit(search);
  const columns = useMemo<DataTableColumn<Schemas["AuditEvent"]>[]>(
    () => [
      { accessorKey: "time", header: t("cols.time"), cell: (c) => <Time value={c.row.original.time} /> },
      { accessorKey: "actor", header: t("cols.actor") },
      { accessorKey: "action", header: t("cols.action") },
      { accessorKey: "target", header: t("cols.target"), cell: (c) => <SafeText text={c.row.original.target} /> },
      { accessorKey: "ip", header: t("cols.ip"), enableSorting: false, cell: (c) => <Mono>{c.row.original.ip}</Mono> },
    ],
    [t],
  );
  return (
    <div className="flex flex-col gap-6" data-screen="AD-07">
      <SectionTabs section="activity" />
      <PageHeader title={t("screens.AD-07")} meta={<ScreenMeta id="AD-07" />} />
      <ListTable
        id="audit"
        caption={t("screens.AD-07")}
        query={query}
        columns={columns}
        getRowId={(r) => r.id}
        search={search}
        onSearchChange={onSearchChange}
        emptyTitle={t("audit.empty")}
      />
    </div>
  );
}
