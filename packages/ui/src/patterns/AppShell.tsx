import { useState, type ReactNode } from "react";
import { Link, useLocation, type LinkProps } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../lib/cn";
import { storage } from "../lib/storage";
import { useMediaQuery } from "../lib/use-media-query";
import { Tooltip, TooltipContent, TooltipTrigger } from "../primitives/tooltip";
import { TopBar, type TopBarProps } from "./TopBar";

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  link: LinkProps;
  /** Path prefixes that make this item active, e.g. ["/app/servers", "/app/policies"]. */
  matchPaths: string[];
  /** Match the first path exactly (Home). */
  exact?: boolean;
  /** Shows a dot: something waits for the user. */
  waiting?: boolean;
}

export interface AppShellProps extends TopBarProps {
  nav: NavItem[];
  /** Global banner slot between the top bar and the page. */
  banner?: ReactNode;
  children: ReactNode;
}

export const NAV_COLLAPSED_KEY = "av.nav.collapsed";

function SkipLink() {
  const { t } = useTranslation("ui");
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-(--av-z-tooltip) focus:rounded-control focus:bg-surface focus:p-3 focus:text-link"
    >
      {t("shell.skipToContent")}
    </a>
  );
}

export { SkipLink };

/** Console shell: top bar, left navigation (216 px, 64 px collapsed), banner slot, page. */
export function AppShell({ nav, banner, children, ...topBar }: AppShellProps) {
  const { t, i18n } = useTranslation("ui");
  const wide = useMediaQuery("(min-width: 1024px)");
  const [collapsedPref, setCollapsedPref] = useState(() => storage.get(NAV_COLLAPSED_KEY) === "true");
  const collapsed = collapsedPref || !wide;
  const { pathname } = useLocation();
  const isActive = (item: NavItem) =>
    item.exact
      ? item.matchPaths.some((p) => pathname === p || pathname === `${p}/`)
      : item.matchPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const toggle = () => {
    storage.set(NAV_COLLAPSED_KEY, String(!collapsedPref));
    setCollapsedPref(!collapsedPref);
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-canvas text-ink">
      <SkipLink />
      <TopBar {...topBar} />
      <div className="flex min-h-0 flex-1">
        <nav
          aria-label={t("shell.mainNav")}
          data-collapsed={collapsed}
          className={cn(
            "flex shrink-0 flex-col gap-1 overflow-y-auto border-e border-edge-subtle bg-canvas p-2",
            collapsed ? "w-(--av-size-nav-collapsed)" : "w-(--av-size-nav)",
          )}
        >
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {nav.map((item) => {
              const active = isActive(item);
              const link = (
                <Link
                  {...item.link}
                  data-testid={`nav-${item.id}`}
                  aria-current={active ? "page" : undefined}
                  activeProps={{}}
                  className={cn(
                    "relative flex min-h-(--av-size-control-md) items-center gap-3 rounded-control px-3 text-body text-ink-secondary no-underline",
                    "hover:bg-hover hover:text-ink",
                    collapsed && "justify-center px-0",
                    active && "bg-surface font-semibold text-ink hover:bg-surface",
                  )}
                >
                  <span aria-hidden className="flex [&_svg]:size-(--av-size-icon-md)">
                    {item.icon}
                  </span>
                  <span className={cn("flex-1 truncate", collapsed && "sr-only")}>{item.label}</span>
                  {item.waiting && (
                    <>
                      <span
                        aria-hidden
                        className={cn("size-2 shrink-0 rounded-pill bg-status-held-solid", collapsed && "absolute end-3 top-2")}
                      />
                      <span className="sr-only">, {t("shell.waiting")}</span>
                    </>
                  )}
                </Link>
              );
              return (
                <li key={item.id}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side={i18n.dir() === "rtl" ? "left" : "right"}>{item.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    link
                  )}
                </li>
              );
            })}
          </ul>
          {wide && (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={!collapsed}
              aria-label={collapsed ? t("shell.expandNav") : t("shell.collapseNav")}
              className={cn(
                "mt-auto flex min-h-(--av-size-control-md) items-center gap-3 rounded-control px-3 text-body text-ink-muted hover:bg-hover hover:text-ink",
                collapsed && "justify-center px-0",
              )}
            >
              {collapsed ? (
                <PanelLeftOpen aria-hidden className="size-(--av-size-icon-md) rtl:-scale-x-100" />
              ) : (
                <PanelLeftClose aria-hidden className="size-(--av-size-icon-md) rtl:-scale-x-100" />
              )}
              {!collapsed && <span>{t("shell.collapseNav")}</span>}
            </button>
          )}
        </nav>
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          {banner && (
            <div className="border-b border-edge-subtle">
              {banner}
            </div>
          )}
          <main id="main" tabIndex={-1} className="mx-auto w-full max-w-(--av-size-content-max) flex-1 p-6 outline-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

/** Employee portal shell: same top bar, no left navigation, narrower content. */
export function PortalShell({ banner, children, ...topBar }: Omit<AppShellProps, "nav">) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <SkipLink />
      <TopBar {...topBar} />
      {banner && <div className="border-b border-edge-subtle">{banner}</div>}
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-(--av-size-portal-max) flex-1 p-6 outline-none">
        {children}
      </main>
    </div>
  );
}
