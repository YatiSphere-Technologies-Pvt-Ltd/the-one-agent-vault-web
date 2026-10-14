import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DataTable,
  PageHeader,
  RiskChip,
  SafeText,
  SealCompare,
  StatusPill,
  StatusVocabulary,
  Strip,
  StripList,
  type DataTableColumn,
  type SortingState,
} from "@agentvault/ui";
import { changedTools, pinned, served, strips, type ChangedTool } from "./mock";

// The confirm dialog (and the toast it raises) load when first opened.
const ConfirmDialog = lazy(() =>
  import("@agentvault/ui/confirm-dialog").then((m) => ({ default: m.ConfirmDialog })),
);
const toast = (message: string) =>
  void import("@agentvault/ui/toaster").then((m) => m.notify.success(message));

/** The definition-change moment: the visual benchmark for every later screen. */
export function ReferencePage() {
  const { t } = useTranslation("app");
  const [sorting, setSorting] = useState<SortingState>([{ id: "risk", desc: true }]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const columns = useMemo<DataTableColumn<ChangedTool>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("reference.tool"),
        enableSorting: true,
        cell: (ctx) => <code className="font-mono text-mono">{ctx.row.original.name}</code>,
      },
      {
        accessorKey: "change",
        header: t("reference.change"),
        enableSorting: false,
        cell: (ctx) => <SafeText text={ctx.row.original.change} className="text-ink-secondary" />,
      },
      {
        accessorKey: "risk",
        header: t("reference.risk"),
        enableSorting: true,
        cell: (ctx) => <RiskChip score={ctx.row.original.risk} />,
      },
      {
        accessorKey: "status",
        header: t("reference.status"),
        enableSorting: false,
        cell: (ctx) => <StatusPill status={ctx.row.original.status} />,
      },
    ],
    [t],
  );

  // Stand-in for server-side sorting.
  const rows = useMemo(() => {
    const [sort] = sorting;
    if (!sort) return changedTools;
    const key = sort.id as keyof ChangedTool;
    return [...changedTools].sort((a, b) => {
      const order = String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true });
      return sort.desc ? -order : order;
    });
  }, [sorting]);

  return (
    <div className="flex flex-col gap-8" data-screen="reference">
      <PageHeader
        breadcrumbs={[
          { label: t("reference.breadcrumbServers"), link: { to: "/app/servers" } },
          { label: t("reference.title") },
        ]}
        title={<span className="font-mono">{t("reference.title")}</span>}
        meta={t("reference.meta")}
        seal={{ hash: served.hash, state: "broken", label: t("reference.sealLabel") }}
        status={StatusVocabulary.HeldDefinitionChanged}
        risk={62}
        secondaryActions={<Button variant="secondary">{t("reference.keepPinned")}</Button>}
        primaryAction={<Button variant="primary">{t("reference.reviewChange")}</Button>}
        overflow={[
          { id: "export", label: t("reference.exportDiff"), onSelect: () => undefined },
          {
            id: "disable",
            label: t("reference.disable"),
            destructive: true,
            onSelect: () => setConfirmOpen(true),
          },
        ]}
      />
      <SealCompare pinned={pinned} served={served} />
      <section aria-labelledby="changed-tools" className="flex flex-col gap-3">
        <h2 id="changed-tools" className="m-0 text-title-3 text-ink">
          {t("reference.changedTools")}
        </h2>
        <DataTable
          id="reference-changed-tools"
          caption={t("reference.changedTools")}
          columns={columns}
          data={rows}
          getRowId={(row) => row.name}
          sorting={sorting}
          onSortingChange={setSorting}
          rowActions={() => (
            <Button variant="ghost" size="sm">
              {t("reference.open")}
            </Button>
          )}
        />
      </section>
      <StripList heading={t("reference.heldCalls")}>
        {strips.map((s) => (
          <Strip
            key={s.id}
            state={s.state}
            time={s.time}
            timeNote={s.timeNote}
            who={
              <div className="flex flex-col">
                <SafeText text={s.who.name} className="text-label text-ink" />
                <SafeText text={s.who.client} className="text-body-sm text-ink-muted" />
              </div>
            }
            what={<code className="font-mono text-mono">{s.tool}</code>}
            why={<SafeText text={s.why} />}
            actions={
              s.state === "person" ? (
                <>
                  <Button variant="secondary" size="lg">
                    {t("reference.deny")}
                  </Button>
                  <Button variant="primary" size="lg">
                    {t("reference.approve")}
                  </Button>
                </>
              ) : (
                <Button variant="secondary" size="lg">
                  {t("reference.open")}
                </Button>
              )
            }
          />
        ))}
      </StripList>
      {confirmOpen && (
        <Suspense fallback={null}>
          <ConfirmDialog
            tier={2}
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title={t("reference.disableTitle")}
            actionLabel={t("reference.disable")}
            impact={<p className="m-0">{t("reference.disableImpact")}</p>}
            objectName="salesforce-crm"
            onConfirm={() => toast(t("reference.disabled"))}
          />
        </Suspense>
      )}
    </div>
  );
}
