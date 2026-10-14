import { lazy, Suspense, useCallback, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api";
import { sessionQueryOptions } from "../auth/session";
import { useTranslation } from "react-i18next";
import { icons } from "@agentvault/icons";
import { AppShell, PortalShell, usePaletteShortcut, type NavChild, type NavItem, type PortalNavItem } from "@agentvault/ui";
import { screenById } from "../../screens";
import { sections, type Section } from "../screens/SectionTabs";
import { isReleased, useFlags } from "../../flags";
import { FlagToggles } from "./FlagToggles";
import { NotificationsPanel } from "../notifications/Notifications";
import { usePaletteItems } from "./palette";
import { demoUser, demoWorkspaces, useInboxCounts } from "./session";

// cmdk loads the first time the palette opens, not with every page.
const CommandPalette = lazy(() =>
  import("@agentvault/ui/command-palette").then((m) => ({ default: m.CommandPalette })),
);

function Palette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const items = usePaletteItems();
  const [used, setUsed] = useState(open);
  if (open && !used) setUsed(true);
  if (!used) return null;
  return (
    <Suspense fallback={null}>
      <CommandPalette open={open} onOpenChange={onOpenChange} items={items} />
    </Suspense>
  );
}

/** In demo deployments (mock API in production) say plainly that the data is not real. */
function useDemoBanner() {
  const { t } = useTranslation("app");
  if (import.meta.env.DEV || import.meta.env.VITE_MOCK_API !== "true") return null;
  return (
    <p role="note" className="m-0 bg-status-info-bg px-6 py-2 text-body-sm text-status-info-fg">
      {t("demo.banner")}
    </p>
  );
}

function useShellProps(mode: "console" | "portal") {
  const { t } = useTranslation("ui");
  const navigate = useNavigate();
  const counts = useInboxCounts();
  const queryClient = useQueryClient();
  const session = useQuery(sessionQueryOptions).data;
  const user = session?.user ?? demoUser;
  const workspaces = session?.user.workspaces ?? demoWorkspaces;
  const [workspaceId, setWorkspaceId] = useState(demoWorkspaces[0]?.id ?? "");
  const [paletteOpen, setPaletteOpen] = useState(false);
  usePaletteShortcut(useCallback(() => setPaletteOpen((o) => !o), []));
  return {
    paletteOpen,
    setPaletteOpen,
    counts,
    topBar: {
      homeLink: { to: mode === "console" ? "/app" : "/portal" },
      workspaces,
      workspaceId,
      onWorkspaceChange: setWorkspaceId,
      onOpenSearch: () => setPaletteOpen(true),
      unreadCount: counts.notifications,
      notificationsPanel: <NotificationsPanel />,
      user: { name: user.name, email: user.email },
      profileLink: { to: mode === "console" ? "/app/me" : "/portal/me" },
      switchLink: { to: mode === "console" ? "/portal" : "/app" },
      switchLabel: mode === "console" ? t("shell.switchToPortal") : t("shell.switchToConsole"),
      onSignOut: () =>
        void (async () => {
          await api.POST("/api/auth/logout").catch(() => undefined);
          queryClient.clear();
          queryClient.setQueryData(sessionQueryOptions.queryKey, null);
          await navigate({ to: "/login" });
        })(),
      accountExtra: <FlagToggles />,
    } as const,
  };
}

export function ConsoleLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation("app");
  const flags = useFlags();
  const { paletteOpen, setPaletteOpen, counts, topBar } = useShellProps("console");
  const demoBanner = useDemoBanner();
  const Icon = icons;
  // Section pages for the sidebar, filtered by release flags (same source as the section tabs).
  const pages = (section: Section, extra: NavChild[] = []): NavChild[] => [
    ...sections[section]
      .filter((p) => isReleased(screenById[p.id].release, flags))
      .map((p) => ({ id: p.id, label: t(`navPages.${p.id}`), link: { to: p.to }, matchPaths: [String(p.to)] })),
    ...extra,
  ];
  const nav: NavItem[] = [
    { id: "home", label: t("nav.home"), icon: <Icon.home />, link: { to: "/app" }, matchPaths: ["/app"], exact: true },
    {
      id: "servers",
      label: t("nav.servers"),
      icon: <Icon.servers />,
      link: { to: "/app/servers" },
      matchPaths: ["/app/servers", "/app/virtual-servers", "/app/policies", "/app/endpoints"],
      children: pages("servers"),
    },
    {
      id: "skills",
      label: t("nav.skills"),
      icon: <Icon.skills />,
      link: { to: "/app/skills" },
      matchPaths: ["/app/skills", "/app/skill-packs"],
      children: pages("skills"),
    },
    {
      id: "reviews",
      label: t("nav.reviews"),
      icon: <Icon.reviews />,
      link: { to: "/app/reviews" },
      matchPaths: ["/app/reviews"],
      waiting: counts.reviews > 0,
    },
    ...(isReleased("R2", flags)
      ? [
          {
            id: "approvals",
            label: t("nav.approvals"),
            icon: <Icon.approvals />,
            link: { to: "/app/approvals" },
            matchPaths: ["/app/approvals"],
            waiting: counts.approvals > 0,
          } satisfies NavItem,
        ]
      : []),
    {
      id: "activity",
      label: t("nav.activity"),
      icon: <Icon.activity />,
      link: { to: "/app/activity/calls" },
      matchPaths: ["/app/activity", "/app/audit"],
      children: pages("activity"),
    },
    {
      id: "discovery",
      label: t("nav.discovery"),
      icon: <Icon.discovery />,
      link: { to: "/app/discovery" },
      matchPaths: ["/app/discovery", "/app/posture"],
      children: pages("discovery"),
    },
    {
      id: "settings",
      label: t("nav.settings"),
      icon: <Icon.settings />,
      link: { to: "/app/settings/org" },
      matchPaths: ["/app/settings", "/app/setup"],
      children: pages("settings", [
        { id: "SH-02", label: t("navPages.SH-02"), link: { to: "/app/setup" }, matchPaths: ["/app/setup"] },
      ]),
    },
  ];
  const secondaryNav: NavItem[] = [
    { id: "portal", label: t("nav.portal"), icon: <Icon.portal />, link: { to: "/portal" }, matchPaths: ["/portal"] },
  ];
  return (
    <AppShell nav={nav} secondaryNav={secondaryNav} {...topBar} {...(demoBanner ? { banner: demoBanner } : {})}>
      {children}
      <Palette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </AppShell>
  );
}

export function PortalLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation("app");
  const { paletteOpen, setPaletteOpen, topBar } = useShellProps("portal");
  const portalNav: PortalNavItem[] = [
    { id: "PT-01", label: t("screens.PT-01"), link: { to: "/portal" }, matchPaths: ["/portal"] },
    { id: "PT-04", label: t("screens.PT-04"), link: { to: "/portal/me" }, matchPaths: ["/portal/me"] },
    { id: "PT-05", label: t("screens.PT-05"), link: { to: "/portal/setup" }, matchPaths: ["/portal/setup"] },
  ];
  return (
    <PortalShell {...topBar} portalNav={portalNav} portalNavLabel={t("nav.portalNav")}>
      {children}
      <Palette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </PortalShell>
  );
}
