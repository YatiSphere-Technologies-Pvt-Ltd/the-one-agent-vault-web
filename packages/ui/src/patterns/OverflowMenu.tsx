import { useTranslation } from "react-i18next";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu";

export interface OverflowItem {
  id: string;
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

/** "More actions" menu. Destructive items are always placed last, after a separator. */
export function OverflowMenu({ items, label }: { items: OverflowItem[]; label?: string }) {
  const { t } = useTranslation("ui");
  if (items.length === 0) return null;
  const safe = items.filter((i) => !i.destructive);
  const destructive = items.filter((i) => i.destructive);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" iconOnly aria-label={label ?? t("common.more")}>
          <MoreHorizontal aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {safe.map((item) => (
          <DropdownMenuItem key={item.id} disabled={item.disabled ?? false} onSelect={item.onSelect}>
            {item.label}
          </DropdownMenuItem>
        ))}
        {safe.length > 0 && destructive.length > 0 && <DropdownMenuSeparator />}
        {destructive.map((item) => (
          <DropdownMenuItem
            key={item.id}
            variant="destructive"
            disabled={item.disabled ?? false}
            onSelect={item.onSelect}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
