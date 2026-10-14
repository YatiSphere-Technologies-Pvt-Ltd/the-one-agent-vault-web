import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Input, PageHeader, SafeText, SealGlyph, StateView, StatusPill } from "@agentvault/ui";
import { requestIdOf, useCatalogue } from "../data/api";
import type { ListSearch } from "../data/list-search";
import { ScreenMeta } from "../screens/ScreenPlaceholder";

/** PT-01 */
export function CataloguePage({ search, onSearchChange }: { search: ListSearch; onSearchChange: (n: Partial<ListSearch>) => void }) {
  const { t } = useTranslation("app");
  const { t: tu } = useTranslation("ui");
  const query = useCatalogue({ ...search, page: search.page ?? 1 });
  const [text, setText] = useState(search.q ?? "");
  useEffect(() => {
    if ((search.q ?? "") === text) return;
    const timer = setTimeout(() => onSearchChange({ q: text || undefined }), 300);
    return () => clearTimeout(timer);
  }, [text, search.q, onSearchChange]);

  return (
    <div className="flex flex-col gap-6" data-screen="PT-01">
      <PageHeader title={t("screens.PT-01")} meta={<ScreenMeta id="PT-01" />} />
      <Input
        type="search"
        aria-label={tu("common.search")}
        placeholder={t("list.searchPlaceholder")}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="max-w-md"
      />
      {query.isError ? (
        <StateView kind="error" requestId={requestIdOf(query.error)} onRetry={() => void query.refetch()} />
      ) : !query.data ? (
        <StateView kind="loading" />
      ) : query.data.total === 0 ? (
        <StateView kind="empty" title={search.q ? t("list.noMatches") : t("portal.empty")} />
      ) : (
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
          {query.data.items.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 rounded-panel border border-edge bg-surface p-4">
              <div className="flex items-start gap-3">
                <SealGlyph hash={item.hash} state={item.sealState} size="md" label={tu(`seal.${item.sealState}`)} />
                <div className="flex min-w-0 flex-col">
                  <Link
                    to={item.kind === "server" ? "/portal/servers/$id" : "/portal/skills/$id"}
                    params={{ id: item.id }}
                    className="truncate font-mono text-mono text-link hover:text-link-hover hover:underline"
                  >
                    {item.name}
                  </Link>
                  <span className="text-body-sm text-ink-muted">
                    {t(`kinds.${item.kind}`)} · {item.owner}
                  </span>
                </div>
              </div>
              <SafeText as="p" text={item.description} className="m-0 text-body text-ink-secondary" />
              <div className="mt-auto">
                {item.access === "granted" ? (
                  <StatusPill status="allowed" />
                ) : item.access === "requiresApproval" ? (
                  <StatusPill status="requiresApproval" />
                ) : (
                  <span className="text-label text-ink-muted">{t("portal.access.available")}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
