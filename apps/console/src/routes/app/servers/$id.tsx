import { createFileRoute, Outlet } from "@tanstack/react-router";
import * as z from "zod/mini";
import { useTranslation } from "react-i18next";
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, PageHeader, RouteTabs, type RouteTab } from "@agentvault/ui";
import { NotBuilt, ScreenMeta } from "../../../modules/screens/ScreenPlaceholder";
import { useServer } from "../../../modules/data/api";
import { useActiveScreenId } from "../../../modules/screens/useActiveScreenId";

const search = z.object({ killswitch: z.catch(z.optional(z.literal(1)), undefined) });

/** Object layout: header, tabs (the tab lives in the URL), then the active tab's route. MC-16 kill switch is a modal on ?killswitch=1. */
export const Route = createFileRoute("/app/servers/$id")({
  validateSearch: search,
  component: ObjectLayout,
});

function ObjectLayout() {
  const { t } = useTranslation("app");
  const { id } = Route.useParams();
  const screenId = useActiveScreenId("MC-03");
  const { t: tu } = useTranslation("ui");
  const server = useServer(id).data;
  const { killswitch } = Route.useSearch();
  const navigate = Route.useNavigate();
  const tabs: RouteTab[] = [
    { value: "overview", label: t("tabs.overview"), link: { to: "/app/servers/$id", params: { id } }, exact: true },
    { value: "tools", label: t("tabs.tools"), link: { to: "/app/servers/$id/tools", params: { id } }, exact: true },
    { value: "versions", label: t("tabs.versions"), link: { to: "/app/servers/$id/versions", params: { id } }, exact: true },
    { value: "access", label: t("tabs.access"), link: { to: "/app/servers/$id/access", params: { id } }, exact: true },
    { value: "credentials", label: t("tabs.credentials"), link: { to: "/app/servers/$id/credentials", params: { id } }, exact: true },
    { value: "activity", label: t("tabs.activity"), link: { to: "/app/servers/$id/activity", params: { id } }, exact: true },
  ];
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[{ label: t("nav.servers"), link: { to: "/app/servers" } }, { label: id }]}
        title={<span className="font-mono">{server?.name ?? id}</span>}
        meta={
          <>
            {t(`screens.${screenId}`)} · <ScreenMeta id={screenId} />
          </>
        }
        {...(server
          ? {
              seal: { hash: server.hash, state: server.sealState, label: tu(`seal.${server.sealState}`) },
              status: server.status,
              risk: server.risk,
            }
          : {})}
        {...(server?.sealState === "broken"
          ? {
              secondaryActions: <Button>{t("server.keepPinned")}</Button>,
              primaryAction: <Button variant="primary">{t("server.reviewChange")}</Button>,
            }
          : {})}
        overflow={[
          {
            id: "killswitch",
            label: t("screens.MC-16"),
            destructive: true,
            onSelect: () => void navigate({ search: (prev) => ({ ...prev, killswitch: 1 as const }) }),
          },
        ]}
      />
      <RouteTabs tabs={tabs} label={t("sections.server")} />
      <Outlet />
      <Dialog
        open={killswitch === 1}
        onOpenChange={(open) => {
          if (!open) void navigate({ search: (prev) => ({ ...prev, killswitch: undefined }) });
        }}
      >
        <DialogContent width="form">
          <DialogHeader>
            <DialogTitle>{t("screens.MC-16")}</DialogTitle>
            <DialogDescription>
              <ScreenMeta id="MC-16" />
            </DialogDescription>
          </DialogHeader>
          <NotBuilt id="MC-16" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
