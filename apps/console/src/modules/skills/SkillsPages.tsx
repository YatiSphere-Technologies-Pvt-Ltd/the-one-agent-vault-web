import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { Schemas } from "@agentvault/api-client";
import {
  Button,
  formatBytes,
  PageHeader,
  RiskChip,
  SafeText,
  StateView,
  StatusPill,
  type DataTableColumn,
} from "@agentvault/ui";
import { requestIdOf, useSkill, useSkillFiles, useSkillFindings, useSkills, useSkillVersions } from "../data/api";
import type { ListSearch } from "../data/list-search";
import { ScreenMeta } from "../screens/ScreenPlaceholder";
import { SectionTabs } from "../screens/SectionTabs";
import { ListTable } from "../shared/ListTable";
import { Details, Hash, Mono, ObjectLink, Panel, Time } from "../shared/cells";

type Search = { search: ListSearch; onSearchChange: (n: Partial<ListSearch>) => void };

function FindingCounts({ counts }: { counts: Schemas["FindingCounts"] }) {
  const { t } = useTranslation("app");
  const parts = (["critical", "high", "medium", "low"] as const).filter((k) => counts[k] > 0);
  if (parts.length === 0) return <span className="text-ink-muted">0</span>;
  return (
    <span className="text-body-sm tabular-nums">
      {parts.map((k) => `${counts[k]} ${t(`severity.${k}`).toLowerCase()}`).join(", ")}
    </span>
  );
}

/** SK-01 */
export function SkillsPage({ search, onSearchChange }: Search) {
  const { t } = useTranslation("app");
  const query = useSkills(search);
  const columns = useMemo<DataTableColumn<Schemas["Skill"]>[]>(
    () => [
      {
        accessorKey: "name",
        header: t("cols.name"),
        cell: (c) => (
          <ObjectLink
            name={c.row.original.name}
            link={{ to: "/app/skills/$id", params: { id: c.row.original.id } }}
            seal={{ hash: c.row.original.hash, state: c.row.original.sealState }}
            sub={c.row.original.description}
          />
        ),
      },
      { accessorKey: "status", header: t("cols.status"), cell: (c) => <StatusPill status={c.row.original.status} /> },
      { accessorKey: "risk", header: t("cols.risk"), cell: (c) => <RiskChip score={c.row.original.risk} /> },
      { accessorKey: "version", header: t("cols.version"), enableSorting: false, cell: (c) => <Mono>{c.row.original.version}</Mono> },
      {
        accessorKey: "findings",
        header: t("cols.findings"),
        enableSorting: false,
        cell: (c) => <FindingCounts counts={c.row.original.findings} />,
      },
      { accessorKey: "installs", header: t("cols.installs") },
      { accessorKey: "author", header: t("cols.author") },
      { accessorKey: "updatedAt", header: t("cols.updated"), cell: (c) => <Time value={c.row.original.updatedAt} /> },
    ],
    [t],
  );
  return (
    <div className="flex flex-col gap-6" data-screen="SK-01">
      <SectionTabs section="skills" />
      <PageHeader
        title={t("screens.SK-01")}
        meta={<ScreenMeta id="SK-01" />}
        primaryAction={
          <Button asChild variant="primary">
            <Link to="/app/skills/new">{t("skill.import")}</Link>
          </Button>
        }
      />
      <ListTable
        id="skills"
        caption={t("screens.SK-01")}
        query={query}
        columns={columns}
        getRowId={(r) => r.id}
        search={search}
        onSearchChange={onSearchChange}
        statuses={["approved", "inReview", "changesRequested", "heldDefinitionChanged", "draft", "blocked"]}
        emptyTitle={t("skill.empty")}
        emptyBody={t("skill.emptyBody")}
      />
    </div>
  );
}

/** SK-03 */
export function SkillOverview({ id }: { id: string }) {
  const { t } = useTranslation("app");
  const query = useSkill(id);
  if (query.isError) return <StateView kind="error" requestId={requestIdOf(query.error)} onRetry={() => void query.refetch()} />;
  if (!query.data) return <StateView kind="loading" layout="detail" />;
  const s = query.data;
  return (
    <Panel title={t("skill.details")}>
      <SafeText as="p" text={s.description} className="m-0 text-body text-ink-secondary" />
      <Details
        items={[
          { label: t("cols.author"), value: s.author },
          { label: t("cols.version"), value: <Mono>{s.version}</Mono> },
          { label: t("cols.source"), value: <Mono>{s.source}</Mono> },
          { label: t("cols.hash"), value: <Hash value={s.hash} /> },
          { label: t("skill.findingsSummary"), value: <FindingCounts counts={s.findings} /> },
          { label: t("cols.installs"), value: s.installs },
          { label: t("cols.updated"), value: <Time value={s.updatedAt} /> },
        ]}
      />
    </Panel>
  );
}

/** SK-04: the API returns all files at once; a plain table without paging. */
export function SkillFiles({ id }: { id: string }) {
  const { t, i18n } = useTranslation("app");
  const query = useSkillFiles(id);
  const columns = useMemo<DataTableColumn<Schemas["SkillFile"]>[]>(
    () => [
      { accessorKey: "path", header: t("cols.path"), enableSorting: false, cell: (c) => <Mono>{c.row.original.path}</Mono> },
      { accessorKey: "kind", header: t("cols.kind"), enableSorting: false, cell: (c) => t(`fileKind.${c.row.original.kind}`) },
      {
        accessorKey: "size",
        header: t("cols.size"),
        enableSorting: false,
        cell: (c) => <span className="tabular-nums">{formatBytes(c.row.original.size, i18n.language)}</span>,
      },
    ],
    [t, i18n.language],
  );
  const pageQuery = { ...query, data: query.data ? { items: query.data.items, total: query.data.items.length } : undefined } as never;
  return (
    <ListTable
      id="skill-files"
      caption={t("screens.SK-04")}
      query={pageQuery}
      columns={columns}
      getRowId={(r) => r.path}
      search={{}}
      onSearchChange={() => undefined}
      noSearch
      emptyTitle={t("skill.filesEmpty")}
    />
  );
}

/** SK-05 */
export function SkillFindings({ id, search, onSearchChange }: { id: string } & Search) {
  const { t } = useTranslation("app");
  const query = useSkillFindings(id, search);
  const columns = useMemo<DataTableColumn<Schemas["Finding"]>[]>(
    () => [
      { accessorKey: "severity", header: t("cols.severity"), cell: (c) => t(`severity.${c.row.original.severity}`) },
      { accessorKey: "rule", header: t("cols.rule"), cell: (c) => <Mono>{c.row.original.rule}</Mono> },
      {
        accessorKey: "message",
        header: t("cols.description"),
        enableSorting: false,
        cell: (c) => <SafeText text={c.row.original.message} />,
      },
      {
        accessorKey: "file",
        header: t("cols.file"),
        cell: (c) => (
          <Mono>
            {c.row.original.file}:{c.row.original.line}
          </Mono>
        ),
      },
      { accessorKey: "status", header: t("cols.status"), cell: (c) => <StatusPill status={c.row.original.status} /> },
    ],
    [t],
  );
  return (
    <ListTable
      id="skill-findings"
      caption={t("screens.SK-05")}
      query={query}
      columns={columns}
      getRowId={(r) => r.id}
      search={search}
      onSearchChange={onSearchChange}
      statuses={["pending", "acceptedRisk", "resolved"]}
      emptyTitle={t("skill.findingsEmpty")}
    />
  );
}

/** SK-06 */
export function SkillVersions({ id }: { id: string }) {
  const { t } = useTranslation("app");
  const query = useSkillVersions(id);
  const columns = useMemo<DataTableColumn<Schemas["SkillVersion"]>[]>(
    () => [
      { accessorKey: "version", header: t("cols.version"), enableSorting: false, cell: (c) => <Mono>{c.row.original.version}</Mono> },
      { accessorKey: "hash", header: t("cols.hash"), enableSorting: false, cell: (c) => <Hash value={c.row.original.hash} /> },
      { accessorKey: "status", header: t("cols.status"), enableSorting: false, cell: (c) => <StatusPill status={c.row.original.status} /> },
      { accessorKey: "publishedBy", header: t("cols.publishedBy"), enableSorting: false },
      { accessorKey: "publishedAt", header: t("cols.published"), enableSorting: false, cell: (c) => <Time value={c.row.original.publishedAt} /> },
      { accessorKey: "summary", header: t("cols.summary"), enableSorting: false, cell: (c) => <SafeText text={c.row.original.summary} /> },
    ],
    [t],
  );
  const pageQuery = { ...query, data: query.data ? { items: query.data.items, total: query.data.items.length } : undefined } as never;
  return (
    <ListTable
      id="skill-versions"
      caption={t("screens.SK-06")}
      query={pageQuery}
      columns={columns}
      getRowId={(r) => r.version}
      search={{}}
      onSearchChange={() => undefined}
      noSearch
      emptyTitle={t("skill.versionsEmpty")}
    />
  );
}
