import * as React from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { cn } from "../lib/cn";
import { tabListClasses, tabTriggerActiveClasses, tabTriggerClasses } from "./tabs";

export interface RouteTab {
  /** Stable key, also used as the test id. */
  value: string;
  label: React.ReactNode;
  link: LinkProps;
  /** Exact path matching for index tabs. */
  exact?: boolean;
}

/**
 * Tabs whose value lives in the URL: each tab is a link to a route (or search param), so the
 * selected tab survives reloads, back/forward and sharing. Renders a labelled <nav>.
 */
export function RouteTabs({ tabs, label, className }: { tabs: RouteTab[]; label: string; className?: string }) {
  return (
    <nav aria-label={label} className={cn(tabListClasses, className)}>
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          {...tab.link}
          data-testid={`tab-${tab.value}`}
          activeOptions={{ exact: tab.exact ?? false, includeSearch: false }}
          className={tabTriggerClasses}
          activeProps={{ className: tabTriggerActiveClasses, "aria-current": "page" }}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
