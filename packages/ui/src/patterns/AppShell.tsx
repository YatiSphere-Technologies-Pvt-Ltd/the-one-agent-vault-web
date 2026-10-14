import { useState, type ReactNode } from "react";
import { Link, useLocation, type LinkProps } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "../lib/cn";
import { storage } from "../lib/storage";
import { useMediaQuery } from "../lib/use-media-query";
import { Tooltip, TooltipContent, TooltipTrigger } from "../primitives/tooltip";
import { TopBar, type TopBarProps } from "./TopBar";

export interface NavChild {
  id: string;
  label: string;
  link: LinkProps;
  /** Path prefixes for this page. Among siblings, the longest matching prefix wins. */
  matchPaths: string[];
}

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
  /** Pages of this section, shown under the item while the section is active. */
  children?: NavChild[];
}

/** Length of the longest of `paths` that matches `pathname` (exactly or as a prefix), or -1. */
export function matchLength(pathname: string, paths: string[]): number {
  let best = -1;
  for (const p of paths) {
    if ((pathname === p || pathname === `${p}/` || pathname.startsWith(`${p}/`)) && p.length > best) best = p.length;
  }
  return best;
}

/** The id of the child whose path matches `pathname` most specifically, if any. */
export function activeChildId(pathname: string, children: NavChild[]): string | undefined {
  let best: { id: string; length: number } | undefined;
  for (const child of children) {
    const length = matchLength(pathname, child.matchPaths);
    if (length >= 0 && (!best || length > best.length)) best = { id: child.id, length };
  }
  return best?.id;
}

export interface AppShellProps extends TopBarProps {
  nav: NavItem[];
  /** Links below the main navigation, e.g. a switch to the employee portal. */
  secondaryNav?: NavItem[];
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

/** One navigation item; its section pages appear beneath it while it is active. */
function NavEntry({
  item,
  active,
  collapsed,
  pathname,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  pathname: string;
}) {
  const { t, i18n } = useTranslation("ui");
  const children = item.children ?? [];
  const showChildren = active && !collapsed && children.length > 1;
  const currentChild = showChildren ? activeChildId(pathname, children) : undefined;
  const link = (
    <Link
      {...item.link}
      data-testid={`nav-${item.id}`}
      aria-current={active && !currentChild ? "page" : undefined}
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
    <li>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side={i18n.dir() === "rtl" ? "left" : "right"}>{item.label}</TooltipContent>
        </Tooltip>
      ) : (
        link
      )}
      {showChildren && (
        <ul aria-label={item.label} className="m-0 mt-0.5 mb-1 flex list-none flex-col gap-0.5 p-0 ps-6">
          {children.map((child) => {
            const current = child.id === currentChild;
            return (
              <li key={child.id}>
                <Link
                  {...child.link}
                  data-testid={`nav-${item.id}-${child.id}`}
                  aria-current={current ? "page" : undefined}
                  activeProps={{}}
                  className={cn(
                    "flex min-h-8 items-center rounded-control border-s-2 border-transparent px-3 text-body-sm text-ink-secondary no-underline",
                    "hover:bg-hover hover:text-ink",
                    current && "border-action-primary-bg bg-selected font-semibold text-ink hover:bg-selected",
                  )}
                >
                  <span className="truncate">{child.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

/** Console shell: top bar, left navigation (216 px, 64 px collapsed), banner slot, page. */
export function AppShell({ nav, secondaryNav, banner, children, ...topBar }: AppShellProps) {
  const { t } = useTranslation("ui");
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
            {nav.map((item) => (
              <NavEntry key={item.id} item={item} active={isActive(item)} collapsed={collapsed} pathname={pathname} />
            ))}
          </ul>
          {secondaryNav && secondaryNav.length > 0 && (
            <ul className="m-0 mt-2 flex list-none flex-col gap-0.5 border-t border-edge-subtle p-0 pt-2">
              {secondaryNav.map((item) => (
                <NavEntry key={item.id} item={item} active={isActive(item)} collapsed={collapsed} pathname={pathname} />
              ))}
            </ul>
          )}
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

export interface PortalNavItem {
  id: string;
  label: string;
  link: LinkProps;
  matchPaths: string[];
}

/** Employee portal shell: same top bar, no left navigation (a horizontal nav instead), narrower content. */
export function PortalShell({
  banner,
  children,
  portalNav,
  portalNavLabel,
  ...topBar
}: Omit<AppShellProps, "nav"> & { portalNav?: PortalNavItem[]; portalNavLabel?: string }) {
  const { pathname } = useLocation();
  const current = portalNav ? activeChildId(pathname, portalNav) : undefined;
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <SkipLink />
      <TopBar {...topBar} />
      {portalNav && portalNav.length > 0 && (
        <nav aria-label={portalNavLabel} className="border-b border-edge-subtle bg-surface">
          <ul className="m-0 mx-auto flex w-full max-w-(--av-size-portal-max) list-none gap-6 overflow-x-auto p-0 px-6">
            {portalNav.map((item) => {
              const active = item.id === current;
              return (
                <li key={item.id}>
                  <Link
                    {...item.link}
                    data-testid={`portal-nav-${item.id}`}
                    aria-current={active ? "page" : undefined}
                    activeProps={{}}
                    className={cn(
                      "-mb-px inline-flex min-h-11 items-center border-b-2 border-transparent text-body whitespace-nowrap text-ink-muted no-underline hover:text-ink",
                      active && "border-action-primary-bg font-semibold text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
      {banner && <div className="border-b border-edge-subtle">{banner}</div>}
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-(--av-size-portal-max) flex-1 p-6 outline-none">
        {children}
      </main>
    </div>
  );
}
