import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader, StateView, type Breadcrumb } from "@agentvault/ui";
import { screenById, type ScreenId } from "../../screens";

/** Screen ID and release line shown under every placeholder title. */
export function ScreenMeta({ id }: { id: ScreenId }) {
  const { t } = useTranslation("app");
  const screen = screenById[id];
  return (
    <span>
      <span className="font-mono">{id}</span> · {t("placeholder.release", { release: screen.release })}
    </span>
  );
}

export function NotBuilt({ id }: { id: ScreenId }) {
  const { t } = useTranslation("app");
  return <StateView kind="empty" title={t("placeholder.notBuilt", { id })} />;
}

/** Placeholder for a screen that is not built yet: header with title and ID, empty state. */
export function ScreenPlaceholder({
  id,
  breadcrumbs,
  tabs,
  title,
}: {
  id: ScreenId;
  breadcrumbs?: Breadcrumb[];
  /** Section tabs rendered above the header. */
  tabs?: ReactNode;
  title?: string;
}) {
  const { t } = useTranslation("app");
  return (
    <div className="flex flex-col gap-6" data-screen={id}>
      {tabs}
      <PageHeader
        title={title ?? t(`screens.${id}`)}
        meta={<ScreenMeta id={id} />}
        {...(breadcrumbs ? { breadcrumbs } : {})}
      />
      <NotBuilt id={id} />
    </div>
  );
}
