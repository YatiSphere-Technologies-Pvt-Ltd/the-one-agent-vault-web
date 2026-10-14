import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/cn";
import { controlClasses, useFieldControlProps } from "./field";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  mono?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/** Searchable single select: Popover + Command, styled as an Input. */
export function Combobox({
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  mono = false,
  disabled,
  id,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const listId = React.useId();
  const fieldProps = useFieldControlProps({ id });
  const selected = options.find((o) => o.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          disabled={disabled}
          className={cn(
            controlClasses,
            "flex h-(--av-size-control-md) items-center justify-between gap-2 px-3 text-start",
            !selected && "text-ink-muted",
            mono && "font-mono text-mono",
            className,
          )}
          {...fieldProps}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-ink-muted" />
        </button>
      </PopoverTrigger>
      <PopoverContent id={listId} className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onValueChange(option.value === value ? null : option.value);
                    setOpen(false);
                  }}
                  className={cn(mono && "font-mono text-mono")}
                >
                  <Check
                    aria-hidden
                    className={cn("size-4", option.value === value ? "opacity-100" : "opacity-0")}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
