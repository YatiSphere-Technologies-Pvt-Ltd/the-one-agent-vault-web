import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Schemas } from "@agentvault/api-client";
import { StatusPill, type DataTableColumn } from "@agentvault/ui";
import { Mono, Time } from "../shared/cells";

type Call = Schemas["Call"];

export function useCallColumns({ withServer = true }: { withServer?: boolean } = {}) {
  const { t } = useTranslation("app");
  return useMemo<DataTableColumn<Call>[]>(
    () => [
      { accessorKey: "time", header: t("cols.time"), cell: (c) => <Time value={c.row.original.time} /> },
      { accessorKey: "user", header: t("cols.user") },
      { accessorKey: "client", header: t("cols.client"), enableSorting: false },
      ...(withServer
        ? [{ accessorKey: "server", header: t("cols.server"), cell: (c) => <Mono>{c.row.original.server}</Mono> } satisfies DataTableColumn<Call>]
        : []),
      { accessorKey: "tool", header: t("cols.tool"), cell: (c) => <Mono>{c.row.original.tool}</Mono> },
      { accessorKey: "decision", header: t("cols.decision"), cell: (c) => <StatusPill status={c.row.original.decision} /> },
      {
        accessorKey: "latencyMs",
        header: t("cols.latency"),
        cell: (c) => <span className="tabular-nums">{t("ms", { ms: c.row.original.latencyMs })}</span>,
      },
    ],
    [t, withServer],
  );
}

export const callDecisions = ["allowed", "requiresApproval", "warned", "redacted", "denied", "blocked", "error"] as const;
