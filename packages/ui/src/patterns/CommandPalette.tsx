import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../primitives/command";

export interface CommandPaletteItem {
  id: string;
  label: string;
  group: string;
  icon?: ReactNode;
  /** Extra search terms, e.g. the screen ID. */
  keywords?: string[];
  hint?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandPaletteItem[];
}

/** The palette dialog. Pair with usePaletteShortcut; load lazily via "@agentvault/ui/command-palette". */
export function CommandPalette({ open, onOpenChange, items }: CommandPaletteProps) {
  const { t } = useTranslation("ui");


  const groups = new Map<string, CommandPaletteItem[]>();
  for (const item of items) groups.set(item.group, [...(groups.get(item.group) ?? []), item]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title={t("shell.search")} description={t("shell.commandPlaceholder")}>
      <CommandInput placeholder={t("shell.commandPlaceholder")} aria-label={t("shell.search")} />
      <CommandList>
        <CommandEmpty>{t("shell.commandEmpty")}</CommandEmpty>
        {[...groups].map(([group, groupItems]) => (
          <CommandGroup key={group} heading={group}>
            {groupItems.map((item) => (
              <CommandItem
                key={item.id}
                value={`${item.label} ${item.id}`}
                keywords={item.keywords ?? []}
                onSelect={() => {
                  onOpenChange(false);
                  item.onSelect();
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.hint && <CommandShortcut className="font-mono">{item.hint}</CommandShortcut>}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
