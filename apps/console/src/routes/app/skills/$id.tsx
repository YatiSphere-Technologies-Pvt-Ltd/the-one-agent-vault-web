import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, RouteTabs, type RouteTab } from "@agentvault/ui";
import { ScreenMeta } from "../../../modules/screens/ScreenPlaceholder";
import { useSkill } from "../../../modules/data/api";
import { useActiveScreenId } from "../../../modules/screens/useActiveScreenId";

/** Object layout: header, tabs (the tab lives in the URL), then the active tab's route. */
export const Route = createFileRoute("/app/skills/$id")({
  component: ObjectLayout,
});

function ObjectLayout() {
  const { t } = useTranslation("app");
  const { id } = Route.useParams();
  const screenId = useActiveScreenId("SK-03");
  const { t: tu } = useTranslation("ui");
  const skill = useSkill(id).data;
  const tabs: RouteTab[] = [
    { value: "overview", label: t("tabs.overview"), link: { to: "/app/skills/$id", params: { id } }, exact: true },
    { value: "files", label: t("tabs.files"), link: { to: "/app/skills/$id/files", params: { id } }, exact: true },
    { value: "findings", label: t("tabs.findings"), link: { to: "/app/skills/$id/findings", params: { id } }, exact: true },
    { value: "versions", label: t("tabs.versions"), link: { to: "/app/skills/$id/versions", params: { id } }, exact: true },
    { value: "distribution", label: t("tabs.distribution"), link: { to: "/app/skills/$id/distribution", params: { id } }, exact: true },
  ];
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[{ label: t("nav.skills"), link: { to: "/app/skills" } }, { label: id }]}
        title={<span className="font-mono">{skill?.name ?? id}</span>}
        meta={
          <>
            {t(`screens.${screenId}`)} · <ScreenMeta id={screenId} />
          </>
        }
        {...(skill
          ? {
              seal: { hash: skill.hash, state: skill.sealState, label: tu(`seal.${skill.sealState}`) },
              status: skill.status,
              risk: skill.risk,
            }
          : {})}
      />
      <RouteTabs tabs={tabs} label={t("sections.skill")} />
      <Outlet />
    </div>
  );
}
