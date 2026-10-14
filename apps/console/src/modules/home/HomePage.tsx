import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { DataTable, PageHeader, RiskChip, StateView, StatusPill } from "@agentvault/ui";
import { requestIdOf, useHome } from "../data/api";
import { useCallColumns } from "../activity/callColumns";
import { ScreenMeta } from "../screens/ScreenPlaceholder";
import { ObjectLink, Panel, StatTile } from "../shared/cells";

/** SH-03 */
export function HomePage() {
  const { t } = useTranslation("app");
  const query = useHome();
  const callColumns = useCallColumns();
  const header = <PageHeader title={t("screens.SH-03")} meta={<ScreenMeta id="SH-03" />} />;
  if (query.isError) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <StateView kind="error" requestId={requestIdOf(query.error)} onRetry={() => void query.refetch()} />
      </div>
    );
  }
  if (!query.data) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <StateView kind="loading" layout="detail" />
      </div>
    );
  }
  const h = query.data;
  return (
    <div className="flex flex-col gap-6" data-screen="SH-03">
      {header}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
        <StatTile label={t("home.servers")} value={h.servers} link={{ to: "/app/servers" }} />
        <StatTile label={t("home.skills")} value={h.skills} link={{ to: "/app/skills" }} />
        <StatTile
          label={t("home.brokenSeals")}
          value={h.brokenSeals}
          tone={h.brokenSeals > 0 ? "held" : "neutral"}
          link={{ to: "/app/servers", search: { status: "heldDefinitionChanged" } }}
        />
        <StatTile label={t("home.pendingReviews")} value={h.pendingReviews} link={{ to: "/app/reviews" }} />
        <StatTile
          label={t("home.heldCalls")}
          value={h.heldCalls}
          tone={h.heldCalls > 0 ? "held" : "neutral"}
          link={{ to: "/app/activity/calls", search: { status: "requiresApproval" } }}
        />
        <StatTile label={t("home.callsToday")} value={h.callsToday} link={{ to: "/app/activity/calls" }} />
        <StatTile
          label={t("home.blockedToday")}
          value={h.blockedToday}
          tone={h.blockedToday > 0 ? "danger" : "neutral"}
          link={{ to: "/app/activity/calls", search: { status: "blocked" } }}
        />
      </div>
      <Panel title={t("home.attention")}>
        {h.attention.length === 0 ? (
          <p className="m-0 text-body text-ink-muted">{t("home.attentionEmpty")}</p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {h.attention.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-edge-subtle pb-3 last:border-b-0 last:pb-0">
                <ObjectLink
                  name={s.name}
                  link={{ to: "/app/servers/$id", params: { id: s.id } }}
                  seal={{ hash: s.hash, state: s.sealState }}
                  sub={s.description}
                />
                <div className="flex items-center gap-2">
                  <StatusPill status={s.status} />
                  <RiskChip score={s.risk} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel
        title={t("home.recentCalls")}
        actions={
          <Link to="/app/activity/calls" className="text-body-sm text-link hover:text-link-hover hover:underline">
            {t("home.viewAllCalls")}
          </Link>
        }
      >
        <DataTable id="home-calls" caption={t("home.recentCalls")} columns={callColumns} data={h.recentCalls} getRowId={(r) => r.id} />
      </Panel>
    </div>
  );
}
