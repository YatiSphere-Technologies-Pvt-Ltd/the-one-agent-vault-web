import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageHeader, SafeText, StateView } from "@agentvault/ui";
import { requestIdOf, useNotifications } from "../data/api";
import { ScreenMeta } from "../screens/ScreenPlaceholder";
import { Time } from "../shared/cells";

function NotificationList({ limit }: { limit?: number }) {
  const { t } = useTranslation("app");
  const query = useNotifications();
  if (query.isError) return <StateView kind="error" requestId={requestIdOf(query.error)} onRetry={() => void query.refetch()} />;
  if (!query.data) return <StateView kind="loading" />;
  const items = limit ? query.data.items.slice(0, limit) : query.data.items;
  if (items.length === 0) return <p className="m-0 p-4 text-body text-ink-muted">{t("notificationsPage.empty")}</p>;
  return (
    <ul className="m-0 flex list-none flex-col p-0">
      {items.map((n) => (
        <li key={n.id} className="border-b border-edge-subtle last:border-b-0">
          <Link to={n.href as "/app"} className="flex flex-col gap-1 p-4 text-ink no-underline hover:bg-hover">
            <span className="flex items-center gap-2">
              {!n.read && (
                <>
                  <span aria-hidden className="size-2 shrink-0 rounded-pill bg-status-held-solid" />
                  <span className="sr-only">{t("notificationsPage.unread")}: </span>
                </>
              )}
              <SafeText text={n.title} className={n.read ? "text-body" : "text-body font-semibold"} />
            </span>
            <SafeText text={n.body} className="text-body-sm text-ink-secondary" />
            <span className="text-caption text-ink-muted">
              <Time value={n.time} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Bell panel. */
export function NotificationsPanel() {
  const { t } = useTranslation("app");
  return (
    <div className="flex max-h-96 flex-col">
      <div className="overflow-auto">
        <NotificationList limit={5} />
      </div>
      <div className="border-t border-edge-subtle p-3">
        <Link to="/app/notifications" className="text-body-sm text-link hover:text-link-hover hover:underline">
          {t("notifications.viewAll")}
        </Link>
      </div>
    </div>
  );
}

/** SH-05 */
export function NotificationsPage() {
  const { t } = useTranslation("app");
  return (
    <div className="flex flex-col gap-6" data-screen="SH-05">
      <PageHeader title={t("screens.SH-05")} meta={<ScreenMeta id="SH-05" />} />
      <div className="rounded-panel border border-edge bg-surface">
        <NotificationList />
      </div>
    </div>
  );
}
