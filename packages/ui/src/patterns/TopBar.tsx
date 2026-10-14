import type { ReactNode } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Bell, Search } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../primitives/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../primitives/select";
import { SealGlyph } from "../signature/SealGlyph";
import { useTheme, type ThemePreference } from "../theme/ThemeProvider";
import { isApplePlatform } from "./palette-shortcut";

/** Fixed hash for the wordmark seal. */
export const WORDMARK_HASH = "sha256:5ea1a6e17c0de4b9f2c41d07a3e8b6f9c2d5e81a";

export interface Workspace {
  id: string;
  name: string;
}

export interface ShellUser {
  name: string;
  email: string;
}

export interface TopBarProps {
  homeLink: LinkProps;
  workspaces: Workspace[];
  workspaceId: string;
  onWorkspaceChange: (id: string) => void;
  onOpenSearch: () => void;
  unreadCount: number;
  /** Contents of the bell panel. */
  notificationsPanel: ReactNode;
  user: ShellUser;
  profileLink: LinkProps;
  /** Switch to portal (in the console) or to console (in the portal). */
  switchLink: LinkProps;
  switchLabel: string;
  onSignOut: () => void;
  /** Extra avatar-menu content, e.g. development toggles. */
  accountExtra?: ReactNode;
  /** Leading slot, e.g. the navigation toggle on small screens. */
  leading?: ReactNode;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export function TopBar({
  homeLink,
  workspaces,
  workspaceId,
  onWorkspaceChange,
  onOpenSearch,
  unreadCount,
  notificationsPanel,
  user,
  profileLink,
  switchLink,
  switchLabel,
  onSignOut,
  accountExtra,
  leading,
}: TopBarProps) {
  const { t } = useTranslation("ui");
  const { preference, setPreference } = useTheme();
  const shortcut = isApplePlatform() ? "⌘K" : "Ctrl K";
  return (
    <header className="z-(--av-z-nav) flex h-(--av-size-topbar) shrink-0 items-center gap-4 border-b border-edge bg-surface px-4">
      {leading}
      <Link {...homeLink} className="flex items-center gap-2 rounded-control text-ink no-underline">
        <SealGlyph hash={WORDMARK_HASH} state="intact" size="sm" label={t("shell.wordmark")} decorative />
        <span className="text-title-3">{t("shell.wordmark")}</span>
      </Link>
      {workspaces.length > 1 && (
        <Select value={workspaceId} onValueChange={onWorkspaceChange}>
          <SelectTrigger aria-label={t("shell.workspace")} className="w-auto min-w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {workspaces.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <button
        type="button"
        onClick={onOpenSearch}
        aria-keyshortcuts="Meta+K Control+K"
        className={cn(
          "ms-auto flex h-(--av-size-control-md) w-full max-w-md items-center gap-2 rounded-control border border-edge-strong bg-surface px-3",
          "text-start text-body text-ink-muted hover:bg-hover md:ms-6",
        )}
      >
        <Search aria-hidden className="size-4 shrink-0" />
        <span className="flex-1 truncate">{t("shell.search")}</span>
        <kbd className="hidden rounded-control border border-edge px-1 font-sans text-caption text-ink-muted sm:inline">
          {shortcut}
        </kbd>
      </button>
      <div className="ms-auto flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" iconOnly aria-label={t("shell.notifications")} className="relative text-ink-secondary">
              <Bell aria-hidden />
              {unreadCount > 0 && (
                <>
                  <span aria-hidden className="absolute end-2 top-2 size-2 rounded-pill bg-status-held-solid ring-2 ring-surface" />
                  <span className="sr-only">{t("shell.unread")}</span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            {notificationsPanel}
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`${t("shell.account")}: ${user.name}`}
              className="inline-flex size-(--av-size-control-md) items-center justify-center rounded-pill border border-edge bg-sunken text-label font-semibold text-ink"
            >
              {initials(user.name)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex flex-col">
              <span className="text-label text-ink">{user.name}</span>
              <span>{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link {...profileLink}>{t("shell.profile")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link {...switchLink}>{switchLabel}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{t("theme.label")}</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={preference} onValueChange={(v) => setPreference(v as ThemePreference)}>
              {(["system", "light", "dark"] as const).map((v) => (
                <DropdownMenuRadioItem key={v} value={v}>
                  {t(`theme.${v}`)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {accountExtra}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onSignOut}>{t("shell.signOut")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
